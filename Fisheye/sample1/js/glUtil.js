
function createGLContext(canvas){
  let names = ["webgl", "experimental-webgl"];
  let context = null;

  for(let i = 0; i < names.length; i++){
    try{
      context = canvas.getContext(names[i]);
    }
    catch (e) { }
    if (context) {
      break;
    }
  }

  if (!context) {
    alert("Failed to create WebGL context!");
  }

  return context;
}

function createShaderProgram(glContext, vertexShaderSource, fragmentShaderSource){
  let gl = glContext;
  let vertexShader   = loadShader(gl, gl.VERTEX_SHADER,   vertexShaderSource  );
  let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  let shaderProgram  = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }
  return shaderProgram;
}

function loadShader(glContext, type, shaderSource){
  let gl = glContext;
  let shader = gl.createShader( type );
  gl.shaderSource( shader, shaderSource );
  gl.compileShader( shader );
  if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
    alert( "Error compiling shader" + gl.getShaderInfoLog( shader ) );
    gl.deleteShader( shader );
    return null;
  }
  return shader;
}

function createTexture(glContext, pixels){
  let gl = glContext;
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); 
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return texture
}