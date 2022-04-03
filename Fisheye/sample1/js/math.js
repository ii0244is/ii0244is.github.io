function add( v1, v2 ){
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z,
  }
}

function multiply( a, v ){
  return { x:a*v.x, y:a*v.y, z:a*v.z }
}

function cross( v1, v2 ){
  return {
    x: v1.y * v2.z - v2.y * v1.z,
    y: v1.z * v2.x - v2.z * v1.x,
    z: v1.x * v2.y - v2.x * v1.y,
  }
}

function abs( v ){
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
}

function normalize( v ){
  const a = abs(v)
  return { x:v.x/a, y:v.y/a, z:v.z/a }
}

function hv2xyz(h,v){
  const y = Math.sin(v * Math.PI/180)
  const x = Math.cos(v * Math.PI/180) * Math.cos(h * Math.PI/180)
  const z = Math.cos(v * Math.PI/180) * Math.sin(h * Math.PI/180)
  return {x, y, z}
}

function xyz2hv(x, y, z){
  const v = Math.asin(y) * 180 / Math.PI
  let h = Math.atan(z/x) * 180 / Math.PI
  if ( x < 0 ) {
    h += 180
  }
  return {h, v}
}

function calcRayDirection(f, x, y, w, h){
  const cameraDirection = {x:0, y:0, z:1}
  const cameraUp = {x:0, y:1, z:0}
  const screenX = normalize(cross(cameraDirection, cameraUp))
  const screenY = normalize(cross(screenX, cameraDirection))
  const centerPos = multiply(f, cameraDirection)
  const screenPos = add(multiply(x-w/2, screenX), multiply(-y+h/2, screenY))
  const ray = add(screenPos, centerPos)
  const spherePos = normalize(ray)
  return xyz2hv(spherePos.x, spherePos.y, spherePos.z)
}
