
glObject2DButton = function ( glCanvas )
{
    this.webGLView = glCanvas;
    let gl = glCanvas.context;
    this.shader = 0;

    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;

    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 0;

    this.size = [1.0, 1.0];
    this.position = [0.0, 0.0];
    this.state = 0;    

    this.objectID = [0, 0, 0, 0];
    this.isImageSet = false;

    let vertexPos =
	[
	    1.0,  1.0,  0.0,
	   -1.0,  1.0,  0.0,
	   -1.0, -1.0,  0.0,

	    1.0,  1.0,  0.0,
	   -1.0, -1.0,  0.0,
	    1.0, -1.0,  0.0,
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

glObject2DButton.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexUV);
}

glObject2DButton.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObject2DButton.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObject2DButton.prototype.setScaleMat = function ( scaleMat )
{
    this.ScaleMatrix = scaleMat;
}

glObject2DButton.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObject2DButton.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObject2DButton.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObject2DButton.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObject2DButton.prototype.setImage = function (glContext, url, callback)
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

glObject2DButton.prototype.setPosition = function ( x, y, width, height )
{
    this.position[0] = x;
    this.position[1] = y;
    this.size[0] = width;
    this.size[1] = height;
}

glObject2DButton.prototype.setState = function ( state )
{
    this.state = state;
}

glObject2DButton.prototype.drawObjectIDMap = function ( glContext )
{
}

glObject2DButton.prototype.draw = function ( glContext, time )
{
    if( !this.isImageSet ) return;    

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.BLEND);    
    gl.blendFunc(gl.SRC_ALPHA, gl.ZERO);

    // shader variable
    glShader.aPosition       = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aUV             = gl.getAttribLocation(glShader, "aVertexUV");
    glShader.uScreenSize     = gl.getUniformLocation(glShader, "uScreenSize");
    glShader.uImagePosition  = gl.getUniformLocation(glShader, "uImagePosition");
    glShader.uImageSize      = gl.getUniformLocation(glShader, "uImageSize");
    glShader.uTexture        = gl.getUniformLocation(glShader, "uTexture");
    glShader.uState          = gl.getUniformLocation(glShader, "uState");
    
    // screen size
    let screenSize = [0.0, 0.0];
    screenSize[0] = this.webGLView.getWidth();
    screenSize[1] = this.webGLView.getHeight();
    gl.uniform2fv(glShader.uScreenSize, screenSize);

    // image position
    let imagePosition = [0.0, 0.0];
    imagePosition[0] = ( this.position[0] + this.size[0] / 2 ) / this.webGLView.getWidth();
    imagePosition[1] = ( this.position[1] + this.size[1] / 2 ) / this.webGLView.getHeight();  
    imagePosition[0] = imagePosition[0] * 2.0 - 1.0;
    imagePosition[1] = -( imagePosition[1] * 2.0 - 1.0 );
    gl.uniform2fv(glShader.uImagePosition, imagePosition);

    // image size
    let imageSize = [50.0, 50.0];
    imageSize[0] = this.size[0];
    imageSize[1] = this.size[1];
    gl.uniform2fv(glShader.uImageSize, imageSize);

	// Texture Image
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(glShader.uTexture, 0);

    // state
    let state = [1.0, 0.0, 0.0, 0.0];
    if( this.state == 1 )
    {
        state[0] = 1.5;
    }
    else if( this.state == 1 )
    {
        state[0] = 0.5;
    }
    gl.uniform4fv(glShader.uState, state);

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