
cameraSetting = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";    
    this.dom.style.overflowY = "auto";

    // camera angle
    this.cameraAngleController = new guiComponentMouseController( 320, 120, function(diffX, diffY) {
        g_webGLView.cameraPosH += diffX;
        let valV = g_webGLView.cameraPosV;
        valV += diffY;
        if( ( 1.0 < valV ) && ( valV < 89.0 ) ) {
             g_webGLView.cameraPosV = valV;
        }
    }.bind(this) )
 
    // camera position
    this.cameraPositionController = new guiComponentMouseController( 320, 120, function(diffX, diffY) {
        let radH = g_webGLView.cameraPosH * 3.141592 / 180;
        let x = -diffY * Math.cos(radH) * g_webGLView.moveStep;
        let z = -diffY * Math.sin(radH) * g_webGLView.moveStep;
        x += -diffX * Math.sin(radH) * g_webGLView.moveStep;
        z += diffX * Math.cos(radH) * g_webGLView.moveStep;
        g_webGLView.targetPosX += x;
        g_webGLView.targetPosZ += z;
    }.bind(this) )

    // camera zoom
    this.cameraZoomController = new guiComponentMouseController( 320, 120, function(diffX, diffY) {
        let val = g_webGLView.cameraPosR;
        val += diffX * g_webGLView.zoomStep;
        if ( 0.01 < val && val < 400 )
        {
            g_webGLView.cameraPosR = val;
            g_webGLView.moveStep = g_webGLView.cameraPosR / 700;
        }
        g_webGLView.zoomStep = g_webGLView.cameraPosR * 0.01;
    }.bind(this) )

    // create gui table
    this.table = new guiComponentTable();
    this.table.addRow( "Angle", this.cameraAngleController.getDom() );
    this.table.addRow( "Position", this.cameraPositionController.getDom() );
    this.table.addRow( "Zoom", this.cameraZoomController.getDom() );
    this.dom.appendChild( this.table.getDom() );
}

cameraSetting.prototype.getDom = function ()
{
    return this.dom;
}

cameraSetting.prototype.setSize = function( width, height )
{
    // let rect = this.dom.getBoundingClientRect();
    this.cameraAngleController.setSize( width - 25, 120 );
    this.cameraPositionController.setSize( width - 25, 120 );
    this.cameraZoomController.setSize( width - 25, 120 );
}