class Polygon {
  vertices = [
    new Vec3(0, 0, 0),
    new Vec3(0, 0, 0),
    new Vec3(0, 0, 0),
  ]

  constructor (v1, v2, v3) {
    this.vertices[0] = v1
    this.vertices[1] = v2
    this.vertices[2] = v3
  }
}

function render(param) {
  const {polygons, view, screen} = param

  const polygons2D = convertVertexCoordinates(polygons, view, screen)

  const fragments = rasterize(polygons2D)

  const imageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT)
  for (const f of fragments) {
    drawPixel(imageData, f, {r:255, g:0, b:0})
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
      vertices2D.push({x, y})
    }
    polygons2D.push({
      vertices: vertices2D
    })
  }
  return polygons2D
}

function rasterize(polygons) {
  const fragments = []
  for(const polygon of polygons) {
    const vertices = polygon.vertices
    const v1 = vertices[0]
    const v2 = vertices[1]
    const v3 = vertices[2]
    const left   = Math.floor(Math.min(v1.x, v2.x, v3.x))
    const right  = Math.ceil(Math.max(v1.x, v2.x, v3.x))
    const top    = Math.floor(Math.min(v1.y, v2.y, v3.y))
    const bottom = Math.ceil(Math.max(v1.y, v2.y, v3.y))
    for (let y = top; bottom > y; ++y) {
      for (let x = left; right > x; ++x) {
        if (isInsideTriangle(v1, v2, v3, {x,y})) {
          fragments.push({x, y})
        }
      }
    }
  }
  return fragments
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