
class ViewDirectionPanel {

  constructor() {
    // gl
    this.glContext = null
    this.glSphereShader = null
    this.glBufferSphere = {
      buffer: null,
      size: 0,
      count: 0,
    }
    this.glViewShader = null
    this.glBufferCamera = {
      buffer: null,
      size: 0,
      count: 0,
    }

    // view
    this.viewParams = [
      { sw:0, sh:0, f: 0, h: 0, v:0, c:[1.0, 0.0, 0.0, 1.0] },
      { sw:0, sh:0, f: 0, h: 0, v:0, c:[1.0, 1.0, 0.0, 1.0] },
      { sw:0, sh:0, f: 0, h: 0, v:0, c:[0.0, 1.0, 1.0, 1.0] },
      { sw:0, sh:0, f: 0, h: 0, v:0, c:[0.0, 1.0, 0.0, 1.0] },
    ]
  }

  initialize(glContext){
    this.glContext = glContext
    this.createShader()
    this.createBuffer()
  }

  finalize(){
    this.glContext.deleteBuffer(this.glBufferSphere.buffer);
  }

  createShader(){
    const gl = this.glContext

    const vs_sphere = `
    attribute vec3 aVertexPosition;
    uniform mat4 uViewMat;
    uniform mat4 uProjMat;
    varying vec3 vVertexPosition;
    void main()
    {
      vVertexPosition = aVertexPosition;
      gl_Position = uProjMat * uViewMat * vec4( aVertexPosition, 1.0 );

    }`
    const fs_sphere = `
    precision mediump float;
    uniform vec4 uColor;
    uniform vec3 uCameraPosition;
    varying vec3 vVertexPosition;
    void main()
    {
      float d = distance(uCameraPosition, vVertexPosition);
      float a = 15.0 / ( 1.0 + d * d );
      gl_FragColor = vec4(a * uColor.xyz, 1.0);
    }`
    this.glSphereShader = createShaderProgram(gl, vs_sphere, fs_sphere);

    const vs_view = `
    attribute vec2 aIdx;
    uniform vec2 screenSize;
    uniform vec3 screenX;
    uniform vec3 screenY;
    uniform vec3 centerPos;
    uniform mat4 uWorldMat;
    uniform mat4 uViewMat;
    uniform mat4 uProjMat;
    varying vec3 vVertexPosition;
    void main()
    {
      float w = screenSize.x;
      float h = screenSize.y;
      float x = 0.0;
      float y = 0.0;
      float i = ceil(aIdx.y / 2.0);
      if( aIdx.x < 0.5 ){
        x = w * i / 20.0;
      }else if( aIdx.x < 1.5 ){
        x = w;
        y = h * i / 20.0;
      }else if( aIdx.x < 2.5 ){
        x = w * ( 20.0 - i ) / 20.0;
        y = h;
      }else if( aIdx.x < 3.5 ){
        y = h * ( 20.0 - i ) / 20.0;
      }else if( aIdx.x < 4.5 ){
        if( mod(aIdx.y, 2.0) > 0.5 ){
          vVertexPosition = vec3( 0.0, 0.0, 0.0 );
          gl_Position = uProjMat * uViewMat * vec4( 0.0, 0.0, 0.0, 1.0 );
          return;
        }else{
          if( i < 0.5 ){
            x = w;
          }else if( i < 1.5 ){
            y = h;
          }else if( i < 2.5 ){
            x = w;
            y = h;
          }
        }
      }

      vec3 screenPos = (x-w/2.0) * screenX + (y-h/2.0) * screenY;
      vec3 spherePos = normalize(screenPos + centerPos);
      vVertexPosition = spherePos;
      gl_Position = uProjMat * uViewMat * vec4( spherePos, 1.0 );
    }`
    const fs_view = `
    precision mediump float;
    uniform vec4 uColor;
    uniform vec3 uCameraPosition;
    varying vec3 vVertexPosition;
    void main()
    {
      float d = distance(uCameraPosition, vVertexPosition);
      float a = 40.0 / ( 1.0 + d * d * d );
      gl_FragColor = vec4(a * uColor.xyz, 1.0);
    }`
    this.glViewShader = createShaderProgram(gl, vs_view, fs_view);
  }

  createBuffer(){
    const gl = this.glContext

    // sphere
    const vertexPos = [];
    let slices = 16;
    let stacks = 50;
    let h = 2 * Math.PI;
    let v = Math.PI / 2;
    for(let i = 0; stacks > i; ++i){
      for(let j = 0; slices + 1 > j; ++j){
        const y1 = -Math.cos(v * i / stacks);
        const r1 = Math.sin(v * i / stacks);
        const x1 = r1 * Math.sin(h * j / slices);
        const z1 = r1 * Math.cos(h * j / slices);
        vertexPos.push(x1);
        vertexPos.push(y1);
        vertexPos.push(z1);
        const y2 = -Math.cos(v * (i+1) / stacks);
        const r2 = Math.sin(v * (i+1) / stacks);
        const x2 = r2 * Math.sin(h * j / slices);
        const z2 = r2 * Math.cos(h * j / slices);
        vertexPos.push(x2);
        vertexPos.push(y2);
        vertexPos.push(z2);
      }
    }
    slices = 50;
    stacks = 8;
    h = 2 * Math.PI;
    v = Math.PI / 2;
    for(let i = 0; stacks + 1 > i; ++i){
      for(let j = 0; slices > j; ++j){
        const y1 = -Math.cos(v * i / stacks);
        const r1 = Math.sin(v * i / stacks);
        const x1 = r1 * Math.sin(h * j / slices);
        const z1 = r1 * Math.cos(h * j / slices);
        vertexPos.push(x1);
        vertexPos.push(y1);
        vertexPos.push(z1);
        const y2 = -Math.cos(v * i / stacks);
        const r2 = Math.sin(v * i / stacks);
        const x2 = r2 * Math.sin(h * (j+1) / slices);
        const z2 = r2 * Math.cos(h * (j+1) / slices);
        vertexPos.push(x2);
        vertexPos.push(y2);
        vertexPos.push(z2);
      }
    }
    this.glBufferSphere.buffer = gl.createBuffer();
    this.glBufferSphere.size = 3;
    this.glBufferSphere.count = vertexPos.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferSphere.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);

    const cameraIdx = []
    for(let i = 0; 4 > i; ++i){
      for(let j = 0; 40 > j; ++j){
        cameraIdx.push(i)
        cameraIdx.push(j)
      }
    }
    for(let i = 0; 8 > i; ++i){
      cameraIdx.push(4)
      cameraIdx.push(i)
    }
    this.glBufferCamera.buffer = gl.createBuffer();
    this.glBufferCamera.size = 2;
    this.glBufferCamera.count = cameraIdx.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferCamera.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cameraIdx), gl.STATIC_DRAW);
  }

  setViewParams(idx, sw, sh, f, h, v, c){
    this.viewParams[idx].sw = sw
    this.viewParams[idx].sh = sh
    this.viewParams[idx].f = f
    this.viewParams[idx].h = h
    this.viewParams[idx].v = v
    this.viewParams[idx].c = c
  }

  draw(x, y, width, height, h, v, cameraCount){
    const gl = this.glContext;

    gl.viewport(x, y, width, height);
    gl.enable(gl.DEPTH_TEST);

    const cameraPosY = 4.5 * Math.cos( Math.PI / 180 * v )
    const cameraPosX = 4.5 * Math.sin( Math.PI / 180 * v ) * Math.cos( Math.PI / 180 * h )
    const cameraPosZ = 4.5 * Math.sin( Math.PI / 180 * v ) * Math.sin( Math.PI / 180 * h )
    const cameraPos = [cameraPosX, cameraPosY - 0.5, cameraPosZ];
    const lookAt = [0, -0.5, 0];
    const cameraUp = [0, 1, 0];
    const viewMat = mat4.lookAt(cameraPos, lookAt, cameraUp);

    const fovy = 30
    const aspect = width / height
    const near = 0.1
    const far = 1000
    const projMat = mat4.perspective(fovy, aspect, near, far);

    this.drawSphere(cameraPos, viewMat, projMat)

    for(let i = 0; cameraCount > i; ++i ){
      const c = this.viewParams[i]
      this.drawView(cameraPos, c.sw, c.sh, c.f, c.h, c.v, c.c, viewMat, projMat)
    }
  }

  drawSphere(cameraPos, viewMat, projMat){
    const gl = this.glContext;
    gl.useProgram(this.glSphereShader);

    const uViewMat  = gl.getUniformLocation(this.glSphereShader, "uViewMat");
    gl.uniformMatrix4fv(uViewMat, false, viewMat);

    const uProjMat  = gl.getUniformLocation(this.glSphereShader, "uProjMat");
    gl.uniformMatrix4fv(uProjMat, false, projMat);

    const uColor = gl.getUniformLocation(this.glSphereShader, "uColor"); 
    gl.uniform4fv(uColor, [0.3, 0.3, 0.3, 1.0]);

    const uCameraPosition = gl.getUniformLocation(this.glSphereShader, "uCameraPosition"); 
    gl.uniform3fv(uCameraPosition, cameraPos);

    const aPos = gl.getAttribLocation(this.glSphereShader, "aVertexPosition");
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferSphere.buffer);
    gl.vertexAttribPointer(aPos, this.glBufferSphere.size, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, this.glBufferSphere.count);
    gl.disableVertexAttribArray(aPos);
  }

  drawView(cameraPos, sw, sh, focalLenth, horizontalAngle, verticalAngle, color, viewMat, projMat){
    const gl = this.glContext;
    gl.useProgram(this.glViewShader);

    const cameraDirection = hv2xyz(horizontalAngle, verticalAngle)
    const cameraUp = {x:0, y:1, z:0}
    const screenX = normalize(cross(cameraDirection, cameraUp))
    const screenY = normalize(cross(screenX, cameraDirection))
    const centerPos = multiply(focalLenth, cameraDirection)

    const uViewMat  = gl.getUniformLocation(this.glViewShader, "uViewMat");
    gl.uniformMatrix4fv(uViewMat, false, viewMat);

    const uProjMat  = gl.getUniformLocation(this.glViewShader, "uProjMat");
    gl.uniformMatrix4fv(uProjMat, false, projMat);

    const uScreenSize = gl.getUniformLocation(this.glViewShader, "screenSize");
    gl.uniform2fv(uScreenSize, [sw, sh]);

    const uScreenX = gl.getUniformLocation(this.glViewShader, "screenX");
    gl.uniform3fv(uScreenX, [screenX.x, screenX.y, screenX.z]);

    const uScreenY = gl.getUniformLocation(this.glViewShader, "screenY");
    gl.uniform3fv(uScreenY, [screenY.x, screenY.y, screenY.z]);

    const uCenterPos = gl.getUniformLocation(this.glViewShader, "centerPos");
    gl.uniform3fv(uCenterPos, [centerPos.x, centerPos.y, centerPos.z]);

    const uColor = gl.getUniformLocation(this.glViewShader, "uColor"); 
    gl.uniform4fv(uColor, color);

    const uCameraPosition = gl.getUniformLocation(this.glViewShader, "uCameraPosition"); 
    gl.uniform3fv(uCameraPosition, cameraPos);

    const aIdx = gl.getAttribLocation(this.glViewShader, "aIdx");
    gl.enableVertexAttribArray(aIdx);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferCamera.buffer);
    gl.vertexAttribPointer(aIdx, this.glBufferCamera.size, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, this.glBufferCamera.count);
    gl.disableVertexAttribArray(aIdx);
  }
}