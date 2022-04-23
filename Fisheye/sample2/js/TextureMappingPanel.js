
class TextureMappingPanel {

  constructor() {
    // gl
    this.glContext = null
    this.glTextureShader = null
    this.glMappingShader = null
    this.glBufferScreen = {
      buffer: null,
      size: 0,
      count: 0,
    }
    this.glBufferMappingIdx = {
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
    const gl = glContext

    const vs_texture = `
    attribute vec3 aVertexPosition;
    void main(){
      gl_Position = vec4( aVertexPosition, 1.0 );
    }
    `
    const fs_texture = `
    precision mediump float;
    uniform sampler2D uTexture;
    uniform vec2 textureSize;
    uniform vec2 screenOffset;
    uniform vec2 screenSize;
    void main(){
      float tw = textureSize.x;
      float th = textureSize.y;
      float sw = screenSize.x;
      float sh = screenSize.y;
      float x = gl_FragCoord.x - screenOffset.x;
      float y = gl_FragCoord.y - screenOffset.y;
      float at = tw / th;
      float as = sw / sh;
      float refX = x / sw;
      float refY = y / sh;
      float offsetX = 0.0;
      float offsetY = 0.0;
      if(as > at){
        float mapW = sh * tw / th;
        offsetX = (sw - mapW) / 2.0;
        refX = (x - offsetX) / mapW;
      }else if(as < at){
        float mapH = sw * th / tw;
        offsetY = (sh - mapH) / 2.0;
        refY = (y - offsetY) / mapH;
      }
      if(offsetX < x && x < sw - offsetX && offsetY < y && y < sh - offsetY){
        gl_FragColor = texture2D( uTexture, vec2(refX, refY) );
      }else{
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
      }
    }
    `
    this.glTextureShader = createShaderProgram(gl, vs_texture, fs_texture);

    const vs_mapping = `
    attribute vec2 aIdx;
    uniform vec2 cameraImageSize;
    uniform vec3 cameraScreenX;
    uniform vec3 cameraScreenY;
    uniform vec3 centerPos;
    uniform vec2 textureSize;
    uniform vec2 screenSize;

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
      float cw = cameraImageSize.x;
      float ch = cameraImageSize.y;
      float cx = 0.0;
      float cy = 0.0;
      float i = ceil(aIdx.y / 2.0);
      if( aIdx.x < 0.5 ){
        cx = cw * i / 20.0;
      }else if( aIdx.x < 1.5 ){
        cx = cw;
        cy = ch * i / 20.0;
      }else if( aIdx.x < 2.5 ){
        cx = cw * ( 20.0 - i ) / 20.0;
        cy = ch;
      }else if( aIdx.x < 3.5 ){
        cy = ch * ( 20.0 - i ) / 20.0;
      }
      vec3 screenPos = (cx-cw/2.0) * cameraScreenX + (cy-ch/2.0) * cameraScreenY;
      vec3 ray = normalize(screenPos + centerPos);
      vec2 hv = xyz2hv(ray);

      float tw = textureSize.x;
      float th = textureSize.y;
      float radius = min(tw, th) / 2.0;
      float tx = tw / 2.0 + radius * cos(radians(hv.x)) * ( 1.0 - hv.y / 90.0 );
      float ty = th / 2.0 + radius * sin(radians(hv.x)) * ( 1.0 - hv.y / 90.0 );

      float sw = screenSize.x;
      float sh = screenSize.y;
      float at = tw / th;
      float as = sw / sh;
      float offsetX = 0.0;
      float offsetY = 0.0;
      float mapW = sw;
      float mapH = sh;
      if(as > at){
        mapW = sh * tw / th;
        offsetX = (sw - mapW) / 2.0;
      }else if(as < at){
        mapH = sw * th / tw;
        offsetY = (sh - mapH) / 2.0;
      }
      float x = (offsetX + tx / tw * mapW) / sw * 2.0 - 1.0;
      float y = (offsetY + ty / th * mapH) / sh * 2.0 - 1.0;
      gl_Position = vec4(x, y, -0.5, 1.0);
    }
    `
    const fs_mapping = `
    precision mediump float;
    uniform vec4 uColor;
    void main(){
      gl_FragColor = uColor;
    }
    `
    this.glMappingShader = createShaderProgram(gl, vs_mapping, fs_mapping);

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

    const mappingIdx = []
    for(let i = 0; 4 > i; ++i){
      for(let j = 0; 40 > j; ++j){
        mappingIdx.push(i)
        mappingIdx.push(j)
      }
    }
    for(let i = 0; 8 > i; ++i){
      mappingIdx.push(4)
      mappingIdx.push(i)
    }
    this.glBufferMappingIdx.buffer = gl.createBuffer();
    this.glBufferMappingIdx.size = 2;
    this.glBufferMappingIdx.count = mappingIdx.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferMappingIdx.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mappingIdx), gl.STATIC_DRAW);
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

  setViewParams(idx, sw, sh, f, h, v, c){
    this.viewParams[idx].sw = sw
    this.viewParams[idx].sh = sh
    this.viewParams[idx].f = f
    this.viewParams[idx].h = h
    this.viewParams[idx].v = v
    this.viewParams[idx].c = c
  }

  draw(x, y, width, height, cameraCount){
    const gl = this.glContext;
    gl.viewport(x, y, width, height);

    this.drawTexture(x, y, width, height)
    
    for(let i = 0; cameraCount > i; ++i ){
      const c = this.viewParams[i]
      this.drawMapping(x, y, width, height, c.sw, c.sh, c.f, c.h, -c.v, c.c)
    }
  }

  drawTexture(x, y, width, height){
    if (this.srcTexture === null) {
      return;
    }
    const gl = this.glContext;

    if(this.srcType === 'video'){
      gl.bindTexture(gl.TEXTURE_2D, this.srcTexture.buffer);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.videoSrc);
      this.srcTexture.width = this.videoSrc.videoWidth
      this.srcTexture.height = this.videoSrc.videoHeight
    }

    gl.useProgram(this.glTextureShader);
    gl.viewport(x, y, width, height);

    const uTextureSize = gl.getUniformLocation(this.glTextureShader, "textureSize");
    gl.uniform2fv(uTextureSize, [this.srcTexture.width, this.srcTexture.height]);

    const uScreenOffset = gl.getUniformLocation(this.glTextureShader, "screenOffset");
    gl.uniform2fv(uScreenOffset, [x, y]);

    const uScreenSize = gl.getUniformLocation(this.glTextureShader, "screenSize");
    gl.uniform2fv(uScreenSize, [width, height]);

    const uTexture = gl.getUniformLocation(this.glTextureShader, "uTexture")
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.srcTexture.buffer);
    gl.uniform1i(uTexture, 0);

    const aPos = gl.getAttribLocation(this.glTextureShader, "aVertexPosition");
    gl.enableVertexAttribArray(aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferScreen.buffer);
    gl.vertexAttribPointer(aPos, this.glBufferScreen.size, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.glBufferScreen.count);
    gl.disableVertexAttribArray(aPos);
  }

  drawMapping(sx, sy, sw, sh, cw, ch, focalLenth, horizontalAngle, verticalAngle, color){
    if (this.srcTexture === null) {
      return;
    }
    const gl = this.glContext;

    const cameraDirection = hv2xyz(horizontalAngle, verticalAngle)
    const cameraUp = {x:0, y:1, z:0}
    const screenX = normalize(cross(cameraDirection, cameraUp))
    const screenY = normalize(cross(screenX, cameraDirection))
    const centerPos = multiply(focalLenth, cameraDirection)

    gl.useProgram(this.glMappingShader);

    const uTextureSize = gl.getUniformLocation(this.glMappingShader, "textureSize");
    gl.uniform2fv(uTextureSize, [this.srcTexture.width, this.srcTexture.height]);

    const uCameraImageSize = gl.getUniformLocation(this.glMappingShader, "cameraImageSize");
    gl.uniform2fv(uCameraImageSize, [cw, ch]);

    const uScreenX = gl.getUniformLocation(this.glMappingShader, "cameraScreenX");
    gl.uniform3fv(uScreenX, [screenX.x, screenX.y, screenX.z]);

    const uScreenY = gl.getUniformLocation(this.glMappingShader, "cameraScreenY");
    gl.uniform3fv(uScreenY, [screenY.x, screenY.y, screenY.z]);

    const uScreenSize = gl.getUniformLocation(this.glMappingShader, "screenSize");
    gl.uniform2fv(uScreenSize, [sw, sh]);

    const uCenterPos = gl.getUniformLocation(this.glMappingShader, "centerPos");
    gl.uniform3fv(uCenterPos, [centerPos.x, centerPos.y, centerPos.z]);

    const uColor = gl.getUniformLocation(this.glMappingShader, "uColor"); 
    gl.uniform4fv(uColor, color);

    const aIdx = gl.getAttribLocation(this.glMappingShader, "aIdx");
    gl.enableVertexAttribArray(aIdx);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBufferMappingIdx.buffer);
    gl.vertexAttribPointer(aIdx, this.glBufferMappingIdx.size, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, this.glBufferMappingIdx.count);
    gl.disableVertexAttribArray(aIdx);
  }
}
