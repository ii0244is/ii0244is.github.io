let Sphere = function ( glContext, radius, stacks, slices )
{
    this.gl = glContext;
    let gl = this.gl;

    this.WorldMatrix = mat4.create();
    this.ViewMatrix  = mat4.create();
    this.ProjMatrix  = mat4.create();
    mat4.identity(this.WorldMatrix);
    mat4.identity(this.ViewMatrix);
    mat4.identity(this.ProjMatrix);
    
    this.colorR = 0;
    this.colorG = 0;
    this.colorB = 0;
    this.colorA = 0;
   
    let vertexPos    = [ ( stacks + 1 ) * slices * 3 ];
    let vertexNormal = [ ( stacks + 1 ) * slices * 3 ];
    let vertexIndex  = [ stacks * slices * 6 ];	
   
    for( let i = 0; i < stacks + 1; ++i )
    {
        for( let j = 0; j < slices; ++j )
        {
            let alpha = 3.141592 * 2 / ( slices - 1 ) * j;
            let beta  = 3.141592 / stacks * i;
            let index = slices * i * 3 + j * 3;

            vertexPos[index + 0] = radius * Math.sin(beta) * Math.sin(alpha);
            vertexPos[index + 1] = radius * Math.sin(beta) * Math.cos(alpha);
            vertexPos[index + 2] = radius * Math.cos(beta);

            vertexNormal[index + 0] = radius * Math.sin(beta) * Math.sin(alpha);
            vertexNormal[index + 1] = radius * Math.sin(beta) * Math.cos(alpha);
            vertexNormal[index + 2] = radius * Math.cos(beta);
        }
    }	
   
    for( let i = 0; i < stacks; ++i )
    {
        for( let j = 0; j < slices; ++j )
        {
            let index = slices * i * 6 + j * 6;

            if( j != slices - 1 )
            {
                vertexIndex[ index + 0] = slices * i + j;
                vertexIndex[ index + 1] = slices * i + j + 1;
                vertexIndex[ index + 2] = slices * (i + 1) + j;
                vertexIndex[ index + 3] = slices * i + j + 1;
                vertexIndex[ index + 4] = slices * (i + 1) + j + 1;
                vertexIndex[ index + 5] = slices * (i + 1) + j;
            }
            else
            {
                vertexIndex[ index + 0] = slices * i + j;
                vertexIndex[ index + 1] = slices * i;
                vertexIndex[ index + 2] = slices * (i + 1) + j;
                vertexIndex[ index + 3] = slices * i;
                vertexIndex[ index + 4] = slices * (i + 1);
                vertexIndex[ index + 5] = slices * (i + 1) + j;	  
            }
        }
    }	
   
    this.bufferVertexPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos );	
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexPos ), gl.STATIC_DRAW );
    this.bufferVertexPos.itemSize = 3;
    this.bufferVertexPos.numberOfItems = ( stacks + 1 ) * slices * 3;

    this.bufferVertexNormal = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexNormal );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexNormal ), gl.STATIC_DRAW );
    this.bufferVertexNormal.itemSize = 3;
    this.bufferVertexNormal.numberOfItems = ( stacks + 1 ) * slices * 3;

    this.bufferVertexIndex = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.bufferVertexIndex );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( vertexIndex ), gl.STATIC_DRAW );
    this.bufferVertexIndex.itemSize = 1;
    this.bufferVertexIndex.numberOfItems = stacks * slices * 6;    
}

Sphere.prototype.release = function (glContext)
{
    let gl = this.gl;
    gl.deleteBuffer(this.bufferVertexPos);
    gl.deleteBuffer(this.bufferVertexNormal);
}

Sphere.prototype.attachShader = function ( shader )
{
    this.shader = shader;
}

Sphere.prototype.setWorldMat = function ( worldMat )
{
    this.WorldMatrix = worldMat;
}

Sphere.prototype.setView = function ( viewMat )
{
    this.ViewMatrix = viewMat;
}

Sphere.prototype.setProjection = function ( projMatrix )
{
    this.ProjMatrix = projMatrix;
}

Sphere.prototype.setColor = function (r, g, b, a)
{
    this.colorR = r;
    this.colorG = g;
    this.colorB = b;
    this.colorA = a;
}

Sphere.prototype.draw = function ( glContext, time )
{
    let gl = this.gl;
    let glShader = this.shader;

    gl.useProgram(glShader);

    // blend
    gl.enable(gl.BLEND);    
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // shader veriable
    glShader.aPosition     = gl.getAttribLocation(glShader, "aVertexPosition");
    glShader.uMWMatrix     = gl.getUniformLocation(glShader, "uMWMatrix");
    glShader.uMVMatrix     = gl.getUniformLocation(glShader, "uMVMatrix");
    glShader.uPMatrix      = gl.getUniformLocation(glShader, "uPMatrix");
    glShader.uColor        = gl.getUniformLocation(glShader, "uColor");

    // Projection Matrix
    gl.uniformMatrix4fv(glShader.uPMatrix, false, this.ProjMatrix);

    // View Matrix
    gl.uniformMatrix4fv(glShader.uMVMatrix, false, this.ViewMatrix);

    // World Matrix
    gl.uniformMatrix4fv(glShader.uMWMatrix, false, this.WorldMatrix);

    // Color
    let color = [this.colorR, this.colorG, this.colorB, this.colorA];
    gl.uniform4fv(glShader.uColor, color);

    // draw
    gl.enableVertexAttribArray(glShader.aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertexPos);
    gl.vertexAttribPointer(glShader.aPosition, this.bufferVertexPos.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.bufferVertexIndex );
    gl.drawElements( gl.TRIANGLES, this.bufferVertexIndex.numberOfItems, gl.UNSIGNED_SHORT, 0 );    	
    gl.disableVertexAttribArray(glShader.aPosition);
}