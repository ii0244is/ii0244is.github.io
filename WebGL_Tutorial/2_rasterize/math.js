class Vec2 {
  x = 0;
  y = 0;

  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}

class Vec3 {
  x = 0;
  y = 0;
  z = 0;

  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Vec4 {
  x = 0;
  y = 0;
  z = 0;
  w = 0;

  constructor (x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

class Mat3 {
  v11 = 0;
  v12 = 0;
  v13 = 0;
  v21 = 0;
  v22 = 0;
  v23 = 0;
  v31 = 0;
  v32 = 0;
  v33 = 0;

  constructor (
    v11, v12, v13, 
    v21, v22, v23, 
    v31, v32, v33
  ) {
    this.v11 = v11;
    this.v12 = v12;
    this.v13 = v13;
    this.v21 = v21;
    this.v22 = v22;
    this.v23 = v23;
    this.v31 = v31;
    this.v32 = v32;
    this.v33 = v33;
  }
}

class Mat4 {
  v11 = 0;
  v12 = 0;
  v13 = 0;
  v14 = 0;
  v21 = 0;
  v22 = 0;
  v23 = 0;
  v24 = 0;
  v31 = 0;
  v32 = 0;
  v33 = 0;
  v34 = 0;
  v41 = 0;
  v42 = 0;
  v43 = 0;
  v44 = 0;

  constructor (
    v11, v12, v13, v14, 
    v21, v22, v23, v24,
    v31, v32, v33, v34,
    v41, v42, v43, v44,
  ) {
    this.v11 = v11;
    this.v12 = v12;
    this.v13 = v13;
    this.v14 = v14;
    this.v21 = v21;
    this.v22 = v22;
    this.v23 = v23;
    this.v24 = v24;
    this.v31 = v31;
    this.v32 = v32;
    this.v33 = v33;
    this.v34 = v34;
    this.v41 = v41;
    this.v42 = v42;
    this.v43 = v43;
    this.v44 = v44;
  }

}

const addVec3 = (a, b) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z,
  }
}

const subVec3 = (a, b) => {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
    z: a.z - b.z,
  }
}

const dotVec3 = (a, b) => {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

const addMat3 = (a, b) => {
  return {
    v11: a.v11 + b.v11,
    v12: a.v12 + b.v12,
    v13: a.v13 + b.v13,
    v21: a.v21 + b.v21,
    v22: a.v22 + b.v22,
    v23: a.v23 + b.v23,
    v31: a.v31 + b.v31,
    v32: a.v32 + b.v32,
    v33: a.v33 + b.v33,
  }
}

const subMat3 = (a, b) => {
  return {
    v11: a.v11 - b.v11,
    v12: a.v12 - b.v12,
    v13: a.v13 - b.v13,
    v21: a.v21 - b.v21,
    v22: a.v22 - b.v22,
    v23: a.v23 - b.v23,
    v31: a.v31 - b.v31,
    v32: a.v32 - b.v32,
    v33: a.v33 - b.v33,
  }
}

const mulMat3 = (a, b) => {
  return {
    v11: a.v11 * b.v11 + a.v12 * b.v21 + a.v13 * b.v31,
    v12: a.v11 * b.v12 + a.v12 * b.v22 + a.v13 * b.v32,
    v13: a.v11 * b.v13 + a.v12 * b.v23 + a.v13 * b.v33,
    v21: a.v21 * b.v11 + a.v22 * b.v21 + a.v23 * b.v31,
    v22: a.v21 * b.v12 + a.v22 * b.v22 + a.v23 * b.v32,
    v23: a.v21 * b.v13 + a.v22 * b.v23 + a.v23 * b.v33,
    v31: a.v31 * b.v11 + a.v32 * b.v21 + a.v33 * b.v31,
    v32: a.v31 * b.v12 + a.v32 * b.v22 + a.v33 * b.v32,
    v33: a.v31 * b.v13 + a.v32 * b.v23 + a.v33 * b.v33,
  }
}

const addMat4 = (a, b) => {
  return {
    v11: a.v11 + b.v11,
    v12: a.v12 + b.v12,
    v13: a.v13 + b.v13,
    v14: a.v14 + b.v14,
    v21: a.v21 + b.v21,
    v22: a.v22 + b.v22,
    v23: a.v23 + b.v23,
    v24: a.v24 + b.v24,
    v31: a.v31 + b.v31,
    v32: a.v32 + b.v32,
    v33: a.v33 + b.v33,
    v34: a.v34 + b.v34,
    v41: a.v41 + b.v41,
    v42: a.v42 + b.v42,
    v43: a.v43 + b.v43,
    v44: a.v44 + b.v44,
  }
}

const subMat4 = (a, b) => {
  return {
    v11: a.v11 - b.v11,
    v12: a.v12 - b.v12,
    v13: a.v13 - b.v13,
    v14: a.v14 - b.v14,
    v21: a.v21 - b.v21,
    v22: a.v22 - b.v22,
    v23: a.v23 - b.v23,
    v24: a.v24 - b.v24,
    v31: a.v31 - b.v31,
    v32: a.v32 - b.v32,
    v33: a.v33 - b.v33,
    v34: a.v34 - b.v34,
    v41: a.v41 - b.v41,
    v42: a.v42 - b.v42,
    v43: a.v43 - b.v43,
    v44: a.v44 - b.v44,
  }
}

const mulMat4 = (a, b) => {
  return {
    v11: a.v11 * b.v11 + a.v12 * b.v21 + a.v13 * b.v31 + a.v14 * b.v41,
    v12: a.v11 * b.v12 + a.v12 * b.v22 + a.v13 * b.v32 + a.v14 * b.v42,
    v13: a.v11 * b.v13 + a.v12 * b.v23 + a.v13 * b.v33 + a.v14 * b.v43,
    v14: a.v11 * b.v14 + a.v12 * b.v24 + a.v13 * b.v34 + a.v14 * b.v44,
    v21: a.v21 * b.v11 + a.v22 * b.v21 + a.v23 * b.v31 + a.v24 * b.v41,
    v22: a.v21 * b.v12 + a.v22 * b.v22 + a.v23 * b.v32 + a.v24 * b.v42,
    v23: a.v21 * b.v13 + a.v22 * b.v23 + a.v23 * b.v33 + a.v24 * b.v43,
    v24: a.v21 * b.v14 + a.v22 * b.v24 + a.v23 * b.v34 + a.v24 * b.v44,
    v31: a.v31 * b.v11 + a.v32 * b.v21 + a.v33 * b.v31 + a.v34 * b.v41,
    v32: a.v31 * b.v12 + a.v32 * b.v22 + a.v33 * b.v32 + a.v34 * b.v42,
    v33: a.v31 * b.v13 + a.v32 * b.v23 + a.v33 * b.v33 + a.v34 * b.v43,
    v34: a.v31 * b.v14 + a.v32 * b.v24 + a.v33 * b.v34 + a.v34 * b.v44,
    v41: a.v41 * b.v11 + a.v42 * b.v21 + a.v43 * b.v31 + a.v44 * b.v41,
    v42: a.v41 * b.v12 + a.v42 * b.v22 + a.v43 * b.v32 + a.v44 * b.v42,
    v43: a.v41 * b.v13 + a.v42 * b.v23 + a.v43 * b.v33 + a.v44 * b.v43,
    v44: a.v41 * b.v14 + a.v42 * b.v24 + a.v43 * b.v34 + a.v44 * b.v44,
  }
}

const mulMat4Vec4 = (a, b) => {
  return {
    x: a.v11 * b.x + a.v12 * b.y + a.v13 * b.z + a.v14 * b.w,
    y: a.v21 * b.x + a.v22 * b.y + a.v23 * b.z + a.v24 * b.w,
    z: a.v31 * b.x + a.v32 * b.y + a.v33 * b.z + a.v34 * b.w,
    w: a.v41 * b.x + a.v42 * b.y + a.v43 * b.z + a.v44 * b.w,
  }
}

const lookAt = (eye, center, up) => {
  let z0 = eye.x - center.x;
  let z1 = eye.y - center.y;
  let z2 = eye.z - center.z;
  let len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  let x0 = up.y * z2 - up.z * z1;
  let x1 = up.z * z0 - up.x * z2;
  let x2 = up.x * z1 - up.y * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  let y0 = z1 * x2 - z2 * x1;
  let y1 = z2 * x0 - z0 * x2;
  let y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  return {
    v11: x0,
    v21: y0,
    v31: z0,
    v41: 0,
    v12: x1,
    v22: y1,
    v32: z1,
    v42: 0,
    v13: x2,
    v23: y2,
    v33: z2,
    v43: 0,
    v14: -(x0 * eye.x + x1 * eye.y + x2 * eye.z),
    v24: -(y0 * eye.x + y1 * eye.y + y2 * eye.z),
    v34: -(z0 * eye.x + z1 * eye.y + z2 * eye.z),
    v44: 1,
  }
}

const perspective = (fovy, aspect, near, far) => {
  const f = 1.0 / Math.tan(fovy / 2);

  let v33 = -1;
  let v34 = -2 * near;
  if (far != null && far !== Infinity) {
    const nf = 1 / (near - far);
    v33 = (far + near) * nf;
    v34 = 2 * far * near * nf;
  }

  return {
    v11 : f / aspect,
    v21 : 0,
    v31 : 0,
    v41 : 0,
    v12 : 0,
    v22 : f,
    v32 : 0,
    v42 : 0,
    v13 : 0,
    v23 : 0,
    v33 : v33,
    v43 : -1,
    v14 : 0,
    v24 : 0,
    v34 : v34,
    v44 : 0,
  }
}

const toRad = (deg) => {
  return Math.PI * deg / 180
}

const toDeg = (rad) => {
  return rad * 180 / Math.PI
}

const isInsideTriangle = (v1, v2, v3, p) => {
  const v12 = subVec3(v2, v1)
  const v2p = subVec3(p, v2)
  const v23 = subVec3(v3, v2)
  const v3p = subVec3(p, v3)
  const v31 = subVec3(v1, v3)
  const v1p = subVec3(p, v1)
  const c1 = v12.x * v2p.y - v12.y * v2p.x
  const c2 = v23.x * v3p.y - v23.y * v3p.x
  const c3 = v31.x * v1p.y - v31.y * v1p.x
  return ( c1 > 0 && c2 > 0 && c3 > 0 ) || ( c1 < 0 && c2 < 0 && c3 < 0 )
}