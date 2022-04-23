
class FisheyeLensCorrectionPanel {

  constructor() {
    // gl
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
  }

  initialize(glContext){
    this.glContext = glContext
    const gl = glContext

    const VERTEX_SHADER_SOURCE = `
    attribute vec3 aVertexPosition;
    void main(){
      gl_Position = vec4( aVertexPosition, 1.0 );
    }
    `
    const FLAGMENT_SHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform vec4 frameColor;
    uniform vec2 textureSize;
    uniform vec2 screenOffset;
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
      float x = (w - gl_FragCoord.x + screenOffset.x);
      float y = (h - gl_FragCoord.y + screenOffset.y);
      if(frameColor.w > 0.0){
        if(x <= 2.0 || w-2.0 <= x || y <= 2.0 || h-2.0 <= y){
          gl_FragColor = frameColor;
          return;
        }
      }

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
  }

  finalize(){
    this.glContext.deleteTexture(this.srcTexture.buffer);
    this.glContext.deleteBuffer(this.glBufferScreen.buffer);
  }

  setSrcImage(src){
    if(this.srcTexture.buffer){
      this.glContext.deleteTexture(this.srcTexture.buffer);
      this.srcTexture.buffer = null;
    }
    this.srcType = 'image'
    this.srcTexture.buffer = createTexture(this.glContext, src);
    this.srcTexture.width = src.width
    this.srcTexture.height = src.height
  }

  setSrcVideo(src){
    if(this.srcTexture.buffer){
      this.glContext.deleteTexture(this.srcTexture.buffer);
      this.srcTexture.buffer = null;
    }
    this.srcType = 'video'
    this.videoSrc = src
    this.srcTexture.buffer = createTexture(this.glContext, src);
  }

  draw(x, y, width, height, focalLenth, horizontalAngle, verticalAngle, color){
    if (this.srcTexture === null) {
      return;
    }
    const gl = this.glContext;

    const cameraDirection = hv2xyz(horizontalAngle, verticalAngle)
    const cameraUp = {x:0, y:1, z:0}
    const screenX = normalize(cross(cameraDirection, cameraUp))
    const screenY = normalize(cross(screenX, cameraDirection))
    const centerPos = multiply(focalLenth, cameraDirection)

    if(this.srcType === 'video'){
      gl.bindTexture(gl.TEXTURE_2D, this.srcTexture.buffer);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoSrc);
      this.srcTexture.width = this.videoSrc.videoWidth
      this.srcTexture.height = this.videoSrc.videoHeight
    }

    gl.useProgram(this.glShader);
    gl.viewport(x, y, width, height);

    const uFrameColor = gl.getUniformLocation(this.glShader, "frameColor");
    gl.uniform4fv(uFrameColor, color);

    const uTextureSize = gl.getUniformLocation(this.glShader, "textureSize");
    gl.uniform2fv(uTextureSize, [this.srcTexture.width, this.srcTexture.height]);

    const uScreenOffset = gl.getUniformLocation(this.glShader, "screenOffset");
    gl.uniform2fv(uScreenOffset, [x, y]);

    const uScreenSize = gl.getUniformLocation(this.glShader, "screenSize");
    gl.uniform2fv(uScreenSize, [width, height]);

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
