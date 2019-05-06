let CameraSetting = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.overflowY = "scroll";
    this.dom.style.padding = "0px 10px 0px 0px"; 

    this.angleLabel = document.createElement("div");
    this.angleLabel.textContent = "Angle";
    this.angleLabel.style.margin = "6px 0px 6px 0px";
    this.angleController = new CameraSettingController();
    this.angleController.setControlMode( "2D" );
    this.space = document.createElement("div");
    this.space.style.width = "10px";
    this.space.style.height = "20px";
    this.zoomLabel = document.createElement("div");
    this.zoomLabel.textContent = "Zoom";
    this.zoomLabel.style.margin = "6px 0px 6px 0px";    
    this.zoomController = new CameraSettingController();
    this.zoomController.setControlMode( "1D" );

    this.dom.appendChild( this.angleLabel );
    this.dom.appendChild( this.angleController.getDom() );
    this.dom.appendChild( this.space );
    this.dom.appendChild( this.zoomLabel );
    this.dom.appendChild( this.zoomController.getDom() );
    
    this.angleController.onchange = function( diffX, diffY ){
        g_webGLView.cameraPosH += diffX;
        let valV = g_webGLView.cameraPosV;
        valV += diffY;
        if ((1.0 < valV) && (valV < 89.0)){
            g_webGLView.cameraPosV = valV;
        }
    }.bind(this)

    this.zoomController.onchange = function( diffX ){
        let val = g_webGLView.cameraPosR;
        val -= diffX / 10 * g_webGLView.zoomStep;
        if (0.01 < val && val < 400){
            g_webGLView.cameraPosR = val;
            g_webGLView.moveStep = g_webGLView.cameraPosR / 700;
        }
        g_webGLView.zoomStep = g_webGLView.cameraPosR * 0.01;
    }.bind(this)
}

CameraSetting.prototype.getDom = function()
{
    return this.dom;
}

CameraSetting.prototype.resize = function()
{
    this.angleController.resize();
    this.zoomController.resize();
}

CameraSetting.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}


//////////////////////////////////////////////////////
// CameraSettingController
//////////////////////////////////////////////////////

let CameraSettingController = function()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%"
    this.canvas.style.height = "80px"
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid";    
    this.canvas.style.cursor = "pointer";
    this.mode = "1D";

    this.canvas.onmousedown = function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        this.mousePosX = x;
        this.mousePosY = y;

        switch (event.button)
        {
            case 0: this.mouseLeftDrag   = true; break;
            case 1: this.mouseMiddleDrag = true; break;
            case 2: this.mouseRightDrag  = true; break;
        }        
    }.bind(this);

    this.canvas.onmousemove = function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
    
        if( this.mouseLeftDrag )
        {
            let diffX = this.mousePosX - x;
            let diffY = this.mousePosY - y;
            if( this.onchange ){
                this.onchange( diffX, diffY );
            }
        }

        this.mousePosX = x;
        this.mousePosY = y;
    }.bind(this);

    this.canvas.onmouseup = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this);    

    this.canvas.onmouseout = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this);       
}

CameraSettingController.prototype.getDom = function()
{
    return this.canvas;
}

CameraSettingController.prototype.resize = function()
{
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
}

CameraSettingController.prototype.setControlMode = function( mode )
{
    this.mode = mode;
    if( this.mode == "1D" ){
        this.canvas.style.height = "80px"
    }else if( this.mode == "2D" ){
        this.canvas.style.height = "160px"
    }
    this.resize();
}

CameraSettingController.prototype.draw = function()
{
    let ctx = this.canvas.getContext("2d");
    let width = this.canvas.width;
    let height = this.canvas.height;

    function drawLine( startX, startY, stopX, stopY ){
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo( startX, startY );
        ctx.lineTo( stopX, stopY );
        ctx.stroke();
    }

    // clear canvas
    ctx.fillStyle = "rgba( 192, 192, 192, 1 )";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba( 96, 96, 96, 1 )";
    ctx.lineWidth = 4.0;
    {
        let startPosX = width * 0.15;
        let startPosY = height / 2;
        let stopPosX  = startPosX + 20;
        let stopPosY  = startPosY + 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosX = startPosX + 25;
        stopPosX  = stopPosX  + 25;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );       
        
        startPosX = width * 0.15;
        startPosY = height / 2;
        stopPosX  = startPosX + 20;
        stopPosY  = startPosY - 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosX = startPosX + 25;
        stopPosX  = stopPosX  + 25;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );     
        
        startPosX = width * 0.85;
        startPosY = height / 2;
        stopPosX  = startPosX - 20;
        stopPosY  = startPosY + 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosX = startPosX - 25;
        stopPosX  = stopPosX  - 25;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );       
        
        startPosX = width * 0.85;
        startPosY = height / 2;
        stopPosX  = startPosX - 20;
        stopPosY  = startPosY - 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosX = startPosX - 25;
        stopPosX  = stopPosX  - 25;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );           
    }

    if( this.mode == "2D" )
    {
        let startPosX = width / 2;
        let startPosY = height * 0.15;
        let stopPosX  = startPosX + 20;
        let stopPosY  = startPosY + 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosY = startPosY + 15;
        stopPosY  = stopPosY  + 15;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );  
        
        startPosX = width / 2;
        startPosY = height * 0.15;
        stopPosX  = startPosX - 20;
        stopPosY  = startPosY + 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosY = startPosY + 15;
        stopPosY  = stopPosY  + 15;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );    
        
        startPosX = width / 2;
        startPosY = height * 0.85;
        stopPosX  = startPosX + 20;
        stopPosY  = startPosY - 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosY = startPosY - 15;
        stopPosY  = stopPosY  - 15;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );  
        
        startPosX = width / 2;
        startPosY = height * 0.85;
        stopPosX  = startPosX - 20;
        stopPosY  = startPosY - 10;        
        drawLine( startPosX, startPosY, stopPosX, stopPosY );

        startPosY = startPosY - 15;
        stopPosY  = stopPosY  - 15;
        drawLine( startPosX, startPosY, stopPosX, stopPosY );           
    }
}