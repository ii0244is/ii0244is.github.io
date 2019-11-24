
WebGLCanvas = function ()
{
    this.canvas = document.createElement("canvas");  
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width  = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.context = createGLContext(this.canvas);
    this.objects = {};
    this.webGLShaderList = {};
    this.webGLTextureList = {};
    this.pointObjList = [];

    this.cameraPosV = 45.0;
    this.cameraPosH = 90.0;
    this.cameraPosR = 120.0;
    this.targetPosX = 0.0;
    this.targetPosY = 0.0;
    this.targetPosZ = 0.0;
    let radH = this.cameraPosH * 3.141592 / 180;
    let radV = this.cameraPosV * 3.141592 / 180;
    this.cameraPosX = this.targetPosX + this.cameraPosR * Math.cos(radV) * Math.cos(radH);
    this.cameraPosY = this.targetPosY + this.cameraPosR * Math.sin(radV);
    this.cameraPosZ = this.targetPosZ + this.cameraPosR * Math.cos(radV) * Math.sin(radH);
    this.zoomStep   = this.cameraPosR * 0.01;
    this.moveStep   = this.cameraPosR / 700;

    this.fovy = 60;
    this.near = 0.01;
    this.far  = 500;

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
    this.hitPos = [];

    this.mouseDownCallback = null;
    this.mouseMoveCallback = null;
    this.mouseUpCallback = null;
    this.mouseOutCallback = null;

	// this.setupRenderTarget();
	this.objectIDMap = new Uint8Array(this.canvas.width * this.canvas.height * 4);
	this.objectIDCount = 0;
	this.objectIDList = [];

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
        // let id4 = this.objectIDMap[index + 3] * 256 * 256 * 256;
        // let id = id4 + id3 + id2 + id1;
        let hitObjName = null;
        
        if(id != 0)
        {
            hitObjName = this.objectIDList[id];
        }

        this.hitPos = calcHitPoint( x, y );

        if( this.mouseDownCallback )
        {
            this.mouseDownCallback( x, y, hitObjName, false, event.button );
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
            if( valV < 0.1 ){
                this.cameraPosV = 0.1;
            }else if( 89.9 < valV ){
                this.cameraPosV = 89.9;
            }else{
                this.cameraPosV = valV;
            }

            this.mousePosX = x;
            this.mousePosY = y;
        }
        else if (this.mouseLeftDrag)
        {
            let ray = this.calcRayVector( x, y );
            let rayLength = ( this.hitPos[1] - this.cameraPosY ) / ray[1];
            let newCamPosX = this.hitPos[0] - rayLength * ray[0];
            let newCamPosZ = this.hitPos[2] - rayLength * ray[2];
            let moveX = newCamPosX - this.cameraPosX;
            let moveZ = newCamPosZ - this.cameraPosZ;            
            this.targetPosX += moveX;
            this.targetPosZ += moveZ;
            this.cameraPosX = newCamPosX;
            this.cameraPosZ = newCamPosZ;
            this.hitPos = calcHitPoint( x, y );

            this.mousePosX = x;
            this.mousePosY = y;
        }
    }.bind(this));

    this.canvas.addEventListener('mousewheel', function (event)
    {
        event.preventDefault();

        if( this.mouseWheelCallback )
        {
            if( this.mouseWheelCallback( event.wheelDelta ) )
            {
                return;
            }
        }

        let val = this.cameraPosR;
        val -= event.wheelDelta / 20 * this.zoomStep;
        if (0.01 < val && val < 400)
        {
            this.cameraPosR = val;
            this.moveStep = this.cameraPosR / 700;
        }

        this.zoomStep = this.cameraPosR * 0.01;
        
    }.bind(this), false);

    this.canvas.addEventListener("touchstart", function (event)
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

        this.hitPos = calcHitPoint( x, y );

        if( this.mouseDownCallback )
        {
            this.mouseDownCallback( x, y, hitObjName, true );
        }    
    }.bind(this) );

    this.canvas.addEventListener("touchmove", function (event)
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

            let ray = this.calcRayVector( x, y );
            let rayLength = ( this.hitPos[1] - this.cameraPosY ) / ray[1];
            let newCamPosX = this.hitPos[0] - rayLength * ray[0];
            let newCamPosZ = this.hitPos[2] - rayLength * ray[2];
            let moveX = newCamPosX - this.cameraPosX;
            let moveZ = newCamPosZ - this.cameraPosZ;            
            this.targetPosX += moveX;
            this.targetPosZ += moveZ;
            this.cameraPosX = newCamPosX;
            this.cameraPosZ = newCamPosZ;
            this.hitPos = calcHitPoint( x, y );

            // let radH = this.cameraPosH * 3.141592 / 180;
            // let moveX = -diffY * Math.cos(radH) * this.moveStep;
            // let moveZ = -diffY * Math.sin(radH) * this.moveStep;
            // moveX += -diffX * Math.sin(radH) * this.moveStep;
            // moveZ += diffX * Math.cos(radH) * this.moveStep;
            // this.targetPosX += moveX;
            // this.targetPosZ += moveZ;

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

WebGLCanvas.prototype.getDom = function ()
{
    return this.canvas;
}

WebGLCanvas.prototype.getCanvasRect = function ()
{
    return this.canvas.getBoundingClientRect();
}

WebGLCanvas.prototype.getWidth = function ()
{
    return  this.canvas.width;
}

WebGLCanvas.prototype.getHeight = function ()
{
    return  this.canvas.height;
}

WebGLCanvas.prototype.resize = function()
{
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.objectIDMap = new Uint8Array(this.canvas.width * this.canvas.height * 4);
    this.setProjection(this.fovy, this.near, this.far);  
}

WebGLCanvas.prototype.setSize = function ( width, height )
{
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.canvas.width  = width;
    this.canvas.height = height;
    this.objectIDMap = new Uint8Array(this.canvas.width * this.canvas.height * 4);
    this.setProjection(this.fovy, this.near, this.far);    
}

WebGLCanvas.prototype.setBackgroundColor = function ( r, g, b, a )
{
    this.bgColorR = r;
    this.bgColorG = g;
    this.bgColorB = b;
    this.bgColorA = a;
}

WebGLCanvas.prototype.setMouseDownCallback = function ( callback )
{
    this.mouseDownCallback = callback;
}

WebGLCanvas.prototype.setMouseMoveCallback = function ( callback )
{
    this.mouseMoveCallback = callback;
}

WebGLCanvas.prototype.setMouseUpCallback = function ( callback )
{
    this.mouseUpCallback = callback;
}

WebGLCanvas.prototype.setMouseOutCallback = function ( callback )
{
    this.mouseOutCallback = callback;
}

WebGLCanvas.prototype.setMouseWheelCallback = function ( callback )
{
    this.mouseWheelCallback = callback;
}

WebGLCanvas.prototype.createShaderProgram = function (shaderName, vertexShaderID, fragmentShaderID)
{
    let vertexShaderSource = document.getElementById(vertexShaderID);
    let fragmentShaderSource = document.getElementById(fragmentShaderID);
    let glProgram = createShaderProgram(this.context, vertexShaderSource, fragmentShaderSource);
    this.webGLShaderList[shaderName] = glProgram;
    return glProgram;
}

WebGLCanvas.prototype.createTexture = function (textureName, url)
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

WebGLCanvas.prototype.addGLObject = function ( name, glObject )
{
    this.objects[name] = glObject;
    glObject.setObjectID(this.objectIDCount);
    this.objectIDList[this.objectIDCount] = name;
    ++this.objectIDCount;    

    if( name.indexOf("Point") != -1 ){
        this.pointObjList.push(name);
    }
}

WebGLCanvas.prototype.deleteGLObject = function (name)
{
    this.objects[name].release(this.context);
    delete this.objects[name];

    if( name.indexOf("Point") != -1 ){
        let i = this.pointObjList.indexOf( name );
        this.pointObjList.splice(i, 1);
    }
}

WebGLCanvas.prototype.deleteAllGLObject = function ()
{
    for (var obj in this.objects)
    {
        this.objects[obj].release(this.context);
        delete this.objects[obj];
    }
}

WebGLCanvas.prototype.getGLObject = function ( name )
{
    return this.objects[name];
}

WebGLCanvas.prototype.setView = function (veiwPosX, veiwPosY, veiwPosZ, targetPosX, targetPosY, targetPosZ)
{
    // TO DO
}

WebGLCanvas.prototype.setProjection = function ( fovy, near, far )
{
    let gl = this.context;
    this.fovy = fovy;
    this.near = near;
    this.far  = far;
    mat4.perspective(fovy, this.canvas.width / this.canvas.height, near, far, this.ProjMatrix);
}

WebGLCanvas.prototype.draw = function(time)
{
    let radH = this.cameraPosH * 3.141592 / 180;
    let radV = this.cameraPosV * 3.141592 / 180;
    let posX = this.cameraPosR * Math.cos(radV) * Math.cos(radH);
    let posY = this.cameraPosR * Math.sin(radV);
    let posZ = this.cameraPosR * Math.cos(radV) * Math.sin(radH);
    this.cameraPosX = posX + this.targetPosX;
    this.cameraPosY = posY + this.targetPosY;
    this.cameraPosZ = posZ + this.targetPosZ;
    mat4.lookAt(
        [this.cameraPosX, this.cameraPosY, this.cameraPosZ], 
        [this.targetPosX, this.targetPosY, this.targetPosZ], 
        [0, 1, 0], this.ViewMatrix );

    this.drawObjectIDMap();
    this.drawView(time);
}


///////////////////////////////////////////////////////////////////
// local function
///////////////////////////////////////////////////////////////////

WebGLCanvas.prototype.setupRenderTarget = function()
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

WebGLCanvas.prototype.drawObjectIDMap = function()
{
    let gl = this.context;
	// gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

    gl.clearColor(0, 0, 0, 1.0);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    for ( var obj in this.objects )
    {
        if( obj.indexOf("Point") != -1 ) continue;
        this.objects[obj].setView(this.ViewMatrix);
        this.objects[obj].setProjection(this.ProjMatrix);
        this.objects[obj].drawObjectIDMap(gl);
    }

    let camPos = [ this.cameraPosX, this.cameraPosY, this.cameraPosZ ];
    this.pointObjList.sort( function( a, b ){
        function distance( pos1, pos2 ){
            let diffX = pos1[0] - pos2[0];
            let diffY = pos1[1] - pos2[1];
            let diffZ = pos1[2] - pos2[2];
            return Math.sqrt( diffX * diffX + diffY * diffY + diffZ * diffZ );
        }
        let posA = this.objects[a].position;
        let distanceA =  distance( camPos, posA );
        let posB = this.objects[b].position;
        let distanceB =  distance( camPos, posB );
        if( distanceA < distanceB ) return 1;
        if( distanceA > distanceB ) return -1;
        return 0;
    }.bind(this) )
    for( let i in this.pointObjList ){
        let obj = this.pointObjList[i];
        this.objects[obj].setView(this.ViewMatrix);
        this.objects[obj].setProjection(this.ProjMatrix);
        this.objects[obj].drawObjectIDMap(gl);        
    }

    // read object id map
	gl.readPixels(0, 0, this.canvas.width, this.canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, this.objectIDMap);

    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

WebGLCanvas.prototype.drawView = function(time)
{
    let gl = this.context;

    gl.clearColor(this.bgColorR, this.bgColorG, this.bgColorB, this.bgColorA);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    for (var obj in this.objects )
    {
        if( obj.indexOf("Point") != -1 ) continue;
        this.objects[obj].setView(this.ViewMatrix);
        this.objects[obj].setProjection(this.ProjMatrix);
        this.objects[obj].draw(gl, time);
    }

    for( let i in this.pointObjList )
    {
        let obj = this.pointObjList[i];
        this.objects[obj].setView(this.ViewMatrix);
        this.objects[obj].setProjection(this.ProjMatrix);
        this.objects[obj].draw(gl, time);
    }
}

WebGLCanvas.prototype.calcRayVector = function( screenX, screenY )
{
    let width = this.canvas.width;
    let height = this.canvas.height
    let screenPosX = ( screenX * 2.0 - width ) / width;
    let screenPosY = -( screenY * 2.0 - height ) / height;
    let screenPos = [ screenPosX, screenPosY, 1.0, 1.0 ];

    let invView = mat4.create();
    let invProj = mat4.create();
    let invMat = mat4.create();
    mat4.inverse( this.ViewMatrix, invView );
    mat4.inverse( this.ProjMatrix, invProj );
    mat4.multiply( invView, invProj, invMat );
    let pos4 = [ 0.0, 0.0, 0.0, 0.0 ];
    mat4.multiplyVec4( invMat, screenPos, pos4 );
    let pos3 = vec3.create( [ pos4[0]/pos4[3], pos4[1]/pos4[3], pos4[2]/pos4[3] ] );

    let posX = g_webGLView.cameraPosX;
    let posY = g_webGLView.cameraPosY;
    let posZ = g_webGLView.cameraPosZ;

    let ray3 = vec3.create( [ posX - pos3[0], posY - pos3[1], posZ - pos3[2] ] );
    let ray = vec3.create();
    vec3.normalize( ray3, ray );

    return ray;
}
