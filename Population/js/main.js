
////////////////////////////////////////////////////////////////////
//
// Population
// http://127.0.0.1:8887/shapefile/population/index.html
//

let g_webGLView;
let g_time = 0;
let g_info;
let g_loadView;

let g_mapFileName = "data/japank.json";
let g_dataFileNameList = [
    "data/Mesh3_POP_00_0_9999.json",
    "data/Mesh3_POP_00_10000_19999.json",
    "data/Mesh3_POP_00_20000_29999.json",
    "data/Mesh3_POP_00_30000_39999.json",
    "data/Mesh3_POP_00_40000_49999.json",
    "data/Mesh3_POP_00_50000_59999.json",    
    "data/Mesh3_POP_00_60000_69999.json",
    "data/Mesh3_POP_00_70000_79999.json",
    "data/Mesh3_POP_00_80000_89999.json",
    "data/Mesh3_POP_00_90000_99999.json",
    "data/Mesh3_POP_00_100000_109999.json",
    "data/Mesh3_POP_00_110000_119999.json",
    "data/Mesh3_POP_00_120000_129999.json",
    "data/Mesh3_POP_00_130000_139999.json",
    "data/Mesh3_POP_00_140000_149999.json",
    "data/Mesh3_POP_00_150000_159999.json",    
    "data/Mesh3_POP_00_160000_169999.json",
    "data/Mesh3_POP_00_170000_179999.json",
    "data/Mesh3_POP_00_180000_180219.json"
]

function appStart()
{
    g_webGLView = new webGLCanvas("glCanvasArea");
    g_webGLView.setProjection(60, 0.01, 500);
    g_webGLView.targetPosX = 135;
    g_webGLView.targetPosY = 0;
    g_webGLView.targetPosZ = -35;
    g_webGLView.cameraPosR = 10;   
    g_webGLView.zoomStep = 0.02;
    g_webGLView.moveStep = 20 / 500;

    g_info = new AttributeInformation()
    g_loadView = new LoadingView();

    createGLShaderProgram();
    createGLObjects();
    setUpEvent();
    mainLoop();
}

function createGLShaderProgram()
{
    g_webGLView.createShaderProgram( "objectMap", "vertexShaderObjectMap", "fragmentShaderObjectMap" );
    g_webGLView.createShaderProgram( "singleColor", "vertexShaderSingleColor", "fragmentShaderSingleColor" );

    g_webGLView.createShaderProgram( "objectMapBarGraph", "vertexShaderBarGraphObjectMap", "fragmentShaderBarGraphObjectMap" );
    g_webGLView.createShaderProgram( "barGraph", "vertexShaderBarGraph", "fragmentShaderBarGraph" );
}

function createGLObjects()
{
    requestJsonData( g_mapFileName, function(data){
        let glObjMap = new glObjectShapeJson_Line(g_webGLView);
        glObjMap.setJsonData(data);
        glObjMap.attachShader("singleColor");
        glObjMap.setColor(0.9, 0.9, 0.9, 1.0);
        glObjMap.setVisible( true );    
        g_webGLView.addGLObject("Map", glObjMap);
        loadPopData(0);
    })
}

function loadPopData(i)
{
    requestJsonData( g_dataFileNameList[i], function(data){
        console.log(data);
        let glObjData = new glObjectJsonData_PopBarGraph(g_webGLView);
        glObjData.setJsonData(data);
        glObjData.attachShader("barGraph");
        glObjData.setWidth(0.01);   
        glObjData.setVisible(true);    
        g_webGLView.addGLObject(g_dataFileNameList[i], glObjData);
        if( ( i + 1 ) < g_dataFileNameList.length ){
            g_loadView.setProgressRate( (i + 1) / g_dataFileNameList.length * 100 );
            loadPopData( i + 1 );
        }else{
            g_loadView.show(false);
        }
    })
}

function requestJsonData( fileName, callback )
{
    let request = new window.XMLHttpRequest();
    request.open("GET", fileName, true);
    request.onreadystatechange = function(){
        if( request.readyState == 4 ){
            let data = JSON.parse( request.responseText );
            if( callback ) callback( data );
        }
    }
    request.send(null);      
}

function setUpEvent()
{

    g_webGLView.mouseDownCallback = function( x, y, name, id1, id2, flag ){

        return false;        
    }

    g_webGLView.mouseMoveCallback = function( x, y ){
    }

    g_webGLView.mouseWheelCallback = function( delta ){
        return false;
    }

    let canvasArea = document.getElementById("glCanvasArea");
    function resizeEvent(event){
        g_webGLView.resize();        
    };
    window.addEventListener("resize", resizeEvent.bind(this) );
    resizeEvent();
}

function mainLoop()
{
    g_webGLView.draw(g_time);
    g_time += 15;
    setTimeout(mainLoop, 15);
}


///////////////////////////////////////////////////////////////
// gui
///////////////////////////////////////////////////////////////

let AttributeInformation = function(){
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.left = "20px";
    this.dom.style.top = "20px";
    this.dom.style.color = "#fff"
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    document.body.appendChild( this.dom );
}

AttributeInformation.prototype.setAttribData = function( data ){
    this.clearData()

    for( let key in data )
    {
        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexDirection = "row";     
        row.style.justifyContent = "space-between";

        let label = document.createElement("div");
        label.textContent = key;
        label.style.width = "120px";
        let value = document.createElement("div");
        value.textContent = data[key];
        
        row.appendChild( label );
        row.appendChild( value );
        this.dom.appendChild( row );
    }
}

AttributeInformation.prototype.clearData = function(){
    while( this.dom.lastChild ){
        this.dom.removeChild( this.dom.lastChild );
    }
}


///////////////////////////////////////////////////////////////
// util
///////////////////////////////////////////////////////////////

function distance( p1, p2 ){
    let diffX = p2[0] - p1[0];
    let diffY = p2[1] - p1[1];
    return Math.sqrt( diffX * diffX + diffY * diffY );
}

function hsvToRgb(H,S,V) {
    //https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

    var C = V * S;
    var Hp = H / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {[R,G,B]=[C,X,0]};
    if (1 <= Hp && Hp < 2) {[R,G,B]=[X,C,0]};
    if (2 <= Hp && Hp < 3) {[R,G,B]=[0,C,X]};
    if (3 <= Hp && Hp < 4) {[R,G,B]=[0,X,C]};
    if (4 <= Hp && Hp < 5) {[R,G,B]=[X,0,C]};
    if (5 <= Hp && Hp < 6) {[R,G,B]=[C,0,X]};

    var m = V - C;
    [R, G, B] = [R+m, G+m, B+m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return [R ,G, B];
}