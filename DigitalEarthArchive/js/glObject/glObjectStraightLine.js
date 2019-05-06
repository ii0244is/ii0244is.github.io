
glObjectStraightLine = function ( glCanvas )
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

    this.startPos = [ 0, 0 ];
    this.endPos = [ 0, 0 ];
    this.scale = [ 1, 1, 1 ];

    this.objectID = [0, 0, 0, 0];
    this.visible = true;
    this.select = false;

    this.colorR = 1;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 1;

    let vertexPos = new Array();
    let startPosX = 0.0;
    let startPosY = 0.0;
    let startPosZ = 0.0;
    let stopPosX = 1.0;
    let stopPosY = 0.0;
    let stopPosZ = 0.0;
    vertexPos.push(startPosX);
    vertexPos.push(startPosY);
    vertexPos.push(startPosZ);
    vertexPos.push(stopPosX);
    vertexPos.push(stopPosY);
    vertexPos.push(stopPosZ);

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;    
}

glObjectStraightLine.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexNormal);
}

glObjectStraightLine.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectStraightLine.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectStraightLine.prototype.setSelect = function ( isSeledted )
{
    this.select = isSeledted;
}

glObjectStraightLine.prototype.setHeight = function ( height )
{
    this.height = height;    
}

glObjectStraightLine.prototype.setWidth = function ( width )
{
    this.width = width;    
}

glObjectStraightLine.prototype.setPosition = function ( startPos, endPos )
{
    this.startPos = startPos;
    this.endPos = endPos;
}

glObjectStraightLine.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectStraightLine.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectStraightLine.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectStraightLine.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectStraightLine.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectStraightLine.prototype.drawObjectIDMap = function ( glContext )
{
    return;

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
    let tempMat, transMat, rotMat, scaleMat;
    tempMat = mat4.create();    
    transMat = mat4.create();
    rotMat = mat4.create();    
    scaleMat = mat4.create();
    mat4.identity(tempMat);
    let diffX = this.endPos[0] - this.startPos[0];
    let diffZ = this.endPos[1] - this.startPos[1];
    let distance = Math.sqrt( diffX * diffX + diffZ * diffZ );
    let scale = [ distance, this.height, this.width ];
    let rotate = - Math.atan( diffZ / diffX );
    if( diffX < 0 ) rotate = Math.atan( diffZ / -diffX ) + 3.141592;    
    mat4.scale(tempMat, scale, scaleMat);
    mat4.rotate(tempMat, rotate, [0, 1, 0], rotMat);
    mat4.translate(tempMat, [ this.startPos[0], 0.0, this.startPos[1] ], transMat);
    mat4.multiply(transMat, rotMat, tempMat);
    mat4.multiply(tempMat, scaleMat, this.WorldMatrix);    
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // Object Type
    gl.uniform4fv(glShader.uObjectID, this.objectID);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    //gl.drawArrays(gl.LINES, 0, this.bufferVertexPos.numberOfItems);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPosition);    
}

glObjectStraightLine.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;    

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // blend
    gl.enable(gl.BLEND);    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
    let tempMat, transMat, rotMat, scaleMat;
    tempMat = mat4.create();    
    transMat = mat4.create();
    rotMat = mat4.create();    
    scaleMat = mat4.create();
    mat4.identity(tempMat);
    let diffX = this.endPos[0] - this.startPos[0];
    let diffZ = this.endPos[1] - this.startPos[1];
    let distance = Math.sqrt( diffX * diffX + diffZ * diffZ );
    let scale = [ distance, 1.0, 1.0 ];
    let rotate = - Math.atan( diffZ / diffX );
    if( diffX < 0 ) rotate = Math.atan( diffZ / -diffX ) + 3.141592;    
    mat4.scale(tempMat, scale, scaleMat);
    mat4.rotate(tempMat, rotate, [0, 1, 0], rotMat);
    mat4.translate(tempMat, [ this.startPos[0], 0.0, this.startPos[1] ], transMat);
    mat4.multiply(transMat, rotMat, tempMat);
    mat4.multiply(tempMat, scaleMat, this.WorldMatrix);        
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

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

    // draw
    gl.enableVertexAttribArray(glShader.aPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, this.bufferVertexPos.numberOfItems);
    //gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
}

