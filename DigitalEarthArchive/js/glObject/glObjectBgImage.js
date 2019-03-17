
glObjectBgImage = function ( glCanvas )
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
    
    this.isImageSet = false;

    this.luminance = 1.0;
    this.previousLuminance = 1.0;
    this.animationStartTime = 0.0;
    this.animationStart = true;

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

glObjectBgImage.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexUV);
}

glObjectBgImage.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectBgImage.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectBgImage.prototype.setScaleMat = function ( scaleMat )
{
    this.ScaleMatrix = scaleMat;
}

glObjectBgImage.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectBgImage.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectBgImage.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectBgImage.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectBgImage.prototype.setImage = function (glContext, url, callback)
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

glObjectBgImage.prototype.setLuminance = function ( val )
{
    this.previousLuminance = this.luminance;
    this.luminance = val;  
    this.animationStart = true;
}

glObjectBgImage.prototype.drawObjectIDMap = function ( glContext )
{
}

glObjectBgImage.prototype.draw = function ( glContext, time )
{
    if( !this.isImageSet ) return;

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // shader variable
    glShader.aPosition = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aUV       = gl.getAttribLocation(glShader, "aVertexUV");
    glShader.uTexture  = gl.getUniformLocation(glShader, "uTexture");
    glShader.uParam    = gl.getUniformLocation(glShader, "uParam");
    
	// Texture Image
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(glShader.uTexture, 0);

    // animation parameter
    var param = [ this.luminance, 0.0, 0.0, 0.0 ];
    if( this.animationStart )
    {
        this.animationStartTime = time;
        this.animationStart = false;
    }
    if( time - this.animationStartTime < 250 )
    {
        let rate = ( time - this.animationStartTime ) / 250;
        let diff = this.luminance - this.previousLuminance;
        param[0] = rate * diff + this.previousLuminance;
    }
    gl.uniform4fv(glShader.uParam, param);

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