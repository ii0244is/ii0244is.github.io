
////////////////////////////////////////////////////////////////////
//
// Airplane
// http://127.0.0.1:8887/shapefile/airplane/index.html
//

let g_webGLView;
let g_time = 0;

function calcWidth(){
    return g_webGLView.cameraPosR * 0.008;
}

let g_mapFileName = "data/japank.json";
let g_airplaneDataFileName = "data/S10b-14_BetAport.json";
let g_departureList = {};
let g_attribList = {};
let g_selector;
let g_info;

function appStart()
{
    g_webGLView = new webGLCanvas("glCanvasArea");
    g_webGLView.setProjection(60, 0.01, 500);
    g_webGLView.targetPosX = 135;
    g_webGLView.targetPosY = 0;
    g_webGLView.targetPosZ = -35;
    g_webGLView.cameraPosR = 20;   
    g_webGLView.zoomStep = 0.02;
    g_webGLView.moveStep = 20 / 500;

    g_selector = new DataSelector();
    g_selector.setPosition("LeftTop", "20px", "20px");

    g_info = new AttributeInformation();
    g_info.setPosition("RightBottom", "20px", "20px");    

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
        glObjMap.setColor(0.9, 0.9, 0.9, 1.0);
        glObjMap.setWidth(0.1);
        glObjMap.setVisible( true );    
        g_webGLView.addGLObject("Map", glObjMap);
        loadAirplaneData(0);
    })
}

function loadAirplaneData(i)
{
    requestJsonData( g_airplaneDataFileName, function(data){

        console.log( data );
        let recoards = data.Records
        for( let i in recoards ){

            if( g_departureList[ recoards[i].Attribute.S10b_001 ] ){
                g_departureList[ recoards[i].Attribute.S10b_001 ].push( i );
            }else{
                g_departureList[ recoards[i].Attribute.S10b_001 ] = [];
                g_departureList[ recoards[i].Attribute.S10b_001 ].push( i );
            }

            let start = recoards[i].Position[0][0];
            let stop = recoards[i].Position[0][1];
            let glObjArc = new glObjectArc(g_webGLView);
            glObjArc.attachShader("singleColor");
            glObjArc.setPosition( [start[0],-start[1]], [stop[0],-stop[1]] );
            glObjArc.setVisible( false ); 
            let d = distance( [start[0],-start[1]], [stop[0],-stop[1]] );            
            glObjArc.setHeight( d * 0.5 );
            glObjArc.setWidth( 0.1 );
            // let v = Number( recoards[i].Attribute.S10b_007 );            
            // v /= 1000; 
            // v = Math.max( 0, v );            
            // v = Math.min( 240, v );
            // let c = hsvToRgb( 240 - v, 1, 1 );
            // glObjArc.setColor( c[0]/255, c[1]/255, c[2]/255, 1.0);
            glObjArc.setColor( 1.0, 0.1, 0.1, 1.0);
            let name = "arc" + i;
            g_webGLView.addGLObject( name, glObjArc );
            g_attribList[ name ] = recoards[i].Attribute;
        }

        let select = document.createElement("select");
        select.style.borderRadius = "10px";        
        select.style.height = "36px";      
        select.style.padding = "5px 8px 5px 8px";        
        select.style.backgroundColor = "Black";        
        select.style.color = "White";
        for( let key in g_departureList ){
            let opt = document.createElement("option");
            opt.value = key;
            opt.textContent = key;            
            select.appendChild(opt);
        }
        select.onchange = function(){
            for( let i in recoards ){
                let o = g_webGLView.getGLObject( "arc" + i );
                o.setVisible( false ); 
            }

            let val = select.value;
            for( let i in g_departureList[val] ){
                let o = g_webGLView.getGLObject( "arc" + g_departureList[val][i] );
                o.setVisible( true ); 
            }

            let attribData = {};
            for( let i in g_departureList[val] ){
                let name = "arc" + g_departureList[val][i];
                let destination = g_attribList[ name ].S10b_004;
                let numPassengers = g_attribList[ name ].S10b_007;                
                attribData[ destination ] = numPassengers;
            }
            g_selector.setAttribData( attribData );            
        }
        g_selector.selector.appendChild(select);

        for( let i in g_departureList["東京"] ){
            let o = g_webGLView.getGLObject( "arc" + g_departureList["東京"][i] );
            o.setVisible( true ); 

            let attribData = {};
            for( let i in g_departureList["東京"] ){
                let name = "arc" + g_departureList["東京"][i];
                let destination = g_attribList[ name ].S10b_004;
                let numPassengers = g_attribList[ name ].S10b_007;                
                attribData[ destination ] = numPassengers;
            }                  
            g_selector.setAttribData( attribData );             
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
    let selectedObject = "";

    g_webGLView.mouseDownCallback = function( x, y, name, flag ){

        if( name != null ){
            let o = g_webGLView.getGLObject( name );
            o.setColor( 1.0, 0.5, 0.5, 1.0 );
            o.setSelect( true );
            if( selectedObject != "" ){
                let lo = g_webGLView.getGLObject( selectedObject );
                lo.setColor( 1.0, 0.1, 0.1, 1.0 );
                lo.setSelect( false );   
            }            
            selectedObject = name;

            let info = {};
            let move = g_attribList[ name ].S10b_001 + " - "+ g_attribList[ name ].S10b_004;
            info[move] = "";
            info["距離[km]"] = g_attribList[ name ].S10b_005;     
            info["運行本数[本/週]"] = g_attribList[ name ].S10b_006;
            info["旅客数[人/年]"] = g_attribList[ name ].S10b_007;  
            g_info.setAttribData(info);
        }

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


let DataSelector = function(){
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.color = "#fff"
    this.dom.style.display = "flex";
    this.dom.style.padding = "20px 20px 10px 20px";
    this.dom.style.borderRadius = "10px";
    this.dom.style.backgroundColor = "#222";
    this.dom.style.opacity = "0.8";
    this.dom.style.flexDirection = "column";

    this.selector = document.createElement("div");
    this.info = document.createElement("div");
    this.info.style.margin = "15px 0px 10px 0px";
    //this.info.style.padding = "10px 0px 10px 0px";
    this.info.style.maxHeight = "500px";
    this.info.style.overflowY = "scroll";  
    this.dom.appendChild(this.selector);
    this.dom.appendChild(this.info);
    document.body.appendChild( this.dom );
}

DataSelector.prototype.setPosition = function( align, x, y ){
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

DataSelector.prototype.setAttribData = function( data ){
    this.clearData()

    for( let key in data )
    {
        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexDirection = "row";     
        row.style.justifyContent = "space-between";

        let label = document.createElement("div");
        label.textContent = key;
        label.style.width = "150px";
        let value = document.createElement("div");
        value.textContent = data[key];
        
        row.appendChild( label );
        row.appendChild( value );
        this.info.appendChild( row );
    }
}

DataSelector.prototype.clearData = function(){
    while( this.info.lastChild ){
        this.info.removeChild( this.info.lastChild );
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