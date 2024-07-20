function render(param) {
  const {vertices, view, screen} = param

  const vertices2D = convertVertexCoordinates(vertices, view, screen)

  const imageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT)
  for (const v of vertices2D) {
    drawCircle(imageData, v, 5, {r:255, g:0, b:0})
  }

  return imageData
}

function convertVertexCoordinates (vertices, view, screen) {
  const { eye, center, up, fovy, near, far } = view
  const viewMat = lookAt(eye, center, up)
  const projMat = perspective(fovy, screen.width/screen.height, near, far)
  const mat = mulMat4(projMat, viewMat)

  const vertices2D = []
  for (const v of vertices) {
    const pos = mulMat4Vec4(mat, new Vec4(v.x, v.y, v.z, 1))
    const x = (pos.x / pos.w + 1) * screen.width / 2
    const y = screen.height - (pos.y / pos.w + 1) * screen.height / 2
    vertices2D.push({x, y})
  }
  return vertices2D
}

function drawCircle (imageData, pos, radius, color) {
  for (let y = -radius; radius > y; ++y) {
    for (let x = -radius; radius > x; ++x) {
      if (x*x + y*y < radius*radius) {
        const p = {
          x: Math.round(pos.x) + x,
          y: Math.round(pos.y) + y,
        }
        drawPixel(imageData, p, color)
      }
    }
  }
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
