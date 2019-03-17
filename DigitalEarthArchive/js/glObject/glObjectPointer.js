
glObjectPointer = function ( glCanvas )
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

    this.visible = true;
    this.select = false;

    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 0;

    let vertexPos =
    [
        -0.5, 0.0, -0.5,
        -0.5, 0.0,  0.5,
         0.5, 0.0, -0.5,
        -0.5, 0.0,  0.5,
         0.5, 0.0,  0.5,
         0.5, 0.0, -0.5,
    ];

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;
}

glObjectPointer.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexNormal);
}

glObjectPointer.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectPointer.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectPointer.prototype.setSelect = function ( isSeledted )
{
    this.select = isSeledted;
}

glObjectPointer.prototype.setScale = function ( scale )
{
    this.scale = scale;
}

glObjectPointer.prototype.setPosition = function ( position )
{
    this.position = position;
}

glObjectPointer.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectPointer.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectPointer.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectPointer.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectPointer.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectPointer.prototype.drawObjectIDMap = function ( glContext )
{
}

glObjectPointer.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // shader variable
    glShader.aPos = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.uMWMatrix = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uColor = gl.getUniformLocation(glShader, "uColor");

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

    // Color
    var color = [this.colorR, this.colorG, this.colorB, this.colorA];
    gl.uniform4fv(glShader.uColor, color);

    // draw
    gl.enableVertexAttribArray(glShader.aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
}