
//
// http://127.0.0.1:8887/WebGL_Sample/MouseMoveEarth_ArcBall/index.html
//

let g_canvas;
let g_glContext;
let g_glShaderProgram;
let g_glObjects = [];

function appStart()
{
    initGL();
    createSphere();
    createMap( "map/ne_50m_admin_0_countries.json" );
    setUpMouseEvent();
    mainLoop();
}

function initGL()
{
    let canvasArea = document.getElementById("glCanvasArea");
    g_canvas = document.createElement("canvas");  
    g_canvas.width = canvasArea.clientWidth;
    g_canvas.height = canvasArea.clientHeight;
    g_glContext = createGLContext(g_canvas);
    canvasArea.appendChild(g_canvas);

    let vertexShaderSource = document.getElementById("vertexShaderSingleColor");
    let fragmentShaderSource = document.getElementById("fragmentShaderSingleColor");
    g_glShaderProgram = createShaderProgram(g_glContext, vertexShaderSource, fragmentShaderSource);
}

function createSphere()
{   
    let earth = new Sphere( g_glContext, 100, 100, 100 );
    earth.attachShader(g_glShaderProgram);
    earth.setColor( 0.6, 0.6, 0.8, 1.0 ); 
    g_glObjects.push(earth);
}

function createMap( fileName )
{   
    function requestJsonFile( fileName, callback )
    {
        let request = new window.XMLHttpRequest();
        request.open("GET", fileName, true);
        request.onreadystatechange = function(){
            if( request.readyState == 4 )
            {
                let jsonData = JSON.parse( request.responseText );
                callback( jsonData );
            }
        };
        request.send(null);
    }

    function calcVertexPos( lon, alt, lat )
    {   
        let radius = 100 + alt + 0.01;
        let radH = lon * 3.141592 / 180;
        let radV = lat * 3.141592 / 180;
        let x = radius * Math.cos(radV) * Math.sin(radH);
        let y = radius * Math.sin(radV);
        let z = radius * Math.cos(radV) * Math.cos(radH);    
        return [x, y, z];
    }

    function createMapLine( GeoJsonFile )
    {                      
        let shapes = GeoJsonFile.Records;
        for( let i = 0; i < shapes.length; ++i ){
            let position = shapes[i].Position;
            for( let j = 0; j < position.length; ++j ){
                let vertexPos = new Array();  
                let part = position[j];
                for( let k = 0; k < part.length - 1; ++k ){
                    let lon = part[k][0];
                    let alt = part[k][2];
                    let lat = part[k][1];
                    vertex = calcVertexPos( lon, alt, lat );
                    vertexPos.push(vertex[0]);
                    vertexPos.push(vertex[1]);
                    vertexPos.push(vertex[2]);
                    lon = part[k+1][0];
                    alt = part[k+1][2];
                    lat = part[k+1][1];
                    vertex = calcVertexPos( lon, alt, lat );
                    vertexPos.push(vertex[0]);
                    vertexPos.push(vertex[1]);
                    vertexPos.push(vertex[2]);                                 
                }              
                let glLineObj = new Line(g_glContext, vertexPos);
                glLineObj.attachShader(g_glShaderProgram); 
                glLineObj.setColor( 0.0, 0.0, 0.0, 1.0 );  
                g_glObjects.push(glLineObj);    
            }
        }      
    }
    
    requestJsonFile( fileName, createMapLine );
}

function setUpMouseEvent()
{
    g_cameraController = new CameraController();
    g_cameraController.setScreenSize( g_canvas.width, g_canvas.height );
    g_cameraController.setSphereRadius(100);
    g_cameraController.setFovy(40)

    g_canvas.onmousedown = function(event) {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;        
        g_cameraController.onMouseDown(x, y);
    }

    g_canvas.onmousemove = function(event) {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;        
        g_cameraController.onMouseMove(x, y);
    }    

    g_canvas.onmouseup = function(event) {
        g_cameraController.onMouseUp();
    }      

    g_canvas.onmousewheel = function(event) {
        g_cameraController.onMouseWheel(event.wheelDelta);
    }     

    let canvasArea = document.getElementById("glCanvasArea");
    function resizeEvent(event) {   
        g_canvas.width  = canvasArea.clientWidth;
        g_canvas.height = canvasArea.clientHeight;
        g_cameraController.setScreenSize( g_canvas.width, g_canvas.height );     
    };
    window.addEventListener("resize", resizeEvent.bind(this) );
    resizeEvent();    
}

function mainLoop()
{
    let gl = g_glContext;
    gl.clearColor( 0.2, 0.2, 0.2, 1 );
    gl.viewport(0, 0, g_canvas.width, g_canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    let viewMat = mat4.create();
    let cameraPos = g_cameraController.getCameraPosition();
    mat4.lookAt( cameraPos, [ 0, 0, 0 ], [ 0, 1, 0 ], viewMat );
    
    let projMat = mat4.create();
    let fovy = 40;
    let near = 0.05;
    let far  = 500;
    mat4.perspective(fovy, g_canvas.width / g_canvas.height, near, far, projMat);

    for( let i in g_glObjects )
    {
        g_glObjects[i].setView(viewMat);
        g_glObjects[i].setProjection(projMat);        
        g_glObjects[i].draw();
    }

    setTimeout(mainLoop, 15);
}
