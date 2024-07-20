const load = (data) => {
  const lines = data.split('\n')

  let xMax = -1000000
  let xMin = 1000000
  let yMax = -1000000
  let yMin = 1000000
  let zMax = -1000000
  let zMin = 1000000

  const vertices = []
  const faces = []
  for (const line of lines) {
    if (line[0] === '#') {
      continue;
    }

    if (line[0] === 'v' && line[1] === ' ') {
      const values = line.split(' ')
      const x = Number(values[1])
      const y = Number(values[2])
      const z = Number(values[3])
      xMax = Math.max(x, xMax)
      xMin = Math.min(x, xMin)
      yMax = Math.max(y, yMax)
      yMin = Math.min(y, yMin)
      zMax = Math.max(z, zMax)
      zMin = Math.min(z, zMin)
      vertices.push({x, y, z})
    }

    if (line[0] === 'f') {
      const values= line.split(' ')
      const v1 = Number(values[1].split('/')[0])
      const v2 = Number(values[2].split('/')[0])
      const v3 = Number(values[3].split('/')[0])
      faces.push({v1, v2, v3})
    }
  }

  const polygons = []
  for (const face of faces) {
    const v1 = vertices[face.v1 - 1]
    const v2 = vertices[face.v2 - 1]
    const v3 = vertices[face.v3 - 1]
    const v21 = subVec3(v1, v2)
    const v31 = subVec3(v1, v3)
    const normal = normalizeVec3(crossVec3(v21, v31))
    polygons.push({
      vertices: [v1, v2, v3],
      normal, 
    })
  }

  range = {
    x: { min:xMin, max:xMax },
    y: { min:yMin, max:yMax },
    z: { min:zMin, max:zMax },
  }

  center = {
    x: (xMin + xMax) / 2,
    y: (yMin + yMax) / 2,
    z: (zMin + zMax) / 2,
  }

  return { polygons, range, center }
}