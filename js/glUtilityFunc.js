
function createGLContext(canvas)
{
    var names = ["webgl", "experimental-webgl"];
    var context = null;

    for (var i = 0; i < names.length; i++)
    {
        try
        {
            context = canvas.getContext(names[i]);
        }
        catch (e) { }

        if (context) { break; }
    }

    if (context)
    {
        context.viewportWidth = canvas.width;
        context.viewportHeight = canvas.height;
    }
    else
    {
        alert("Failed to create WebGL context!");
    }

    return context;
}

function createShaderProgram( glContext, vertexShaderSource, fragmentShaderSource )
{
    let gl = glContext;

    let vertexShader   = loadShader( gl, gl.VERTEX_SHADER,   vertexShaderSource.text   );
    let fragmentShader = loadShader( gl, gl.FRAGMENT_SHADER, fragmentShaderSource.text);
    let shaderProgram  = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        alert("Failed to setup shaders");
    }

    return shaderProgram;
}

function loadShader(glContext, type, shaderSource)
{
    let gl = glContext;

    let shader = gl.createShader( type );
    gl.shaderSource( shader, shaderSource );
    gl.compileShader( shader );
    
    if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) 
    {
        alert( "Error compiling shader" + gl.getShaderInfoLog( shader ) );
        gl.deleteShader( shader );   
        return null;
    }
    
    return shader;  
}