class Polygon {
  vertices = [
    new Vec3(0, 0, 0),
    new Vec3(0, 0, 0),
    new Vec3(0, 0, 0),
  ]
  normal = new Vec3(0, 0, 0)

  constructor (param) {
    const {vertices, normal} = param
    this.vertices= vertices
    this.normal = normal
  }
}

class Buffer {
  width = 0
  height = 0
  data = []

  constructor (width, height) {
    this.width = width
    this.height = height
    this.data = new Array(width * height)
    this.data.fill(0)
  }

  setValue (x, y, value) {
    const idx = y * this.width + x
    this.data[idx] = value
  }

  getValue (x, y) {
    const idx = y * this.width + x
    return this.data[idx]
  }

  clearBuffer (value) {
    this.data.fill(value)
  }
}

function render (param) {
  const {polygons, view, lightPos, screen} = param

  const polygons2D = convertVertexCoordinates(polygons, view, screen)

  const fragments = rasterize(polygons2D, screen)

  const colors = shading(fragments, lightPos)

  const imageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT)
  for (const c of colors) {
    drawPixel(imageData, c.pos, c.color)
  }

  return imageData
}

function convertVertexCoordinates (polygons, view, screen) {
  const { eye, center, up, fovy, near, far } = view
  const viewMat = lookAt(eye, center, up)
  const projMat = perspective(fovy, screen.width/screen.height, near, far)
  const mat = mulMat4(projMat, viewMat)

  const polygons2D = []
  for (const p of polygons) {
    const vertices = p.vertices
    const vertices2D = []
    for (const v of vertices) {
      const pos = mulMat4Vec4(mat, new Vec4(v.x, v.y, v.z, 1))
      const x = (pos.x / pos.w + 1) * screen.width / 2
      const y = screen.height - (pos.y / pos.w + 1) * screen.height / 2
      const z = pos.z / pos.w
      vertices2D.push({
        pos2D: {x, y, z},
        pos3D: v,
      })
    }
    polygons2D.push({
      vertices: vertices2D,
      normal: p.normal,
    })
  }
  return polygons2D
}

function rasterize(polygons, screen) {
  const zBuffer = new Buffer(screen.width, screen.height)
  zBuffer.clearBuffer(1)

  const fragments = []
  for(const polygon of polygons) {
    const normal = polygon.normal
    const vertices = polygon.vertices
    const p1 = vertices[0].pos2D
    const p2 = vertices[1].pos2D
    const p3 = vertices[2].pos2D
    const p1_3D = vertices[0].pos3D
    const p2_3D = vertices[1].pos3D
    const p3_3D = vertices[2].pos3D
    const left   = Math.floor(Math.min(p1.x, p2.x, p3.x))
    const right  = Math.ceil(Math.max(p1.x, p2.x, p3.x))
    const top    = Math.floor(Math.min(p1.y, p2.y, p3.y))
    const bottom = Math.ceil(Math.max(p1.y, p2.y, p3.y))
    for (let y = top; bottom > y; ++y) {
      for (let x = left; right > x; ++x) {
        const pos2D = {x, y}
        if (isInsideTriangle(p1, p2, p3, pos2D)) {
          const {c1, c2, c3} = calcCentroidCoordinates(p1, p2, p3, pos2D)
          const z = c1 * p1.z + c2 * p2.z + c3 * p3.z
          if (z < zBuffer.getValue(x,y)) {
            zBuffer.setValue(x,y,z)
            const pos3D = addVec3(addVec3(mulVec3(c1, p1_3D), mulVec3(c2, p2_3D)), mulVec3(c3, p3_3D))
            fragments.push({pos2D, pos3D, normal})  
          }
        }
      }
    }
  }
  return fragments
}

function shading(fragments, lightPos) {
  const colors = []
  for (const f of fragments) {
    const lightDir = normalizeVec3(subVec3(lightPos, f.pos3D))
    const diffuse = dotVec3(lightDir, f.normal)
    const r = 255 * diffuse
    const g = 255 * diffuse
    const b = 255 * diffuse
    colors.push({
      pos: f.pos2D, 
      color: {r,g,b}
    })
  }
  return colors
}

function drawPixel (imageData, pos, color) {
  const w = imageData.width
  const h = imageData.height

  if (pos.x < 0 || w <= pos.x || pos.y < 0 || h < pos.y) {
    return
  }

  const idx = (w * pos.y + pos.x) * 4
  imageData.data[idx] = color.r
  imageData.data[idx+1] = color.g
  imageData.data[idx+2] = color.b
  imageData.data[idx+3] = 255
}