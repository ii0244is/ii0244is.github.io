
glObjectLine = function ( glCanvas )
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

    this.objectID = [0, 0, 0, 0];
    this.visible = true;
    this.select = false;
    this.lineLength = 0;
    this.isArrowShown = true;

    this.colorR = 1;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 1;
}

glObjectLine.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferLinePos);
}

glObjectLine.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectLine.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectLine.prototype.setSelect = function ( isSeledted )
{
    this.select = isSeledted;
}

glObjectLine.prototype.showArrow = function ( show )
{
    this.isArrowShown = show;
}

glObjectLine.prototype.setHeight = function ( height )
{
    this.height = height;    
}

glObjectLine.prototype.setWidth = function ( width )
{
    this.width = width;    
}

glObjectLine.prototype.setPosition = function ( startPos, endPos )
{
    this.startPos = startPos;
    this.endPos = endPos;
}

glObjectLine.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectLine.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectLine.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectLine.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectLine.prototype.setObjectID = function ( id )
{
	var objectID4 =  Math.floor( id / ( 256 * 256 * 256 ) );
	var qotient1  =  Math.floor( id % ( 256 * 256 * 256 ) );
	var objectID3 =  Math.floor( qotient1 / ( 256 * 256 ) );
	var qotient2  =  Math.floor( qotient1 % ( 256 * 256 ) );
	var objectID2 =  Math.floor( qotient2 / 256 );
	var objectID1 =  Math.floor( qotient2 % 256 );
    this.objectID = [ objectID1 / 255, objectID2 / 255, objectID3 / 255, 1.0 ];
}

glObjectLine.prototype.drawObjectIDMap = function ( glContext )
{
    if( !this.visible ) return;

    let gl = glContext;
    let glShader = this.webGLView.webGLShaderList["lineObjectMap"];

    gl.useProgram(glShader);

    // shader variable
    glShader.aPosition     = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aLinePos      = gl.getAttribLocation(glShader, "aLinePosition");
    glShader.uMWMatrix     = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix     = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix      = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uLineParam    = gl.getUniformLocation(glShader, "uLineParam");       
    glShader.uObjectID     = gl.getUniformLocation(glShader, "uObjectID");

    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // line Param
    var lineParam = [this.width, 0.0, 0.0, 0.0];
    gl.uniform4fv(glShader.uLineParam, lineParam);

    // Object Type
    gl.uniform4fv(glShader.uObjectID, this.objectID);

    // draw
    gl.enableVertexAttribArray(glShader.aPos);
    gl.enableVertexAttribArray(glShader.aLinePos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLinePos);
    gl.vertexAttribPointer(glShader.aLinePos, this.bufferLinePos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
    gl.disableVertexAttribArray(glShader.aLinePos);     
}

glObjectLine.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;    

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    gl.disable(gl.BLEND);  

    // shader variable
    glShader.aPos = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aLinePos = gl.getAttribLocation(glShader, "aLinePosition");
    glShader.uMWMatrix = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uColor = gl.getUniformLocation(glShader, "uColor");
    glShader.uLineParam = gl.getUniformLocation(glShader, "uLineParam");    
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

    // line Param
    var lineParam = [this.width, 0.0, 0.0, 0.0];
    gl.uniform4fv(glShader.uLineParam, lineParam);

    // param
    let isBlinking = 0.0;
    if( this.select ){ isBlinking = 1.0; }
    let isArrowShown = 0.0;
    if( this.isArrowShown ){ isArrowShown = 1.0; }
    let param = [ time / 100, isBlinking, this.lineLength, isArrowShown ];
    gl.uniform4fv(glShader.uParam, param); 

    // draw
    gl.enableVertexAttribArray(glShader.aPos);
    gl.enableVertexAttribArray(glShader.aLinePos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLinePos);
    gl.vertexAttribPointer(glShader.aLinePos, this.bufferLinePos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
    gl.disableVertexAttribArray(glShader.aLinePos);    
}

glObjectLine.prototype.setPositions = function( positions )
{
    let gl = this.webGLView.context;
    let vertexPos = new Array();
    let linePos = new Array();    
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferLinePos);
    this.lineLength = positions.length;    

    function sub( vec1, vec2 )
    {
        let vec = [];
        vec[0] = vec1[0] - vec2[0];
        vec[1] = vec1[1] - vec2[1];
        vec[2] = vec1[2] - vec2[2];
        return vec;
    }

    function cross( vec1, vec2 )
    {
        let vec = [];
        vec[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
        vec[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
        vec[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
        return vec;
    }

    function normalize( vec )
    {
        let length = Math.sqrt( vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2] ); 
        return [ vec[0] / length, vec[1] / length, vec[2] / length ];
    }

    let lastStopPosX;
    let lastStopPosY;
    let lastStopPosZ;
    let lastStopPos1X;
    let lastStopPos1Y;
    let lastStopPos1Z;
    let lastStopPos2X;
    let lastStopPos2Y;
    let lastStopPos2Z;

    for( var i = 0; i < positions.length - 1; ++i )
    {
        let startPos = [];
        startPos[0] = positions[i][0];
        startPos[1] = positions[i][1];
        startPos[2] = positions[i][2];

        let stopPos = [];
        stopPos[0] = positions[i+1][0];
        stopPos[1] = positions[i+1][1];
        stopPos[2] = positions[i+1][2];

        let vecLineDir = sub( stopPos, startPos );
        let normal = [ 0.0, 1.0, 0.0 ];
        let vecLineSide = normalize( cross( vecLineDir, normal ) );

        let lineWidth = 0.5;
        let startPos1X = startPos[0] + lineWidth * vecLineSide[0];
        let startPos1Y = startPos[1] + lineWidth * vecLineSide[1];
        let startPos1Z = startPos[2] + lineWidth * vecLineSide[2];
        let startPos2X = startPos[0] - lineWidth * vecLineSide[0];
        let startPos2Y = startPos[1] - lineWidth * vecLineSide[1];
        let startPos2Z = startPos[2] - lineWidth * vecLineSide[2];
        let stopPos1X = stopPos[0] + lineWidth * vecLineSide[0];
        let stopPos1Y = stopPos[1] + lineWidth * vecLineSide[1];
        let stopPos1Z = stopPos[2] + lineWidth * vecLineSide[2];
        let stopPos2X = stopPos[0] - lineWidth * vecLineSide[0];
        let stopPos2Y = stopPos[1] - lineWidth * vecLineSide[1];
        let stopPos2Z = stopPos[2] - lineWidth * vecLineSide[2];

        if( i != 0 )
        {
            vertexPos.push(lastStopPos1X);
            vertexPos.push(lastStopPos1Y);
            vertexPos.push(lastStopPos1Z);
            linePos.push(lastStopPosX);
            linePos.push(lastStopPosY);
            linePos.push(lastStopPosZ);
            linePos.push(i - 1);
            
            vertexPos.push(lastStopPos2X);
            vertexPos.push(lastStopPos2Y);
            vertexPos.push(lastStopPos2Z);
            linePos.push(lastStopPosX);
            linePos.push(lastStopPosY);
            linePos.push(lastStopPosZ);
            linePos.push(i - 1);
            
            vertexPos.push(startPos1X);
            vertexPos.push(startPos1Y);
            vertexPos.push(startPos1Z);
            linePos.push(startPos[0]);
            linePos.push(startPos[1]);
            linePos.push(startPos[2]);
            linePos.push(i);
            
            vertexPos.push(startPos1X);
            vertexPos.push(startPos1Y);
            vertexPos.push(startPos1Z);
            linePos.push(startPos[0]);
            linePos.push(startPos[1]);
            linePos.push(startPos[2]);
            linePos.push(i);
            
            vertexPos.push(lastStopPos2X);
            vertexPos.push(lastStopPos2Y);
            vertexPos.push(lastStopPos2Z);
            linePos.push(lastStopPosX);
            linePos.push(lastStopPosY);
            linePos.push(lastStopPosZ);
            linePos.push(i - 1);
            
            vertexPos.push(startPos2X);
            vertexPos.push(startPos2Y);
            vertexPos.push(startPos2Z);
            linePos.push(startPos[0]);
            linePos.push(startPos[1]);
            linePos.push(startPos[2]);
            linePos.push(i);            
        }

        vertexPos.push(startPos1X);
        vertexPos.push(startPos1Y);
        vertexPos.push(startPos1Z);
        linePos.push(startPos[0]);
        linePos.push(startPos[1]);
        linePos.push(startPos[2]);
        linePos.push(i);
        
        vertexPos.push(startPos2X);
        vertexPos.push(startPos2Y);
        vertexPos.push(startPos2Z);
        linePos.push(startPos[0]);
        linePos.push(startPos[1]);
        linePos.push(startPos[2]);
        linePos.push(i);
        
        vertexPos.push(stopPos1X);
        vertexPos.push(stopPos1Y);
        vertexPos.push(stopPos1Z);
        linePos.push(stopPos[0]);
        linePos.push(stopPos[1]);
        linePos.push(stopPos[2]);
        linePos.push(i + 1);
        
        vertexPos.push(stopPos1X);
        vertexPos.push(stopPos1Y);
        vertexPos.push(stopPos1Z);
        linePos.push(stopPos[0]);
        linePos.push(stopPos[1]);
        linePos.push(stopPos[2]);
        linePos.push(i + 1);
        
        vertexPos.push(startPos2X);
        vertexPos.push(startPos2Y);
        vertexPos.push(startPos2Z);
        linePos.push(startPos[0]);
        linePos.push(startPos[1]);
        linePos.push(startPos[2]);    
        linePos.push(i);
        
        vertexPos.push(stopPos2X);
        vertexPos.push(stopPos2Y);
        vertexPos.push(stopPos2Z);
        linePos.push(stopPos[0]);
        linePos.push(stopPos[1]);
        linePos.push(stopPos[2]);
        linePos.push(i + 1);
        
        lastStopPosX  = stopPos[0];
        lastStopPosY  = stopPos[1];
        lastStopPosZ  = stopPos[2];
        lastStopPos1X = stopPos1X;
        lastStopPos1Y = stopPos1Y;
        lastStopPos1Z = stopPos1Z;
        lastStopPos2X = stopPos2X;
        lastStopPos2Y = stopPos2Y;
        lastStopPos2Z = stopPos2Z;
    }

    {
        let lastIndex = positions.length - 1;
        let startPos = [];
        startPos[0] = positions[lastIndex-1][0];
        startPos[1] = positions[lastIndex-1][1];
        startPos[2] = positions[lastIndex-1][2];
        let stopPos = [];
        stopPos[0] = positions[lastIndex][0];
        stopPos[1] = positions[lastIndex][1];
        stopPos[2] = positions[lastIndex][2];
        let vecLineDir = sub( stopPos, startPos );

        let lineWidth = 0.5;
        let normal = [ 0.0, 1.0, 0.0 ];
        let vecArrowDir = normalize( vecLineDir );        
        let vecLineSide = normalize( cross( vecLineDir, normal ) );        
        let pos1X = stopPos[0] + 3 * lineWidth * vecLineSide[0];
        let pos1Y = stopPos[1] + 3 * lineWidth * vecLineSide[1];
        let pos1Z = stopPos[2] + 3 * lineWidth * vecLineSide[2];  
        let pos2X = stopPos[0] - 3 * lineWidth * vecLineSide[0];
        let pos2Y = stopPos[1] - 3 * lineWidth * vecLineSide[1];
        let pos2Z = stopPos[2] - 3 * lineWidth * vecLineSide[2];  
        let pos3X = stopPos[0] + 2 * vecArrowDir[0];
        let pos3Y = stopPos[1] + 2 * vecArrowDir[1];
        let pos3Z = stopPos[2] + 2 * vecArrowDir[2]; 

        vertexPos.push(pos1X);
        vertexPos.push(pos1Y);
        vertexPos.push(pos1Z);
        linePos.push(stopPos[0]);
        linePos.push(stopPos[1]);
        linePos.push(stopPos[2]);
        linePos.push(lastIndex + 1);
        
        vertexPos.push(pos2X);
        vertexPos.push(pos2Y);
        vertexPos.push(pos2Z);
        linePos.push(stopPos[0]);
        linePos.push(stopPos[1]);
        linePos.push(stopPos[2]);    
        linePos.push(lastIndex + 1);
        
        vertexPos.push(pos3X);
        vertexPos.push(pos3Y);
        vertexPos.push(pos3Z);
        linePos.push(stopPos[0]);
        linePos.push(stopPos[1]);
        linePos.push(stopPos[2]);
        linePos.push(lastIndex + 1);        
    }

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;

    this.bufferLinePos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLinePos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePos), gl.STATIC_DRAW);
    this.bufferLinePos.itemSize = 4;
    this.bufferLinePos.numberOfItems = linePos.length / 4;
}