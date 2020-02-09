
glObjectGuideLayer = function ( glCanvas )
{
    this.webGLView = glCanvas;
    let gl = glCanvas.context;
    this.shader = 0;

    this.WorldMatrix = mat4.create();
    this.ScaleMatrix = mat4.create();
    this.ViewMatrix  = mat4.create();
    this.ProjMatrix  = mat4.create();
    mat4.identity(this.WorldMatrix);
    mat4.identity(this.ScaleMatrix);    
    mat4.identity(this.ViewMatrix);
    mat4.identity(this.ProjMatrix);

    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;

    this.position = [ 0, 0, 0 ];
    this.scale = [ 1, 1, 1 ];
    this.rotate = 0;

    this.objectID = [0, 0, 0, 0];
    this.visible = true;
    this.isImageSet = false;
    this.select = false;
    this.textureName = null;

    this.billboardMode = false;
    this.rotH = 0;
    this.rotV = 0;

    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 0;

    let vertexPos =
	[
	    1.0, 0.0, -1.0, 
	   -1.0, 0.0, -1.0, 
	   -1.0, 0.0,  1.0, 

	    1.0, 0.0, -1.0, 
	   -1.0, 0.0,  1.0, 
	    1.0, 0.0,  1.0, 
    ];

    let vertexUV =
    [
		1, 1,  //v0
		0, 1,  //v1
		0, 0,  //v2

		1, 1,  //v0
		0, 0,  //v2		
		1, 0,  //v3
    ];

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;

    this.bufferVertexUV = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexUV);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexUV), gl.STATIC_DRAW);
    this.bufferVertexUV.itemSize = 2;
    this.bufferVertexUV.numberOfItems = vertexUV.length / 2;

	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	let dummyTexture = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
		1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, dummyTexture);
}

glObjectGuideLayer.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexUV);
}

glObjectGuideLayer.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader]; 
}

glObjectGuideLayer.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectGuideLayer.prototype.setSelect = function ( isSeledted )
{
    this.select = isSeledted;
}

glObjectGuideLayer.prototype.setScale = function ( scale )
{
    this.scale = scale;
}

glObjectGuideLayer.prototype.setPosition = function ( position )
{
    this.position = position;
}

glObjectGuideLayer.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectGuideLayer.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectGuideLayer.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectGuideLayer.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectGuideLayer.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectGuideLayer.prototype.setImage = function (glContext, url, callback)
{
	let gl = glContext;

	this.image = new Image();
	this.image.onload = function() 
	{
        gl.activeTexture(gl.TEXTURE0);        
    	gl.bindTexture(gl.TEXTURE_2D, this.texture);
    	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        this.isImageSet = true;
        callback( this.image.width, this.image.height );
    }.bind(this, gl);
	this.image.src = url;
}

glObjectGuideLayer.prototype.setTexture = function (name)
{
    this.textureName = name;
    this.isImageSet = true;
}

glObjectGuideLayer.prototype.setRotation = function (r)
{
    this.rotate = r;
}

glObjectGuideLayer.prototype.drawObjectIDMap = function ( glContext )
{
    if( !this.isImageSet ) return;
    if( !this.visible ) return;

    let gl = glContext;
    let glShader = this.webGLView.webGLShaderList["objectMap"];
    gl.useProgram(glShader);

    // shader variable
    glShader.aPosition     = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.uMWMatrix     = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix     = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix      = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uObjectID     = gl.getUniformLocation(glShader, "uObjectID");

    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix
    let tempMat, transMat, scaleMat, rotMat;
    tempMat = mat4.create();    
    transMat = mat4.create();
    scaleMat = mat4.create();
    rotMat = mat4.create();
    mat4.identity(tempMat);
    mat4.scale(tempMat, this.scale, scaleMat);
    mat4.translate(tempMat, this.position, transMat);
    mat4.rotateY(tempMat, this.rotate, rotMat);
    mat4.multiply(transMat, scaleMat, tempMat);    
    mat4.multiply(tempMat, rotMat, this.WorldMatrix);
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // billboard
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);        

    // Object Type
    gl.uniform4fv(glShader.uObjectID, this.objectID);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPosition);    
}

glObjectGuideLayer.prototype.draw = function ( glContext, time )
{
    if( !this.isImageSet ) return;
    if( !this.visible ) return;        

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // blend
    gl.enable(gl.BLEND);    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // shader variable
    glShader.aPosition     = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aUV           = gl.getAttribLocation(glShader, "aVertexUV");
    glShader.uMWMatrix     = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix     = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix      = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uTexture      = gl.getUniformLocation(glShader, "uTexture");
    glShader.uParam        = gl.getUniformLocation(glShader, "uParam");    

    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);
    
    // param
    let isBlinking = 0.0;
    if( this.select )
    {
        isBlinking = 1.0;
    }
    let param = [ time / 100, isBlinking, 0.0, 0.0 ];
    gl.uniform4fv(glShader.uParam, param);       

    // Texture Image
	gl.activeTexture(gl.TEXTURE0);
    if( this.textureName ) {
        gl.bindTexture(gl.TEXTURE_2D, this.webGLView.webGLTextureList[this.textureName]);
    }
    else{
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
	gl.uniform1i(glShader.uTexture, 0);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.enableVertexAttribArray(glShader.aUV);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexUV);
    gl.vertexAttribPointer(glShader.aUV, this.bufferVertexUV.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPosition);
    gl.disableVertexAttribArray(glShader.aUV);
}