
class FisheyeLensCorrection {

  constructor() {
    // gl
    this.glCanvas = null
    this.glContext = null
    this.glShader = null
    this.glBufferScreen = {
      buffer: null,
      size: 0,
      count: 0,
    }
    this.srcTexture = {
      buffer: null,
      width: 0,
      height: 0,
    }

    // texture source
    this.srcType = ''
    this.videoSrc = null
    this.videoTimerId = null

    // camera
    this.focalLength = 500;
    this.horizontalAngle = 0;
    this.verticalAngle = 45;

    // mouse pos
    this.mousePosX = 0;
    this.mousePosY = 0;
    this.isMouseDragging = false;
  }

  initialize(canvas){
    this.glCanvas = canvas
    this.glContext = createGLContext(this.glCanvas);
    const gl = this.glContext

    const VERTEX_SHADER_SOURCE = `
    attribute vec3 aVertexPosition;
    void main(){
      gl_Position = vec4( aVertexPosition, 1.0 );
    }
    `
    const FLAGMENT_SHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform vec2 textureSize;
    uniform vec2 screenSize;
    uniform vec3 screenX;
    uniform vec3 screenY;
    uniform vec3 centerPos;
    const float PI = 3.141592;

    vec2 xyz2hv(vec3 v){
      vec2 hv = vec2(0.0, 0.0);
      hv.y = degrees(asin(v.y));
      hv.x = degrees(atan(v.z/v.x));
      if (v.x < 0.0) {
        hv.x += 180.0;
      }
      return hv;
    }

    void main(){
      float w = screenSize.x;
      float h = screenSize.y;
      float x = (w - gl_FragCoord.x);
      float y = (h - gl_FragCoord.y);
      vec3 screenPos = (x-w/2.0) * screenX + (y-h/2.0) * screenY;
      vec3 ray = normalize(screenPos + centerPos);
      vec2 hv = xyz2hv(ray);

      float sw = textureSize.x;
      float sh = textureSize.y;
      float radiusX = 0.5;
      float radiusY = 0.5;
      if(sw > sh){
        radiusX *= sh / sw;
      }else if(sw < sh){
        radiusY *= sw / sh;
      }
      float refX = 0.5 + radiusX * cos(radians(hv.x)) * ( 1.0 - hv.y / 90.0 );
      float refY = 0.5 + radiusY * sin(radians(hv.x)) * ( 1.0 - hv.y / 90.0 );
      if(refX < 0.0 || 1.0 < refX || refY < 0.0 || 1.0 < refY){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }else{
        gl_FragColor = texture2D( uTexture, vec2(refX, refY) );
      }
    }
    `
    this.glShader = createShaderProgram(gl, VERTEX_SHADER_SOURCE, FLAGMENT_SHADER_SOURCE);

    const vertexPos = [
      -1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
      -1.0,  1.0, 0.0,
       1.0,  1.0, 0.0,
       1.0, -1.0, 0.0,
    ];
    this.glBufferScreen.buffer = gl.createBuffer();
    this.glBufferScreen.size = 3;
    this.glBufferScreen.count = vertexPos.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferScreen.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);

    window.addEventListener('resize', this.draw)

    this.glCanvas.onmousedown = (e) => {
      this.isMouseDragging = true;
      this.mousePosX = e.offsetX;
      this.mousePosY = e.offsetY;
    }
    this.glCanvas.onmousemove = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      if(this.isMouseDragging){
        const w = this.glCanvas.width/2;
        const h = this.glCanvas.height/2;
        const prev = calcRayDirection(this.focalLength, this.mousePosX, this.mousePosY, w, h);
        const current = calcRayDirection(this.focalLength, x, y, w, h);
        this.horizontalAngle += current.h - prev.h;
        this.verticalAngle += current.v - prev.v;
        this.draw();
      }
      this.mousePosX = x;
      this.mousePosY = y;
    }
    this.glCanvas.onmouseup = (e) => {
      this.isMouseDragging = false;
    }
    this.glCanvas.onmouseout = (e) => {
      this.isMouseDragging = false;
    }
    this.glCanvas.onmousewheel = (e) => {
      if(e.deltaY > 0){
        this.focalLength *= 0.9;
      }else{
        this.focalLength *= 1.1;
      }
      this.draw();
    }

    this.draw();
  }

  finalize(){
    window.removeEventListener('resize', this.draw)
    this.glContext.deleteTexture(this.srcTexture.buffer);
    this.glContext.deleteBuffer(this.glBufferScreen.buffer);
  }

  setSrcImage(src){
    if(this.srcTexture.buffer){
      this.glContext.deleteTexture(this.srcTexture.buffer);
      this.srcTexture.buffer = null;
    }

    if(this.videoTimerId){
      clearTimeout(this.videoTimerId);
      this.videoTimerId = null;
    }

    this.srcType = 'image'
    this.srcTexture.buffer = createTexture(this.glContext, src);
    this.srcTexture.width = src.width
    this.srcTexture.height = src.height
    this.draw();
  }

  setSrcVideo(src){
    if(this.srcTexture.buffer){
      this.glContext.deleteTexture(this.srcTexture.buffer);
      this.srcTexture.buffer = null;
    }

    if(this.videoTimerId){
      clearTimeout(this.videoTimerId);
      this.videoTimerId = null;
    }

    this.srcType = 'video'
    this.videoSrc = src
    this.srcTexture.buffer = createTexture(this.glContext, src);

    this.videoSrc.addEventListener('play', () => {
      // console.log('play')
      if(this.videoTimerId === null){
        this.videoTimerId = setInterval(() => { 
          // console.log('draw')
          this.draw();
        }, 15)
      }
    })
    this.videoSrc.addEventListener('ended', () => {
      // console.log('eneded')
      clearTimeout(this.videoTimerId);
      this.videoTimerId = null;
    })
    this.videoSrc.addEventListener('pause', () => {
      // console.log('pause')
      clearTimeout(this.videoTimerId);
      this.videoTimerId = null;
    })
  }

  setFocalLength(f){
    this.focalLength = f;
    this.draw();
  }

  setHorizontalAngle(h){
    this.horizontalAngle = h;
    this.draw();
  }

  setVerticalAngle(v){
    this.verticalAngle = v;
    this.draw();
  }

  draw = () => {
    if (this.srcTexture === null) {
      return;
    }

    const gl = this.glContext;

    const w = this.glCanvas.clientWidth
    const h = this.glCanvas.clientHeight
    this.glCanvas.width = w
    this.glCanvas.height = h

    const cameraDirection = hv2xyz(this.horizontalAngle,this.verticalAngle)
    const cameraUp = {x:0, y:1, z:0}
    const screenX = normalize(cross(cameraDirection, cameraUp))
    const screenY = normalize(cross(screenX, cameraDirection))
    const centerPos = multiply(this.focalLength, cameraDirection)

    if(this.srcType === 'video'){
      gl.bindTexture(gl.TEXTURE_2D, this.srcTexture.buffer);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoSrc);
      this.srcTexture.width = this.videoSrc.width
      this.srcTexture.height = this.videoSrc.height
    }

    gl.useProgram(this.glShader);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0, 0, w, h);

    const uTextureSize = gl.getUniformLocation(this.glShader, "textureSize");
    gl.uniform2fv(uTextureSize, [this.srcTexture.width, this.srcTexture.height]);

    const uScreenSize = gl.getUniformLocation(this.glShader, "screenSize");
    gl.uniform2fv(uScreenSize, [w, h]);

    const uScreenX = gl.getUniformLocation(this.glShader, "screenX");
    gl.uniform3fv(uScreenX, [screenX.x, screenX.y, screenX.z]);

    const uScreenY = gl.getUniformLocation(this.glShader, "screenY");
    gl.uniform3fv(uScreenY, [screenY.x, screenY.y, screenY.z]);

    const uCenterPos = gl.getUniformLocation(this.glShader, "centerPos");
    gl.uniform3fv(uCenterPos, [centerPos.x, centerPos.y, centerPos.z]);

    const uTexture = gl.getUniformLocation(this.glShader, "uTexture")
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.srcTexture.buffer);
    gl.uniform1i(uTexture, 0);

    const aPos = gl.getAttribLocation(this.glShader, "aVertexPosition");
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferScreen.buffer);
    gl.vertexAttribPointer(aPos, this.glBufferScreen.size, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.glBufferScreen.count);
    gl.disableVertexAttribArray(aPos);
  }
}
