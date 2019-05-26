
let PositionInput = function()
{
    this.params = {};
    this.onchange = null;

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.backgroundColor = "#fff";
    this.dom.style.color = "#111";
    this.dom.style.width = "calc( 100% - 30px )";    
    this.dom.style.padding = "10px 15px 10px 15px";
    this.dom.style.margin  = "10px 0px 10px 0px"; 
    this.dom.style.borderRadius = "10px"    
    this.keyInputArea = document.createElement("div");
    this.keyInputArea.style.display = "flex";
    this.keyInputArea.style.flexDirection = "column";   
    this.lonInputArea = document.createElement("div");
    this.lonInputArea.style.display = "flex";
    this.lonInputArea.style.flexDirection = "row";
    this.lonInputArea.style.alignItems = "center";
    this.lonInputArea.style.justifyContent = "space-between";
    this.lonInputArea.style.margin = "0px 0px 8px 0px";    
    this.lonInputLabel = document.createElement("div");
    this.lonInputLabel.textContent = "Longitude";
    this.lonInput = document.createElement("input");
    this.lonInput.type = "number";
    this.lonInput.min = -180;
    this.lonInput.max = 180;
    this.lonInput.step = 0.01;  
    this.lonInput.style.width = "120px";
    this.lonInput.style.padding = "5px 10px 5px 10px";
    this.lonInput.style.borderRadius = "5px";
    this.lonInputArea.appendChild( this.lonInputLabel );
    this.lonInputArea.appendChild( this.lonInput );
    this.latInputArea = document.createElement("div");
    this.latInputArea.style.display = "flex";
    this.latInputArea.style.flexDirection = "row";
    this.latInputArea.style.alignItems = "center";
    this.latInputArea.style.justifyContent = "space-between";
    this.latInputArea.style.margin = "0px 0px 8px 0px";        
    this.latInputLabel = document.createElement("div");
    this.latInputLabel.textContent = "Latitude";
    this.latInput = document.createElement("input");
    this.latInput.type = "number";
    this.latInput.min = -90;
    this.latInput.max = 90;  
    this.latInput.step = 0.01;  
    this.latInput.style.width = "120px";  
    this.latInput.style.padding = "5px 10px 5px 10px";
    this.latInput.style.borderRadius = "5px";    
    this.latInputArea.appendChild( this.latInputLabel );
    this.latInputArea.appendChild( this.latInput );
    this.keyInputArea.appendChild( this.lonInputArea );
    this.keyInputArea.appendChild( this.latInputArea );
    this.mouseInputArea = document.createElement("div");
    this.mouseInputArea.style.margin = "5px 0px 0px 0px";
    this.mouseInput = new MouseInputController()
    this.mouseInputArea.appendChild( this.mouseInput.getDom() );
    this.dom.appendChild( this.keyInputArea );
    this.dom.appendChild( this.mouseInputArea );

    this.lonInput.onchange = function(){
        if( this.onchange ){
            this.onchange( this.getValue() );
        }
    }.bind(this);

    this.latInput.onchange = function(){
        if( this.onchange ){
            this.onchange( this.getValue() );
        }
    }.bind(this);

    this.mouseInput.onchange = function( diffX, diffY ){
        if( this.onchange ){
            let val      = this.getValue();
            let radH     = g_webGLView.cameraPosH * 3.141592 / 180;
            let moveStep = g_webGLView.moveStep * 2.0;
            let moveLon  = -diffY * Math.cos(radH) * moveStep;
            let moveLat  = -diffY * Math.sin(radH) * moveStep;
            moveLon += -diffX * Math.sin(radH) * moveStep;
            moveLat += diffX * Math.cos(radH) * moveStep;
            let lon = Number( val.longitude ) + moveLon;
            let lat = Number( val.latitude ) - moveLat;
            lon = Math.min( lon,  180 );
            lon = Math.max( lon, -180 );
            lat = Math.min( lat,  90  );
            lat = Math.max( lat, -90  );
            this.setValue( "longitude", lon );
            this.setValue( "latitude",  lat );            
            this.onchange( this.getValue() );
        }
    }.bind(this);
}

PositionInput.prototype.resize = function()
{
    this.mouseInput.resize();
}

PositionInput.prototype.getDom = function()
{
    return this.dom;
}

PositionInput.prototype.setValue = function( type, val )
{
    if( type == "longitude" ){
        this.lonInput.value = val.toFixed(7);
    }else if( type == "latitude" ){
        this.latInput.value = val.toFixed(7);
    }
}

PositionInput.prototype.getValue = function()
{
    let values = {}
    values.longitude = this.lonInput.value;
    values.latitude  = this.latInput.value;
    return values;
}


//////////////////////////////////////////////////////
// MouseInputController
//////////////////////////////////////////////////////

let MouseInputController = function()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%"
    this.canvas.style.height = "160px"
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid";    
    this.canvas.style.cursor = "pointer";

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
    
    this.canvas.ontouchstart = function (event)
    {
        event.preventDefault();
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        this.mousePosX = x;
        this.mousePosY = y;
        this.touchmove = true;
    }.bind(this);

    this.canvas.ontouchmove = function (event)
    {
        event.preventDefault();
        if (this.touchmove)
        {
            let x = event.offsetX || event.layerX;
            let y = event.offsetY || event.layerY;
            if( !x ){
                x = event.touches[0].clientX;
                y = event.touches[0].clientY;
            }

            let diffX = this.mousePosX - x;
            let diffY = this.mousePosY - y;
            if( this.onchange ){
                this.onchange( diffX, diffY );
            }
            
            this.mousePosX = x;
            this.mousePosY = y;            
        }
    }.bind(this);   
    
    this.canvas.ontouchend = function (event)
    {
        event.preventDefault();
        this.touchmove = false;
    }.bind(this);    
}

MouseInputController.prototype.getDom = function()
{
    return this.canvas;
}

MouseInputController.prototype.resize = function()
{
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
}

MouseInputController.prototype.draw = function()
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
    ctx.fillStyle = "rgba( 230, 230, 230, 1 )";
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