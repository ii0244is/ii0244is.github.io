
let CameraController = function()
{
    this.cameraPosV = 0;
    this.cameraPosH = 0;    

    this.cameraPosR = 350.0;
    this.cameraPos = [ 0, 0, this.cameraPosR ];   
    this.cameraUpVec = [ 0, 1, 0 ];   
    this.viewMat = mat4.create();
    
    this.width = 100;
    this.height = 100;     
    this.zoomStep = 1.0;
    this.fovy = 40; 
    this.sphereRadius = 100; 

    this.isMouseDown = false;
    this.mousePosX = 0;
    this.mousePosY = 0;    
}

CameraController.prototype.setScreenSize = function( width, height )
{
    this.width = width;
    this.height = height;    
}

CameraController.prototype.setSphereRadius = function( r )
{
    this.sphereRadius = r; 
}

CameraController.prototype.setFovy = function( fovy )
{
    this.fovy = fovy; 
}

CameraController.prototype.onMouseDown = function( x, y )
{
    let ray = this.calcRay( x, y );       
    this.hitPos = this.calcHitPoint( this.cameraPos, ray );
    if( this.hitPos != 0 ) {
         this.isMouseDown = true;
    }
}

CameraController.prototype.onMouseMove = function( x, y )
{
    if( this.isMouseDown ){

        let ray = this.calcRay( x, y );      
        let newHitPos = this.calcHitPoint( this.cameraPos, ray );
        if( newHitPos == 0 ) {
             this.isMouseDown = false;
             return;
        }

        let p1 = vec3.create( [0, 0, 0] );
        let p2 = vec3.create( [0, 0, 0] );
        vec3.normalize( this.hitPos, p1 );
        vec3.normalize( newHitPos, p2 );
        let axis = vec3.create( [0, 0, 0] );        
        vec3.cross( p1, p2, axis );
        let angle = Math.acos( vec3.dot( p1, p2 ) );

        let rotMat = mat4.create();
        mat4.identity( rotMat );
        mat4.rotate( rotMat, -angle, axis, rotMat );
        let camPosVec4 = [ this.cameraPos[0], this.cameraPos[1], this.cameraPos[2], 1 ];
        let newCamPosVec4 = [0, 0, 0, 0];
        mat4.multiplyVec4( rotMat, camPosVec4, newCamPosVec4 );

        let newCamX = newCamPosVec4[0] / newCamPosVec4[3];
        let newCamY = newCamPosVec4[1] / newCamPosVec4[3];
        let newCamZ = newCamPosVec4[2] / newCamPosVec4[3];

        let radius = Math.sqrt( newCamX * newCamX +  newCamY * newCamY +  newCamZ * newCamZ );
        let camPosV = Math.asin( newCamY / radius ) * 180 / 3.141592;

        if( -85 < camPosV && camPosV < 85 )
        {
            this.cameraPos[0] = newCamPosVec4[0] / newCamPosVec4[3];
            this.cameraPos[1] = newCamPosVec4[1] / newCamPosVec4[3];
            this.cameraPos[2] = newCamPosVec4[2] / newCamPosVec4[3];
        }     
    }
}

CameraController.prototype.onMouseWheel = function( delta )
{
    let val = this.cameraPosR;
    val -= delta / 20 * this.zoomStep;
    if ( this.sphereRadius * 1.01 < val && val < this.sphereRadius * 5 )
    {
        this.cameraPosR = val;
    }
    this.zoomStep = this.cameraPosR * 0.003;

    tempCamPos = [];
    vec3.normalize( this.cameraPos, tempCamPos );
    this.cameraPos[0] = this.cameraPosR * tempCamPos[0];
    this.cameraPos[1] = this.cameraPosR * tempCamPos[1];
    this.cameraPos[2] = this.cameraPosR * tempCamPos[2]; 
}

CameraController.prototype.onMouseUp = function( x, y )
{
    this.isMouseDown = false;
}

CameraController.prototype.getViewMat = function()
{
    return this.viewMat;
}

CameraController.prototype.getCameraPosition = function()
{
    return this.cameraPos;
}

CameraController.prototype.calcRay = function( screenX, screenY )
{
    let viewMat = mat4.create();
    mat4.lookAt( this.cameraPos, [ 0, 0, 0 ], [ 0, 1, 0 ], viewMat );
    
    let projMat = mat4.create();
    let fovy = 40;
    let near = 0.05;
    let far  = 500;
    mat4.perspective(fovy, g_canvas.width / g_canvas.height, near, far, projMat);

    let width = g_canvas.width;
    let height = g_canvas.height
    let screenPosX = ( screenX * 2.0 - width ) / width;
    let screenPosY = -( screenY * 2.0 - height ) / height;
    let screenPos = [ screenPosX, screenPosY, 1.0, 1.0 ];

    let invView = mat4.create();
    let invProj = mat4.create();
    let invMat = mat4.create();
    mat4.inverse( viewMat, invView );
    mat4.inverse( projMat, invProj );
    mat4.multiply( invView, invProj, invMat );
    let pos4 = [ 0.0, 0.0, 0.0, 0.0 ];
    mat4.multiplyVec4( invMat, screenPos, pos4 );
    let pos3 = vec3.create( [ pos4[0]/pos4[3], pos4[1]/pos4[3], pos4[2]/pos4[3] ] );

    let posX = this.cameraPos[0];
    let posY = this.cameraPos[1];
    let posZ = this.cameraPos[2];

    let ray3 = vec3.create( [ pos3[0] - posX, pos3[1] - posY , pos3[2] - posZ ] );
    let ray = vec3.create();
    vec3.normalize( ray3, ray );

    return ray;
}

CameraController.prototype.calcHitPoint = function( o, r )
{
    let rad = this.sphereRadius;

    let Ox = o[0];
    let Oy = o[1];
    let Oz = o[2];

    let Rx = r[0];
    let Ry = r[1];
    let Rz = r[2];

    let a = Rx * Rx + Ry * Ry + Rz * Rz; 
    let b = 2 * ( Ox * Rx + Oy * Ry + Oz * Rz ); 
    let c = Ox * Ox + Oy * Oy + Oz * Oz - rad * rad;     

    let det = b * b - 4 * a * c;
    if( det < 0 ){
        return 0;
    }

    let t1 = ( -b + Math.sqrt(det) ) / ( 2 * a );
    let t2 = ( -b - Math.sqrt(det) ) / ( 2 * a );   
    let t = Math.min( t1, t2 );

    return [ Ox+t*Rx, Oy+t*Ry, Oz+t*Rz ];
}

