
let cameraWorkManager = function ()
{
    this.targetPosition = {};
    this.targetCameraPose = {};
    this.startPosition = {};
    this.startCameraPose = {};
    this.transitionTime = 500;    
    this.elapsedTime = 0;
    this.isTransitionFinished = true;
    this.isCameraPoseHAdd = true;
}

cameraWorkManager.prototype.startTransition = function ( targetX, targetZ, time, distance )
{
    this.targetPosition.x = targetX;
    this.targetPosition.z = targetZ;
    this.transitionTime = time;
    this.elapsedTime = 0;    
    this.isTransitionFinished = false;
    this.startPosition.x = g_webGLView.targetPosX;
    this.startPosition.z = g_webGLView.targetPosZ;
    this.startCameraPose.v = g_webGLView.cameraPosV;
    this.startCameraPose.h = g_webGLView.cameraPosH;
    this.startCameraPose.r = g_webGLView.cameraPosR;
    if( distance ) {
        this.targetCameraPose.r = distance;
    }else{
        this.targetCameraPose.r = 45;
    }
    if( this.isCameraPoseHAdd ){
        this.targetCameraPose.h = this.startCameraPose.h + 30;  
        this.isCameraPoseHAdd = false;     
    }else{
        this.targetCameraPose.h = this.startCameraPose.h - 30;         
        this.isCameraPoseHAdd = true;             
    }
    if( this.startCameraPose.v < 30 ){
        this.targetCameraPose.v = this.startCameraPose.v + 30;
    }
    else if( this.startCameraPose.v > 60 ){
        this.targetCameraPose.v = this.startCameraPose.v - 20;
    }
    else {
        this.targetCameraPose.v = this.startCameraPose.v + 10;
    }

    let distanceX = Math.abs( this.targetPosition.x - this.startPosition.x );
    this.a_x = 4 * distanceX / this.transitionTime / this.transitionTime;    
    this.b_x = this.a_x * this.transitionTime / 2;
    let distanceZ = Math.abs( this.targetPosition.z - this.startPosition.z );
    this.a_z = 4 * distanceZ / this.transitionTime / this.transitionTime;    
    this.b_z = this.a_z * this.transitionTime / 2;

    this.a_r = -0.0004;
    this.c_r = this.startCameraPose.r;
    this.b_r = ( this.targetCameraPose.r - this.c_r - this.a_r * this.transitionTime * this.transitionTime ) / this.transitionTime;

    this.a_v = ( this.targetCameraPose.v - this.startCameraPose.v ) / this.transitionTime;
    this.a_h = ( this.targetCameraPose.h - this.startCameraPose.h ) / this.transitionTime;
}

cameraWorkManager.prototype.updateCameraPosition = function ()
{
    if( this.isTransitionFinished ) return;

    let currentCameraPosV = g_webGLView.cameraPosV;
    let currentCameraPosH = g_webGLView.cameraPosH;
    let currentCameraPosR = g_webGLView.cameraPosR;
    let currentPosX = g_webGLView.targetPosX;
    let currentPosZ = g_webGLView.targetPosZ;

    // update position X
    let moveX = this.a_x * this.elapsedTime * 15;
    if( this.elapsedTime > this.transitionTime / 2) {
        moveX = ( -this.a_x * ( this.elapsedTime - this.transitionTime / 2 ) + this.b_x ) * 15;
    }
    let nextPosX = currentPosX;    
    if( this.targetPosition.x < currentPosX ){
        nextPosX -= moveX; 
    }else{
        nextPosX += moveX;
    }

    // update position Z
    let moveZ = this.a_z * this.elapsedTime * 15;
    if( this.elapsedTime > this.transitionTime / 2) {
        moveZ = ( -this.a_z * ( this.elapsedTime - this.transitionTime / 2 ) + this.b_z ) * 15;
    }
    let nextPosZ = currentPosZ;    
    if( this.targetPosition.z < currentPosZ ){
        nextPosZ -= moveZ; 
    }else{
        nextPosZ += moveZ;
    }

    // update camera pose
    let nextH = this.a_h * this.elapsedTime + this.startCameraPose.h;    
    let nextV = this.a_v * this.elapsedTime + this.startCameraPose.v;    
    let nextR = this.a_r * this.elapsedTime * this.elapsedTime + this.b_r * this.elapsedTime + this.c_r;

    if( this.elapsedTime >= this.transitionTime ){
        this.isTransitionFinished = true;        
    } else {
        g_webGLView.targetPosX = nextPosX;
        g_webGLView.targetPosZ = nextPosZ;
        g_webGLView.cameraPosH = nextH;
        g_webGLView.cameraPosV = nextV;         
        g_webGLView.cameraPosR = nextR; 
        g_webGLView.moveStep = nextR / 700;
        g_webGLView.zoomStep = nextR * 0.01;   

        this.elapsedTime += 15;        
    }
}