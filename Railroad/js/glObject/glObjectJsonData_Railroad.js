
glObjectJsonData_Railroad = function ( glCanvas )
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

    this.attributeData = [];
    this.positions = [];
    this.width = 0.2;
    this.objectID = [0, 0, 0, 0];
    this.visible = true;
    this.select = false;
    this.selectID1 = 0;
    this.selectID2 = 0;  
    this.time = 1960;

    this.colorR = 1;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 1;
}

glObjectJsonData_Railroad.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferColor);
    gl.deleteBuffer(this.bufferLinePos);
    gl.deleteBuffer(this.bufferObjectID);    
}

glObjectJsonData_Railroad.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectJsonData_Railroad.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectJsonData_Railroad.prototype.setSelect = function ( select, id1, id2 )
{
    this.select = select; 
    this.selectID1 = id1 / 255;
    this.selectID2 = id2 / 255;    
}

glObjectJsonData_Railroad.prototype.setWidth = function ( width )
{
    this.width = width;    
}

glObjectJsonData_Railroad.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectJsonData_Railroad.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectJsonData_Railroad.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectJsonData_Railroad.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectJsonData_Railroad.prototype.setObjectID = function ( id )
{
    this.objectID[0] = id / 255;
}

glObjectJsonData_Railroad.prototype.setTime = function ( time )
{
    this.time = time;
}

glObjectJsonData_Railroad.prototype.getAttributeData = function( id1, id2 )
{
    let id = 256 * id2 + id1;
    return this.attributeData[ id ];
}

glObjectJsonData_Railroad.prototype.drawObjectIDMap = function ( glContext )
{
    // return;

    if( !this.visible ) return;

    let gl = glContext;
    let glShader = this.webGLView.webGLShaderList["objectMapLine"];

    gl.useProgram(glShader);

    // shader variable
    glShader.aPosition     = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aObjectID     = gl.getAttribLocation(glShader, "aObjectID");
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
    let selected = 0.0;
    if( this.select ) selected = 1.0;         
    var lineParam = [this.width, selected, 0.0, 0.0];
    gl.uniform4fv(glShader.uLineParam, lineParam);

    // Object Type
    this.objectID[1] = this.time;
    gl.uniform4fv(glShader.uObjectID, this.objectID);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.enableVertexAttribArray(glShader.aObjectID);
    gl.enableVertexAttribArray(glShader.aLinePos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObjectID);
    gl.vertexAttribPointer(glShader.aObjectID, this.bufferObjectID.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLinePos);
    gl.vertexAttribPointer(glShader.aLinePos, this.bufferLinePos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPosition);
    gl.disableVertexAttribArray(glShader.aObjectID);         
    gl.disableVertexAttribArray(glShader.aLinePos);     
}

glObjectJsonData_Railroad.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;    

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    gl.disable(gl.BLEND);  

    // shader variable
    glShader.aPos = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aObjectID = gl.getAttribLocation(glShader, "aObjectID");    
    glShader.aColor = gl.getAttribLocation(glShader, "aColor");
    glShader.aLinePos = gl.getAttribLocation(glShader, "aLinePosition");
    glShader.uMWMatrix = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uLineParam = gl.getUniformLocation(glShader, "uLineParam");    
    glShader.uParam = gl.getUniformLocation(glShader, "uParam");
    
    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix  
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // line Param
    let selected = 0.0;
    if( this.select ) selected = 1.0;         
    var lineParam = [this.width, selected, this.selectID1, this.selectID2];
    gl.uniform4fv(glShader.uLineParam, lineParam);

    // param
    let param = [ this.time, selected, this.selectID1, this.selectID2 ];
    gl.uniform4fv(glShader.uParam, param); 

    // draw
    gl.enableVertexAttribArray(glShader.aPos);
    gl.enableVertexAttribArray(glShader.aColor);
    gl.enableVertexAttribArray(glShader.aObjectID);    
    gl.enableVertexAttribArray(glShader.aLinePos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColor);
    gl.vertexAttribPointer(glShader.aColor, this.bufferColor.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObjectID);
    gl.vertexAttribPointer(glShader.aObjectID, this.bufferObjectID.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLinePos);
    gl.vertexAttribPointer(glShader.aLinePos, this.bufferLinePos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
    gl.disableVertexAttribArray(glShader.aColor);   
    gl.disableVertexAttribArray(glShader.aObjectID);        
    gl.disableVertexAttribArray(glShader.aLinePos);  
}

glObjectJsonData_Railroad.prototype.setJsonData = function( jsonData, altitude )
{
    // console.log(jsonData);

    let gl = this.webGLView.context;
    let vertexPos = new Array();
    let color = new Array();
    let linePos = new Array();    
    let objectID = new Array();
    
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferColor);
    gl.deleteBuffer(this.bufferLinePos);
    gl.deleteBuffer(this.bufferObjectID);    

    let shapes = jsonData.Records;
    let shapeCount = 0;
    let lastBufferSize = 0;
    for( let i = 0; i < shapes.length; ++i ){
        let position = shapes[i].Position;
        let attribute = shapes[i].Attribute;
        this.attributeData.push( attribute );
        let objectID2 = Math.floor( shapeCount / 256 ) / 255;
        let objectID1 = Math.floor( shapeCount % 256 ) / 255;
        let colorR = Math.random() * 0.25 + 0.25;
        let colorG = Math.random() * 0.25 + 0.25;
        let colorB = Math.random() * 0.25 + 0.25;
        let begin  = Number( attribute.N05_004 );
        let end    = Number( attribute.N05_005e );   
        for( let j = 0; j < position.length; ++j ){
            let alt = 0;
            if( altitude ) alt = altitude;
            // alt += 0.000001 * i;
            this.setPositions( position[j], vertexPos, linePos, alt );
            let bufferSize = vertexPos.length / 3 - lastBufferSize;
            lastBufferSize = vertexPos.length / 3;
            for( let k = 0; k < bufferSize; ++k ){
                objectID.push( objectID1 );
                objectID.push( objectID2 );
                objectID.push( begin );
                objectID.push( end );
                // color.push( 0.66 );
                // color.push( 0.2 );
                // color.push( 0.2 );   
                color.push( colorR );
                color.push( colorG );
                color.push( colorB );
                color.push( 1.0 );        
            }            
        }
        ++shapeCount;
    }

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;

    this.bufferColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    this.bufferColor.itemSize = 4;
    this.bufferColor.numberOfItems = color.length / 4; 

    this.bufferLinePos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferLinePos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePos), gl.STATIC_DRAW);
    this.bufferLinePos.itemSize = 4;
    this.bufferLinePos.numberOfItems = linePos.length / 4; 
    
    this.bufferObjectID = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObjectID);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectID), gl.STATIC_DRAW);
    this.bufferObjectID.itemSize = 4;
    this.bufferObjectID.numberOfItems = objectID.length / 4;    
}

glObjectJsonData_Railroad.prototype.setPositions = function( positions, vertexPos, linePos, altitude )
{
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
        startPos[0] = Number( positions[i][0] );
        startPos[1] = 0 + altitude;
        startPos[2] = -Number( positions[i][1] );

        let stopPos = [];
        stopPos[0] = Number( positions[i+1][0] );
        stopPos[1] = 0 + altitude;
        stopPos[2] = -Number( positions[i+1][1] );

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
}