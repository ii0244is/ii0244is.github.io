
glObjectCube = function ( glCanvas )
{
    this.webGLView = glCanvas;
    let gl = glCanvas.context;
    this.shader = 0;

    this.WorldMatrix = mat4.create();
    this.ViewMatrix  = mat4.create();
    this.ProjMatrix  = mat4.create();
    mat4.identity(this.WorldMatrix);
    mat4.identity(this.ViewMatrix);
    mat4.identity(this.ProjMatrix);

    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;

    this.position = [ 0, 0, 0 ];
    this.scale = [ 1, 1, 1 ];

    this.objectID = [0, 0, 0, 0];
    this.visible = true;
    this.select = false;
    
    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 0;

    let vertexPos =
	[
	    0.5,  1.0,  0.5,
	    -0.5, 0.0,  0.5,
		-0.5, 1.0,  0.5,

		0.5,  1.0,  0.5,
		0.5,  0.0,  0.5,
		-0.5, 0.0,  0.5,

		0.5,  1.0, -0.5,
		0.5,  0.0,  0.5,
		0.5,  1.0,  0.5,

		0.5,  1.0, -0.5,
		0.5,  0.0, -0.5,
		0.5,  0.0,  0.5,

		-0.5, 1.0, -0.5,
		0.5,  0.0, -0.5,
		0.5,  1.0, -0.5,

		-0.5,  1.0, -0.5,
		-0.5,  0.0, -0.5,
		0.5,   0.0, -0.5,

		-0.5,  1.0,  0.5,
		-0.5,  0.0, -0.5,
		-0.5,  1.0, -0.5,

		-0.5,  1.0,  0.5,
		-0.5,  0.0,  0.5,
		-0.5,  0.0, -0.5,

		0.5,  1.0, -0.5,
		-0.5, 1.0,  0.5,
		-0.5, 1.0, -0.5,

		0.5,  1.0, -0.5,
		0.5,  1.0,  0.5,
		-0.5, 1.0,  0.5,

		0.5,  0.0,  0.5,
		-0.5, 0.0, -0.5,
		-0.5, 0.0,  0.5,

		0.5,  0.0,  0.5,
		0.5,  0.0, -0.5,
		-0.5, 0.0, -0.5,
    ];

    let vertexNormal =
    [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0,

        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
    ];

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;

    this.bufferVertexNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexNormal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormal), gl.STATIC_DRAW);
    this.bufferVertexNormal.itemSize = 3;
    this.bufferVertexNormal.numberOfItems = vertexNormal.length / 3;
}

glObjectCube.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexNormal);
}

glObjectCube.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectCube.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectCube.prototype.setSelect = function ( isSeledted )
{
    this.select = isSeledted;
}

glObjectCube.prototype.setScale = function ( scale )
{
    this.scale = scale;
}

glObjectCube.prototype.setPosition = function ( position )
{
    this.position = position;
}

glObjectCube.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectCube.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectCube.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectCube.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectCube.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectCube.prototype.drawObjectIDMap = function ( glContext )
{
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
    let tempMat, transMat, scaleMat;
    tempMat = mat4.create();    
    transMat = mat4.create();
    scaleMat = mat4.create();
    mat4.identity(tempMat);
    mat4.scale(tempMat, this.scale, scaleMat);
    mat4.translate(tempMat, this.position, transMat);
    mat4.multiply(transMat, scaleMat, this.WorldMatrix);
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

glObjectCube.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // blend
    gl.enable(gl.BLEND);    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // shader variable
    glShader.aPosition     = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aNormal       = gl.getAttribLocation(glShader, "aVertexNormal");
    glShader.uMWMatrix     = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix     = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix      = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uNormalMatrix = gl.getUniformLocation(glShader, "uNormalMatrix");
    glShader.uColor        = gl.getUniformLocation(glShader, "uColor");
    glShader.uLightPos     = gl.getUniformLocation(glShader, "uLightPos");
    glShader.uParam        = gl.getUniformLocation(glShader, "uParam");

    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // Normal Matrix
    var normalMatrix = mat4.create();
    mat4.inverse(this.WorldMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(glShader.uNormalMatrix, false, normalMatrix);

    // Color
    var color = [this.colorR, this.colorG, this.colorB, this.colorA];
    gl.uniform4fv(glShader.uColor, color);

    // param
    let isBlinking = 0.0;
    if( this.select )
    {
        isBlinking = 1.0;
    }
    let param = [ time / 100, isBlinking, 0.0, 0.0 ];
    gl.uniform4fv(glShader.uParam, param);    

    // Light
    let radH = this.webGLView.cameraPosH * 3.141592 / 180;
    let radV = this.webGLView.cameraPosV * 3.141592 / 180;
    let posX = this.webGLView.cameraPosR * Math.cos(radV) * Math.cos(radH);
    let posY = this.webGLView.cameraPosR * Math.sin(radV);
    let posZ = this.webGLView.cameraPosR * Math.cos(radV) * Math.sin(radH);
    posX += this.webGLView.targetPosX;
    posY += this.webGLView.targetPosY;
    posZ += this.webGLView.targetPosZ;
    var lightPos = [posX, posY, posZ];
    gl.uniform3fv(glShader.uLightPos, lightPos);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.enableVertexAttribArray(glShader.aNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexNormal);
    gl.vertexAttribPointer(glShader.aNormal, this.bufferVertexNormal.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPosition);
    gl.disableVertexAttribArray(glShader.aNormal);
}