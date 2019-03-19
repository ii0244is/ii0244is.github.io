
glObjectShapeJson_Line = function ( glCanvas )
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

    this.positions = [];

    this.objectID = [0, 0, 0, 0];
    this.visible = true;
    this.select = false;

    this.colorR = 1;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 1;
}

glObjectShapeJson_Line.prototype.release = function (glContext)
{
    let gl = glContext;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexNormal);
}

glObjectShapeJson_Line.prototype.attachShader = function ( shader )
{
    this.shader = this.webGLView.webGLShaderList[shader];
}

glObjectShapeJson_Line.prototype.setVisible = function ( visible )
{
    this.visible = visible;
}

glObjectShapeJson_Line.prototype.setSelect = function ( isSeledted )
{
    this.select = isSeledted;
}

glObjectShapeJson_Line.prototype.setWidth = function ( width )
{
    this.width = width;    
}

glObjectShapeJson_Line.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

glObjectShapeJson_Line.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

glObjectShapeJson_Line.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

glObjectShapeJson_Line.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

glObjectShapeJson_Line.prototype.setObjectID = function ( id )
{
}

glObjectShapeJson_Line.prototype.drawObjectIDMap = function ( glContext )
{ 
}

glObjectShapeJson_Line.prototype.draw = function ( glContext, time )
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
    gl.drawArrays(gl.LINES, 0, this.bufferVertexPos.numberOfItems);
    gl.disableVertexAttribArray(glShader.aPos);
}

glObjectShapeJson_Line.prototype.setJsonData = function( jsonData )
{
    let gl = this.webGLView.context;
    let vertexPos = new Array();

    let shapes = jsonData.Records;
    for( let i = 0; i < shapes.length; ++i ){
        let position = shapes[i].Position;
        for( let j = 0; j < position.length; ++j ){
            let part = position[j];
            for( let k = 0; k < part.length - 1; ++k ){
                let posX = part[k][0];
                let posY = part[k][2];
                let posZ = -part[k][1];
                vertexPos.push(posX);
                vertexPos.push(posY);
                vertexPos.push(posZ);
                posX = part[k+1][0];
                posY = part[k+1][2];
                posZ = -part[k+1][1];
                vertexPos.push(posX);
                vertexPos.push(posY);
                vertexPos.push(posZ);                
            }
        }
    }

    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = vertexPos.length / 3;
}