class FisheyeLensApp {

  constructor() {
    // gl
    this.glCanvas = null
    this.glContext = null
    this.fisheyeLensCorrectionPanel = null
    this.textureMappingPanel = null
    this.viewDirectionPanel = null

    // texture source
    this.srcType = ''
    this.videoSrc = null
    this.videoTimerId = null

    // camera
    this.viewParams = [
      { f: 800, h: 0, v:30 },
      { f: 800, h: 90, v:30 },
      { f: 800, h: 180, v:30 },
      { f: 800, h: 270, v:30 },
    ]

    // screen
    this.screenParams = [
      { x: 0, y:0, w:0, h:0, c:[1.0, 0.0, 0.0, 1.0] },
      { x: 0, y:0, w:0, h:0, c:[1.0, 1.0, 0.0, 1.0] },
      { x: 0, y:0, w:0, h:0, c:[0.0, 1.0, 1.0, 1.0] },
      { x: 0, y:0, w:0, h:0, c:[0.0, 1.0, 0.0, 1.0] },
      { x: 0, y:0, w:0, h:0, c:[0.0, 0.0, 0.0, 1.0] },
      { x: 0, y:0, w:0, h:0, c:[0.0, 0.0, 0.0, 1.0] },
    ]

    // camera direction view
    this.sphereViewH = 0;
    this.sphereViewV = 70;

    // mouse pos
    this.mousePosX = 0;
    this.mousePosY = 0;
    this.isMouseDragging = false;
    this.viewIdx = -1;

    // screen option
    this.screenMode = '4split';
    this.isGuideViewVisible = true;
    this.animationTimerId = null
    this.transitionTime = 1000
    this.time = null
  }

  initialize(canvas){
    this.glCanvas = canvas
    this.glContext = createGLContext(this.glCanvas);
    this.fisheyeLensCorrectionPanel = new FisheyeLensCorrectionPanel();
    this.fisheyeLensCorrectionPanel.initialize(this.glContext);
    this.viewDirectionPanel = new ViewDirectionPanel();
    this.viewDirectionPanel.initialize(this.glContext);
    this.textureMappingPanel = new TextureMappingPanel();
    this.textureMappingPanel.initialize(this.glContext);

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
        let idx = -1
        for(let i in this.screenParams){
          const v = this.screenParams[i]
          const left = v.x
          const right = left + v.w
          const bottom = this.glCanvas.height - v.y
          const top = bottom - v.h
          if( left < x && x < right && top < y && y < bottom ){
            idx = Number(i)
            break;
          }
        }
        if(this.viewIdx !== idx){
          this.viewIdx = idx
        }else{
          if(this.viewIdx === -1){
            return
          }else if(this.viewIdx === 4){
            const diffX = this.mousePosX - x;
            const diffY = this.mousePosY - y;
            this.sphereViewH -= 0.5 * diffX;
            const v = this.sphereViewV + 0.5 * diffY;
            if(0 < v && v < 90){
              this.sphereViewV = v;
            }
          }else if(this.viewIdx < 4){
            const offsetX = this.screenParams[this.viewIdx].x
            const offsetY = this.screenParams[this.viewIdx].y
            const sw = this.screenParams[this.viewIdx].w
            const sh = this.screenParams[this.viewIdx].h
            const f = this.viewParams[this.viewIdx].f
            const prev_x = this.mousePosX - offsetX
            const prev_y = this.mousePosY - offsetY
            const prev = calcRayDirection(f, prev_x, prev_y, sw, sh);
            const current_x = x - offsetX
            const current_y = y - offsetY
            const current = calcRayDirection(f, current_x, current_y, sw, sh);
            this.viewParams[this.viewIdx].h += current.h - prev.h;
            let v = this.viewParams[this.viewIdx].v
            v = v + (current.v - prev.v);
            if(0 < v && v < 90){
              this.viewParams[this.viewIdx].v = v;
            }
          }
          this.draw();
        }
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
      let idx = -1
      for(let i in this.screenParams){
        const v = this.screenParams[i]
        const left = v.x
        const right = left + v.w
        const bottom = this.glCanvas.height - v.y
        const top = bottom - v.h
        if( left < this.mousePosX && this.mousePosX < right && 
            top < this.mousePosY && this.mousePosY < bottom ){
          idx = i
          break;
        }
      }
      if(this.viewIdx === -1 || this.viewIdx === 4 || this.viewIdx === 5){
        return
      }
      if(e.deltaY > 0){
        this.viewParams[idx].f *= 0.9;
      }else{
        this.viewParams[idx].f *= 1.1;
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

  setScreenMode(mode, transitionTime){
    this.screenMode = mode;
    this.transitionTime = transitionTime
    this.startAnimation();
    this.draw();
  }

  showGuideView(isVisible, transitionTime){
    this.isGuideViewVisible = isVisible;
    this.transitionTime = transitionTime
    this.startAnimation();
    this.draw();
  }
  
  setSrcImage(src){
    if(this.videoTimerId){
      cancelAnimationFrame(this.videoTimerId);
      this.videoTimerId = null;
    }
    this.srcType = 'image'
    this.fisheyeLensCorrectionPanel.setSrcImage(src);
    this.textureMappingPanel.setSrcImage(src);
    this.draw();
  }

  setSrcVideo(src){
    if(this.videoTimerId){
      cancelAnimationFrame(this.videoTimerId);
      this.videoTimerId = null;
    }

    this.srcType = 'video'
    this.videoSrc = src
    this.fisheyeLensCorrectionPanel.setSrcVideo(src);
    this.textureMappingPanel.setSrcVideo(src);

    const step= () => {
      this.draw();
      this.videoTimerId = requestAnimationFrame(step)
    }

    this.videoSrc.addEventListener('play', () => {
      // console.log('play')
      if(this.videoTimerId === null){
        this.videoTimerId = requestAnimationFrame(step)
      }
    })
    this.videoSrc.addEventListener('ended', () => {
      // console.log('eneded')
      cancelAnimationFrame(this.videoTimerId);
      this.videoTimerId = null;
    })
    this.videoSrc.addEventListener('pause', () => {
      // console.log('pause')
      cancelAnimationFrame(this.videoTimerId);
      this.videoTimerId = null;
    })
  }

  draw = () => {
    // console.log('draw')

    const w = this.glCanvas.clientWidth
    const h = this.glCanvas.clientHeight
    this.glCanvas.width = w
    this.glCanvas.height = h

    let r = 1.0
    if(this.animationTimerId){
      const currentTime = new Date();
      const diff = currentTime.getTime() - this.time.getTime();
      r = diff / this.transitionTime
    }
    this.updateScreenPos(r*r*r)

    const gl =this.glContext
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let screenCount = 0
    for(let i = 0; 4 > i; ++i){
      const s = this.screenParams[i]
      const c = this.viewParams[i]

      if(s.w < 1.0 || s.h < 1.0){
        break
      }
      ++screenCount

      if(this.isGuideViewVisible){
        s.c[3] = 1.0
      }else{
        s.c[3] = 0.0
      }

      this.fisheyeLensCorrectionPanel.draw(s.x, s.y, s.w, s.h, c.f, c.h, c.v, s.c)
      this.viewDirectionPanel.setViewParams(i, s.w, s.h, c.f, -c.h, -c.v, s.c)
      this.textureMappingPanel.setViewParams(i, s.w, s.h, c.f, c.h, -c.v, s.c)
    }

    if(this.isGuideViewVisible || this.animationTimerId){
      let s = this.screenParams[4]
      this.viewDirectionPanel.draw(s.x, s.y, s.w, s.h, this.sphereViewH, this.sphereViewV, screenCount);
      s = this.screenParams[5]
      this.textureMappingPanel.draw(s.x, s.y, s.w, s.h, screenCount);
    }
  }

  updateScreenPos(r){
    const w = this.glCanvas.clientWidth
    const h = this.glCanvas.clientHeight
    this.glCanvas.width = w
    this.glCanvas.height = h

    const dstScreenPos = [
      { x: w, y:0, w:0, h:0, },
      { x: w, y:0, w:0, h:0, },
      { x: w, y:0, w:0, h:0, },
      { x: w, y:0, w:0, h:0, },
      { x: w, y:h/2, w:0, h:0, },
      { x: w, y:h/2, w:0, h:0, },
    ]

    let w_f = w
    const w_g = Math.min(400, h/2)
    if(this.isGuideViewVisible){
      w_f -= w_g;
      dstScreenPos[4].x = w_f
      dstScreenPos[4].y = h/2
      dstScreenPos[4].w = w_g
      dstScreenPos[4].h = w_g
      dstScreenPos[5].x = w_f
      dstScreenPos[5].y = h/2 - w_g
      dstScreenPos[5].w = w_g
      dstScreenPos[5].h = w_g
    } 

    dstScreenPos[1].x = w_f
    dstScreenPos[2].x = w_f
    dstScreenPos[3].x = w_f
    if(this.screenMode === '4split'){
      dstScreenPos[0].x = 0
      dstScreenPos[0].y = h/2
      dstScreenPos[0].w = w_f/2
      dstScreenPos[0].h = h/2
      dstScreenPos[1].x = w_f/2
      dstScreenPos[1].y = h/2
      dstScreenPos[1].w = w_f/2
      dstScreenPos[1].h = h/2
      dstScreenPos[2].x = 0
      dstScreenPos[2].y = 0
      dstScreenPos[2].w = w_f/2
      dstScreenPos[2].h = h/2
      dstScreenPos[3].x = w_f/2
      dstScreenPos[3].y = 0
      dstScreenPos[3].w = w_f/2
      dstScreenPos[3].h = h/2
    }else if(this.screenMode === '3split-h'){
      dstScreenPos[0].x = 0
      dstScreenPos[0].y = h/2
      dstScreenPos[0].w = w_f
      dstScreenPos[0].h = h/2
      dstScreenPos[1].x = 0
      dstScreenPos[1].y = 0
      dstScreenPos[1].w = w_f/2
      dstScreenPos[1].h = h/2
      dstScreenPos[2].x = w_f/2
      dstScreenPos[2].y = 0
      dstScreenPos[2].w = w_f/2
      dstScreenPos[2].h = h/2
    }else if(this.screenMode === '3split-v'){
      dstScreenPos[0].x = 0
      dstScreenPos[0].y = 0
      dstScreenPos[0].w = w_f/2
      dstScreenPos[0].h = h
      dstScreenPos[1].x = w_f/2
      dstScreenPos[1].y = h/2
      dstScreenPos[1].w = w_f/2
      dstScreenPos[1].h = h/2
      dstScreenPos[2].x = w_f/2
      dstScreenPos[2].y = 0
      dstScreenPos[2].w = w_f/2
      dstScreenPos[2].h = h/2
    }else if(this.screenMode === '2split-h'){
      dstScreenPos[0].x = 0
      dstScreenPos[0].y = h/2
      dstScreenPos[0].w = w_f
      dstScreenPos[0].h = h/2
      dstScreenPos[1].x = 0
      dstScreenPos[1].y = 0
      dstScreenPos[1].w = w_f
      dstScreenPos[1].h = h/2
    }else if(this.screenMode === '2split-v'){
      dstScreenPos[0].x = 0
      dstScreenPos[0].y = 0
      dstScreenPos[0].w = w_f/2
      dstScreenPos[0].h = h
      dstScreenPos[1].x = w_f/2
      dstScreenPos[1].y = 0
      dstScreenPos[1].w = w_f/2
      dstScreenPos[1].h = h
    }else{
      dstScreenPos[0].x = 0
      dstScreenPos[0].y = 0
      dstScreenPos[0].w = w_f
      dstScreenPos[0].h = h 
    }

    for(let i = 0; 6 > i; ++i){
      this.screenParams[i].x = lerp(this.screenParams[i].x, dstScreenPos[i].x, r)
      this.screenParams[i].y = lerp(this.screenParams[i].y, dstScreenPos[i].y, r)
      this.screenParams[i].w = lerp(this.screenParams[i].w, dstScreenPos[i].w, r)
      this.screenParams[i].h = lerp(this.screenParams[i].h, dstScreenPos[i].h, r)
    }
  }

  startAnimation(){
    if(this.transitionTime === 0){
      return
    }

    this.time = new Date();
    const step = () => {
      const currentTime = new Date();
      const diff = currentTime.getTime() - this.time.getTime();
      if(diff > this.transitionTime){
        cancelAnimationFrame(this.animationTimerId)
        this.animationTimerId = null
      }else{
        this.animationTimerId = requestAnimationFrame(step)
      }
      // console.log('animation')
      this.draw()
    }
    this.animationTimerId = requestAnimationFrame(step)
  }
}