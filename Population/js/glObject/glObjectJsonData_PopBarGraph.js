
glObjectJsonData_PopBarGraph = function ( glCanvas )
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

    this.colorR = 1;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 1;
}

glObjectJsonData_PopBarGraph.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferColor);
    gl.deleteBuffer(this.bufferBarGraphPos);
    gl.deleteBuffer(this.bufferObjectID);    
}

glObjectJsonData_PopBarGraph.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectJsonData_PopBarGraph.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectJsonData_PopBarGraph.prototype.setSelect = function ( select, id1, id2 )
{
    this.select = select; 
    this.selectID1 = id1 / 255;
    this.selectID2 = id2 / 255;    
}

glObjectJsonData_PopBarGraph.prototype.setWidth = function ( width )
{
    this.width = width;    
}

glObjectJsonData_PopBarGraph.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectJsonData_PopBarGraph.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectJsonData_PopBarGraph.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectJsonData_PopBarGraph.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectJsonData_PopBarGraph.prototype.setObjectID = function ( id )
{
    this.objectID[0] = id / 255;
}

glObjectJsonData_PopBarGraph.prototype.getAttributeData = function( id1, id2 )
{
    let id = 256 * id2 + id1;
    return this.attributeData[ id ];
}

glObjectJsonData_PopBarGraph.prototype.drawObjectIDMap = function ( glContext )
{
    return;

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
    var lineParam = [this.width, 0.0, 0.0, 0.0];
    gl.uniform4fv(glShader.uLineParam, lineParam);

    // Object Type
    gl.uniform4fv(glShader.uObjectID, this.objectID);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.enableVertexAttribArray(glShader.aObjectID);
    gl.enableVertexAttribArray(glShader.aLinePos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObjectID);
    gl.vertexAttribPointer(glShader.aObjectID, this.bufferObjectID.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferBarGraphPos);
    gl.vertexAttribPointer(glShader.aLinePos, this.bufferBarGraphPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPosition);
    gl.disableVertexAttribArray(glShader.aObjectID);         
    gl.disableVertexAttribArray(glShader.aLinePos);     
}

glObjectJsonData_PopBarGraph.prototype.draw = function ( glContext, time )
{
    if( !this.visible ) return;    

    let gl = glContext;
    let glShader = this.shader;

    gl.useProgram(glShader);

    gl.disable(gl.BLEND);  

    // shader variable
    glShader.aPos = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.aNormal = gl.getAttribLocation(glShader, "aVertexNormal");
    glShader.aBarGraphPos = gl.getAttribLocation(glShader, "aBarGraphPosition");
    glShader.uMWMatrix = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uNormalMatrix = gl.getUniformLocation(glShader, "uNormalMatrix");    
    glShader.uBarGraphParam = gl.getUniformLocation(glShader, "uBarGraphParam");    
    glShader.uColor = gl.getUniformLocation(glShader, "uColor");
    glShader.uLightPos = gl.getUniformLocation(glShader, "uLightPos");
    glShader.uParam = gl.getUniformLocation(glShader, "uParam");
    
    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix  
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // BarGraph Param
    var barGraphParam = [this.width, 0.0, 0.0, 0.0];
    gl.uniform4fv(glShader.uBarGraphParam, barGraphParam);

    // Normal Matrix
    var normalMatrix = mat4.create();
    mat4.inverse(this.WorldMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix4fv(glShader.uNormalMatrix, false, normalMatrix);

    // Color
    var color = [this.colorR, this.colorG, this.colorB, this.colorA];
    gl.uniform4fv(glShader.uColor, color);

    // param
    let selected = 0.0;
    if( this.select ) selected = 1.0; 
    let param = [ time / 100, selected, this.selectID1, this.selectID2 ];
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
    gl.enableVertexAttribArray(glShader.aPos);
    gl.enableVertexAttribArray(glShader.aNormal);
    gl.enableVertexAttribArray(glShader.aBarGraphPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPos, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexNormal);
    gl.vertexAttribPointer(glShader.aNormal, this.bufferVertexNormal.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferBarGraphPos);
    gl.vertexAttribPointer(glShader.aBarGraphPos, this.bufferBarGraphPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
    gl.disableVertexAttribArray(glShader.aNormal);     
    gl.disableVertexAttribArray(glShader.aBarGraphPos);  
}

glObjectJsonData_PopBarGraph.prototype.setJsonData = function( jsonData )
{
    // console.log(jsonData);

    let gl = this.webGLView.context;
    let vertexPos = new Array();
    let normal = new Array();    
    let color = new Array();
    let barPos = new Array();    
    let objectID = new Array();
    
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexNormal);    
    gl.deleteBuffer(this.bufferColor);
    gl.deleteBuffer(this.bufferBarGraphPos);
    gl.deleteBuffer(this.bufferObjectID);    

    let points = jsonData.Records;
    let pointCount = 0;
    let lastBufferSize = 0;
    for( let i = 0; i < points.length; ++i ){
        let position = points[i].Pos;
        let attribute = points[i].Att;
        let lon = position[0];
        let lat = -position[1];
        let alt = attribute[0] * 0.000075;
        // let objectID2 = Math.floor( pointCount / 256 ) / 255;
        // let objectID1 = Math.floor( pointCount % 256 ) / 255;

        let cube = this.getCubeVertexData();
        for( let i in cube.position ){
            vertexPos.push( cube.position[i] );
        }
        for( let i in cube.normal ){
            normal.push( cube.normal[i] );
        }        
        for( let i = 0; i < cube.position.length / 3; ++i ){
            barPos.push( lon );
            barPos.push( lat );
            barPos.push( alt );            
        }  



        ++pointCount;
    }

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;

    this.bufferVertexNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexNormal);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
    this.bufferVertexNormal.itemSize = 3;
    this.bufferVertexNormal.numberOfItems = normal.length / 3;

    // this.bufferColor = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColor);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    // this.bufferColor.itemSize = 4;
    // this.bufferColor.numberOfItems = color.length / 4; 

    this.bufferBarGraphPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferBarGraphPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barPos), gl.STATIC_DRAW);
    this.bufferBarGraphPos.itemSize = 3;
    this.bufferBarGraphPos.numberOfItems = barPos.length / 3; 
    
    // this.bufferObjectID = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObjectID);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objectID), gl.STATIC_DRAW);
    // this.bufferObjectID.itemSize = 4;
    // this.bufferObjectID.numberOfItems = objectID.length / 4;    
}

glObjectJsonData_PopBarGraph.prototype.getCubeVertexData = function()
{
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

    return { "position":vertexPos, "normal":vertexNormal };
}