
// For Shape

webGLCanvas = function ( canvasID )
{
    this.canvasArea = document.getElementById(canvasID);
    this.canvas = document.createElement("canvas");  
    this.canvas.width = this.canvasArea.clientWidth;
    this.canvas.height = this.canvasArea.clientHeight;
    this.context = createGLContext(this.canvas);
    this.canvasArea.appendChild(this.canvas);
    this.objects = {};
    this.webGLShaderList = {};
    this.webGLTextureList = {};

    this.cameraPosV = 45.0;
    this.cameraPosH = 90.0;
    this.cameraPosR = 120.0;
    this.targetPosX = 0.0;
    this.targetPosY = 0.0;
    this.targetPosZ = 0.0;
    this.zoomStep   = 1.0;
    this.moveStep   = this.cameraPosR / 700;

    this.fovy = 60;
    this.near = 0.1;
    this.far  = 1000;

    this.WorldMatrix = mat4.create();
    this.ViewMatrix  = mat4.create();
    this.ProjMatrix  = mat4.create();

    this.bgColorR = 0.2;
    this.bgColorG = 0.2;
    this.bgColorB = 0.2;
    this.bgColorA = 1.0;

    this.mousePosX = 0;
    this.mousePosY = 0;
    this.mouseLeftDrag  = false;
    this.mouseMiddleDrag = false;
    this.mouseRightDrag = false;
    this.touchmove = false;

    this.mouseDownCallback = null;
    this.mouseMoveCallback = null;
    this.mouseUpCallback = null;
    this.mouseOutCallback = null;

	// this.setupRenderTarget();
	this.objectIDMap = new Uint8Array(this.canvas.width * this.canvas.height * 4);
	this.objectIDCount = 1;
    this.objectIDList = [];
    this.objectIDList[0] = "none";

    this.canvas.addEventListener("contextmenu", function (event)
    {
        event.preventDefault();
    }, false);

    this.canvas.addEventListener("mousedown", function (event) {
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

        let index = ( ( this.canvas.height - Math.ceil(y) ) * this.canvas.width + Math.ceil(x) ) * 4;
        let id1 = this.objectIDMap[index + 0];
        let id2 = this.objectIDMap[index + 1] * 256;
        let id3 = this.objectIDMap[index + 2] * 256 * 256;
        let id = id3 + id2 + id1;          
        let hitObjName = null;
        
        if(id1 != 0)
        {
            hitObjName = this.objectIDList[id];
        }

        if( this.mouseDownCallback )
        {
            this.mouseDownCallback( x, y, hitObjName, event.button );
        }
    }.bind(this));

    this.canvas.addEventListener("mouseup", function (event)
    {
        this.mouseLeftDrag = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag = false;

        if( this.mouseUpCallback )
        {
            this.mouseUpCallback();
        }
    }.bind(this));

    this.canvas.addEventListener("mouseout", function (event)
    {
        this.mouseLeftDrag = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag = false;

        if( this.mouseOutCallback )
        {
            this.mouseOutCallback();
        }
    }.bind(this));

    this.canvas.addEventListener("mousemove", function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;

        if( this.mouseMoveCallback )
        {
            if( this.mouseMoveCallback( x, y ) )
            {
                return;
            }
        }

        if (this.mouseRightDrag)
        { 
            let diffX = x - this.mousePosX;
            let diffY = y - this.mousePosY;

            this.cameraPosH += diffX;
            let valV = this.cameraPosV;
            valV += diffY;
            if ((1.0 < valV) && (valV < 89))
            {
                this.cameraPosV = valV;
            }

            this.mousePosX = x;
            this.mousePosY = y;
        }
        else if (this.mouseLeftDrag)
        {
            let diffX = x - this.mousePosX;
            let diffY = y - this.mousePosY;

            let radH = this.cameraPosH * 3.141592 / 180;
            let moveX = -diffY * Math.cos(radH) * this.moveStep;
            let moveZ = -diffY * Math.sin(radH) * this.moveStep;
            moveX += -diffX * Math.sin(radH) * this.moveStep;
            moveZ += diffX * Math.cos(radH) * this.moveStep;
            this.targetPosX += moveX;
            this.targetPosZ += moveZ;

            this.mousePosX = x;
            this.mousePosY = y;
        }
    }.bind(this));

    this.canvas.addEventListener('mousewheel', function (event)
    {
        event.preventDefault();

        let val = this.cameraPosR;
        val -= event.wheelDelta / 20 * this.zoomStep;
        if (0.001 < val)
        {
            this.cameraPosR = val;
            this.moveStep = this.cameraPosR / 700;
        }

        this.zoomStep = this.cameraPosR * 0.01;

        if( this.mouseWheelCallback )
        {
            if( this.mouseWheelCallback( event.wheelDelta ) )
            {
                return;
            }
        }

    }.bind(this), false);

    this.canvas.addEventListener("touchstart", function (event)
    {
        event.preventDefault();
        this.mousePosX = event.offsetX || event.layerX;
        this.mousePosY = event.offsetY || event.layerY;
        this.touchmove = true;

        let index = ( ( this.canvas.height - Math.ceil(y) ) * this.canvas.width + Math.ceil(x) ) * 4;
        let id1 = this.objectIDMap[index + 0];
        let id2 = this.objectIDMap[index + 1] * 256;
        let id3 = this.objectIDMap[index + 2] * 256 * 256;
        let id = id3 + id2 + id1;          
        let hitObjName = null;
        
        if(id != 0)
        {
            hitObjName = this.objectIDList[id];
        }          
    }.bind(this) );

    this.canvas.addEventListener("touchmove", function (event)
    {
        event.preventDefault();
        if (this.touchmove)
        {
            let x = event.offsetX || event.layerX;
            let y = event.offsetY || event.layerY;

            let diffX = x - this.mousePosX;
            let diffY = y - this.mousePosY;

            let radH = this.cameraPosH * 3.141592 / 180;
            let moveX = -diffY * Math.cos(radH) * this.moveStep;
            let moveZ = -diffY * Math.sin(radH) * this.moveStep;
            moveX += -diffX * Math.sin(radH) * this.moveStep;
            moveZ += diffX * Math.cos(radH) * this.moveStep;
            this.targetPosX += moveX;
            this.targetPosZ += moveZ;

            this.mousePosX = x;
            this.mousePosY = y;
        }
    }.bind(this) );

    this.canvas.addEventListener("touchend", function (evt)
    {
        event.preventDefault();
        this.touchmove = false;
    }.bind(this) );
}

webGLCanvas.prototype.getCanvasRect = function ()
{
    return this.canvasArea.getBoundingClientRect();
}

webGLCanvas.prototype.getWidth = function ()
{
    return  this.canvas.width;
}

webGLCanvas.prototype.getHeight = function ()
{
    return  this.canvas.height;
}

webGLCanvas.prototype.setSize = function ( width, height )
{
    this.canvasArea.style.width = width + "px";
    this.canvasArea.style.height = height + "px";
    this.canvas.width  = width;
    this.canvas.height = height;
    this.objectIDMap = new Uint8Array(this.canvas.width * this.canvas.height * 4);
    this.setProjection(this.fovy, this.near, this.far);    
}

webGLCanvas.prototype.resize = function ()
{
    this.canvas.width  = this.canvasArea.clientWidth;
    this.canvas.height = this.canvasArea.clientHeight;
    this.objectIDMap = new Uint8Array(this.canvas.width * this.canvas.height * 4);
    this.setProjection(this.fovy, this.near, this.far);    
}

webGLCanvas.prototype.setBackgroundColor = function ( r, g, b, a )
{
    this.bgColorR = r;
    this.bgColorG = g;
    this.bgColorB = b;
    this.bgColorA = a;
}

webGLCanvas.prototype.setMouseDownCallback = function ( callback )
{
    this.mouseDownCallback = callback;
}

webGLCanvas.prototype.setMouseMoveCallback = function ( callback )
{
    this.mouseMoveCallback = callback;
}

webGLCanvas.prototype.setMouseUpCallback = function ( callback )
{
    this.mouseUpCallback = callback;
}

webGLCanvas.prototype.setMouseOutCallback = function ( callback )
{
    this.mouseOutCallback = callback;
}

webGLCanvas.prototype.setMouseWheelCallback = function ( callback )
{
    this.mouseWheelCallback = callback;
}

webGLCanvas.prototype.createShaderProgram = function (shaderName, vertexShaderID, fragmentShaderID)
{
    let vertexShaderSource = document.getElementById(vertexShaderID);
    let fragmentShaderSource = document.getElementById(fragmentShaderID);
    let glProgram = createShaderProgram(this.context, vertexShaderSource, fragmentShaderSource);
    this.webGLShaderList[shaderName] = glProgram;
    return glProgram;
}

webGLCanvas.prototype.createTexture = function (textureName, url)
{
    let gl = this.context;
    
	let texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	let image = new Image();
	image.onload = function() 
	{
        gl.activeTexture(gl.TEXTURE0);        
    	gl.bindTexture(gl.TEXTURE_2D, texture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        this.webGLTextureList[textureName] = texture;
    }.bind(this, gl, texture, textureName);
	image.src = url;
}

webGLCanvas.prototype.addGLObject = function ( name, glObject )
{
    this.objects[name] = glObject;
    glObject.setObjectID(this.objectIDCount);
    this.objectIDList[this.objectIDCount] = name;
    ++this.objectIDCount;    
}

webGLCanvas.prototype.deleteGLObject = function (name)
{
    this.objects[name].release(this.context);
    delete this.objects[name];
}

webGLCanvas.prototype.deleteAllGLObject = function ()
{
    for (var obj in this.objects)
    {
        this.objects[obj].release(this.context);
        delete this.objects[obj];
    }
}

webGLCanvas.prototype.getGLObject = function ( name )
{
    return this.objects[name];
}

webGLCanvas.prototype.setView = function (veiwPosX, veiwPosY, veiwPosZ, targetPosX, targetPosY, targetPosZ)
{
    // TO DO
}

webGLCanvas.prototype.setProjection = function ( fovy, near, far )
{
    let gl = this.context;
    this.fovy = fovy;
    this.near = near;
    this.far  = far;
    mat4.perspective(fovy, this.canvas.width / this.canvas.height, near, far, this.ProjMatrix);
}

webGLCanvas.prototype.draw = function(time)
{
    let radH = this.cameraPosH * 3.141592 / 180;
    let radV = this.cameraPosV * 3.141592 / 180;
    let posX = this.cameraPosR * Math.cos(radV) * Math.cos(radH);
    let posY = this.cameraPosR * Math.sin(radV);
    let posZ = this.cameraPosR * Math.cos(radV) * Math.sin(radH);
    posX += this.targetPosX;
    posY += this.targetPosY;
    posZ += this.targetPosZ;
    mat4.lookAt([posX, posY, posZ], [this.targetPosX, this.targetPosY, this.targetPosZ], [0, 1, 0], this.ViewMatrix);

    this.drawObjectIDMap();
    this.drawView(time);
}


///////////////////////////////////////////////////////////////////
// local function
///////////////////////////////////////////////////////////////////

webGLCanvas.prototype.setupRenderTarget = function()
{
	let gl = this.context;

	this.frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
	  
	this.renderBuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.canvas.width, this.canvas.height);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer);

	this.frameTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.frameTexture); 	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.canvas.width, this.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);	
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameTexture, 0);

	gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

webGLCanvas.prototype.drawObjectIDMap = function()
{
    let gl = this.context;
	// gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

    gl.clearColor(0, 0, 0, 1.0);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    for ( var obj in this.objects )
    {
        this.objects[obj].setView(this.ViewMatrix);
        this.objects[obj].setProjection(this.ProjMatrix);
        this.objects[obj].drawObjectIDMap(gl);
    }

    // read object id map
	gl.readPixels(0, 0, this.canvas.width, this.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, this.objectIDMap);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

webGLCanvas.prototype.drawView = function(time)
{
    let gl = this.context;

    gl.clearColor(this.bgColorR, this.bgColorG, this.bgColorB, this.bgColorA);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // for ( var i in this.objectIDList )
    // {
    //     this.objects[this.objectIDList[i]].setView(this.ViewMatrix);
    //     this.objects[this.objectIDList[i]].setProjection(this.ProjMatrix);
    //     this.objects[this.objectIDList[i]].draw(gl, time);
    // }

    for (var obj in this.objects )
    {
        this.objects[obj].setView(this.ViewMatrix);
        this.objects[obj].setProjection(this.ProjMatrix);
        this.objects[obj].draw(gl, time);
    }
}
