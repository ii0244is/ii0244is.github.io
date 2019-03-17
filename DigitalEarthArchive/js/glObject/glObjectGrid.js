
glObjectGrid = function ( glCanvas, startX, startZ, posY, numGridX, numGridZ, interval )
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

    this.visible = true;
    this.animationStartTime = 0;
    this.animationType = 0;

    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 0;

    let vertexPos = new Array();
    for (var i = 0; i <= numGridX; ++i)
    {
        let PosX = startX + i * interval;
        let PosY = posY;
        let PosZ = startZ;
        vertexPos.push(PosX);
        vertexPos.push(PosY);
        vertexPos.push(PosZ);

        PosZ = startZ + numGridZ * interval;
        vertexPos.push(PosX);
        vertexPos.push(PosY);
        vertexPos.push(PosZ);
    }

    for (var i = 0; i <= numGridZ; ++i)
    {
        let PosX = startX;
        let PosZ = startZ + i * interval;
        let PosY = posY;
        vertexPos.push(PosX);
        vertexPos.push(PosY);
        vertexPos.push(PosZ);

        PosX = startX + numGridX * interval;
        vertexPos.push(PosX);
        vertexPos.push(PosY);
        vertexPos.push(PosZ);
    }

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;
}

glObjectGrid.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];    
}

glObjectGrid.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectGrid.prototype.setWorldMat = function ( worldMat )
{
    this.ViewMatrix = worldMat;
}

glObjectGrid.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectGrid.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectGrid.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectGrid.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectGrid.prototype.setAnimationStartTime = function ( time, type )
{
    this.animationStartTime = time;
    this.animationType = type;
}

glObjectGrid.prototype.drawObjectIDMap = function ( glContext )
{
}

glObjectGrid.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;    

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // blend
    gl.enable(gl.BLEND);    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // shader variable
    glShader.aPos = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.uMWMatrix = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uColor = gl.getUniformLocation(glShader, "uColor");
    glShader.uParam = gl.getUniformLocation(glShader, "uParam");

    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // Color
    var color = [this.colorR, this.colorG, this.colorB, this.colorA];
    gl.uniform4fv(glShader.uColor, color);

    // animation parameter
    var param = [ 1.0, this.animationType, 0.0, 0.0 ];
    var animationTime = 400;
    if( time - this.animationStartTime < animationTime )
    {
        param[0] = ( time - this.animationStartTime ) / animationTime;
    }
    gl.uniform4fv(glShader.uParam, param);

    // draw
    gl.enableVertexAttribArray(glShader.aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
}