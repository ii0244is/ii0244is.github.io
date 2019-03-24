
////////////////////////////////////////////////////////////////////
//
// WorldHistory
// http://127.0.0.1:8887/shapefile/Imperialism/index.html
//

let g_webGLView;
let g_time = 0;
let g_mapFileName = "data/ne_50m_admin_0_countries.json";
let g_dataFileName = [
    // "data/AD1492.json", 
    // "data/AD1530.json",
    // "data/AD1650.json",
    // "data/AD1715.json",
    // "data/AD1783.json",   
    "data/AD1880.json", 
    "data/AD1914.json",
    "data/AD1920.json",
    "data/AD1938.json",
    "data/AD1945.json",                     
];
let g_timeList = [
    // "AD 1492",    
    // "AD 1530", 
    // "AD 1650",       
    // "AD 1715",     
    // "AD 1783",   
    "AD 1880",    
    "AD 1914", 
    "AD 1920",       
    "AD 1938",     
    "AD 1945",         
]
let g_dataList = [];
let g_selectedTimeIndex = 0;
let g_selectedObject = null;
let g_timeSelector;
let g_countryList;
let g_info;
let g_cameraWork;

function appStart()
{
    g_webGLView = new webGLCanvas("glCanvasArea");
    g_webGLView.setProjection(60, 0.01, 500);
    g_webGLView.targetPosX = 0;
    g_webGLView.targetPosY = 0;
    g_webGLView.targetPosZ = 0;
    g_webGLView.cameraPosR = 100;   
    g_webGLView.zoomStep = g_webGLView.cameraPosR * 0.01;
    g_webGLView.moveStep = g_webGLView.cameraPosR / 700;

    g_info = new CountryInfoArea();
    g_info.show(false);    
    g_countryList = new CountryListArea();
    g_countryList.show(false);
    g_timeSelector = new TimeSelector( document.body );
    g_timeSelector.setPosition( "LeftBottom", "20px", "20px" );
    g_timeSelector.setItems(g_timeList);
    g_loadView = new LoadingView();  
    g_cameraWork = new cameraWorkManager();

    createGLShaderProgram();
    createGLObjects();
    setUpEvent();
    mainLoop();
}

function createGLShaderProgram()
{
    g_webGLView.createShaderProgram( "objectMap", "vertexShaderObjectMap", "fragmentShaderObjectMap" );
    g_webGLView.createShaderProgram( "singleColor", "vertexShaderSingleColor", "fragmentShaderSingleColor" );
}

function createGLObjects()
{
    requestJsonData( g_mapFileName, function(data){
        let glObjMap = new glObjectShapeJson_Line(g_webGLView);
        glObjMap.setJsonData(data);
        glObjMap.attachShader("singleColor");
        glObjMap.setColor(0.6, 0.6, 0.6, 1.0);
        glObjMap.setWidth(0.1);
        glObjMap.setVisible( true );    
        g_webGLView.addGLObject("Map", glObjMap);
        loadDataFile(0)        
    } )
}

function loadDataFile(fileIndex)
{
    requestJsonData( g_dataFileName[fileIndex], function(data){
        
        let recoards = data;
        let propertyInfoList = {};
        
        for( let i in recoards ){
            let att = recoards[i].Attribute;
            if( !att.show ) continue;

            let pos = recoards[i].Position;
            let shape = []
            for( let j in pos ){
                let part = [];
                for( let k in pos[j]){
                    let v = [];
                    v[0] = pos[j][k][0];
                    v[1] = -pos[j][k][1];
                    part.push(v);
                }  
                let triangles = generatePolygon(part);
                shape.push(triangles)
            }
            let polygon = new glObjectPolygon(g_webGLView); 
            let vertexPos = [];
            for( let j = 0; j < shape.length; ++j){
                let triangles = shape[j];
                for( let k = 0; k < triangles.length; ++k ){
                    let v1 = [ triangles[k][0][0], 0.0, triangles[k][0][1] ];
                    let v2 = [ triangles[k][1][0], 0.0, triangles[k][1][1] ];
                    let v3 = [ triangles[k][2][0], 0.0, triangles[k][2][1] ];
                    vertexPos.push( v1 );
                    vertexPos.push( v2 );
                    vertexPos.push( v3 );            
                }
            }

            let col = hec2rgb( att.color );
            let colorR = col[0];
            let colorG = col[1];
            let colorB = col[2];
            let show = att.show;

            polygon.setColor( colorR, colorG, colorB, 1.0 )          
            polygon.setVertices( vertexPos );            
            polygon.attachShader("singleColor");
            polygon.setSelect( false );
            polygon.setVisible( false );

            let name = fileIndex + "_" + i + "_" + att.name;
            att.position = vertexPos[0];
            g_webGLView.addGLObject( name, polygon );        
            propertyInfoList[ name ] = att;     
            // polygonList.push( { "name" : name, "attribute" : att } );

            if( Math.floor( recoards.length / 2 ) == Number(i) ){
                g_loadView.setProgressRate( (fileIndex + 0.5) / g_dataFileName.length * 100 );
            }            
        }   

        g_dataList.push( propertyInfoList )
        g_loadView.setProgressRate( (fileIndex + 1) / g_dataFileName.length * 100 );
        
        if( ( fileIndex + 1 ) < g_dataFileName.length ){
            loadDataFile( fileIndex + 1 );
        }else{
            g_loadView.show(false);
            selectTime( 0 )
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
    g_webGLView.mouseDownCallback = function( x, y, name, flag ){
        console.log( name );

        if( name == null ) {
            // g_countryList.show( true ); 
            // g_info.show( false );
            // if( g_selectedObject ){
            //     g_webGLView.getGLObject(g_selectedObject).setSelect(false);  
            // }            
        }else{
            selectCountry( name );
        }

        return false;        
    }

    g_webGLView.mouseMoveCallback = function( x, y ){
    }

    g_webGLView.mouseWheelCallback = function( delta ){
        return false;
    }

    g_timeSelector.onchange = function( i ){
        if( g_selectedObject ){
            g_webGLView.getGLObject(g_selectedObject).setSelect(false);  
        }        
        selectTime( i );
    }

    g_timeSelector.onclick = function( i ){
        g_countryList.show( true );
        g_info.show( false );
    }

    g_countryList.onclick = function( pos, objName ){
        g_cameraWork.startTransition( pos[0], pos[2], 500, 30 );
        selectCountry( objName );
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
    g_cameraWork.updateCameraPosition();
    g_webGLView.draw(g_time);
    g_time += 15;
    setTimeout(mainLoop, 15);
}

function selectCountry( name )
{
    if( g_selectedObject ){
        g_webGLView.getGLObject(g_selectedObject).setSelect(false);  
    }

    let info = g_dataList[g_selectedTimeIndex][name];
    if( info ){
        g_info.setName( info.name );
        g_info.show(true);
    }else{
        g_info.show(false);
    }

    g_webGLView.getGLObject(name).setSelect(true);
    g_selectedObject = name;
    g_countryList.show( true );
}    

function selectTime( index ){

    let lastIndex = g_selectedTimeIndex;
    for( let name in g_dataList[lastIndex] ){
        g_webGLView.getGLObject(name).setVisible(false);
    }

    let countryList = [];
    for( let name in g_dataList[index] ){
        g_webGLView.getGLObject(name).setVisible(true);
        let countryInfo = { 
            "name":g_dataList[index][name].name,
            "objName":name,            
            "position":g_dataList[index][name].position,
        };
        countryList.push(countryInfo);
    }

    g_selectedTimeIndex = index;    
    g_countryList.setCountryList( countryList );
    g_countryList.show(true);
}


///////////////////////////////////////////////////////////////
// gui
///////////////////////////////////////////////////////////////

let AttributeInformation = function(){
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.color = "#fff"
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    document.body.appendChild( this.dom );
}

AttributeInformation.prototype.setPosition = function( align, x, y ){
    if( align == "LeftTop" ){
        this.dom.style.left = x;
        this.dom.style.top = y;
    }else if( align == "RightTop" ){
        this.dom.style.right = x;
        this.dom.style.top = y;
    }else if( align == "LeftBottom" ){
        this.dom.style.left = x;
        this.dom.style.bottom = y;
    }else if( align == "RightBottom" ){
        this.dom.style.right = x;
        this.dom.style.bottom = y;
    }
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
        label.style.width = "180px";
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

function rgb2hex ( rgb ) {
	return "#" + rgb.map( function ( value ) {
		return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
	} ).join( "" ) ;
}

function hec2rgb ( hex ) {
    var code  = hex;
    var red   = parseInt(code.substring(1,3), 16) / 255;
    var green = parseInt(code.substring(3,5), 16) / 255;
    var blue  = parseInt(code.substring(5,7), 16) / 255; 
    return [ red, green, blue ];
}