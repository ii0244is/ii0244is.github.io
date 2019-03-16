
////////////////////////////////////////////////////////////////////
//
// Railroad
// http://127.0.0.1:8887/shapefile/railroad/index.html
//

let g_webGLView;
let g_time = 0;
let g_timeSlider = 0;
let g_loadView;

function calcWidth(){
    if( g_webGLView.cameraPosR > 0.1 ){
        return 0.001 + ( g_webGLView.cameraPosR - 0.1 ) * 0.005;  
    }
    return g_webGLView.cameraPosR * 0.01;    
}

let g_mapFileName = "data/japank.json";
let g_stationFileName = "data/S12-17_NumberOfPassengers.json";
let g_railFileNameList = [
    "data/N05-17_RailroadSection2_0_199.json",
    "data/N05-17_RailroadSection2_200_399.json",  
    "data/N05-17_RailroadSection2_400_599.json",
    "data/N05-17_RailroadSection2_600_799.json",   
    "data/N05-17_RailroadSection2_800_999.json",
    "data/N05-17_RailroadSection2_1000_1199.json",
    "data/N05-17_RailroadSection2_1200_1399.json",  
    "data/N05-17_RailroadSection2_1400_1599.json",
    "data/N05-17_RailroadSection2_1600_1799.json",   
    "data/N05-17_RailroadSection2_1800_1999.json",
    "data/N05-17_RailroadSection2_2000_2199.json",
    "data/N05-17_RailroadSection2_2200_2399.json",  
    "data/N05-17_RailroadSection2_2400_2548.json", 
]
let g_info;

function appStart()
{
    g_webGLView = new webGLCanvas("glCanvasArea");
    g_webGLView.setProjection(60, 0.005, 500);
    g_webGLView.targetPosX = 135;
    g_webGLView.targetPosY = 0;
    g_webGLView.targetPosZ = -35;
    g_webGLView.cameraPosR = 20;
    g_webGLView.moveStep = 20 / 500;

    g_info = new AttributeInformation()
    g_timeSlider = new TimeSlider(document.body)
    g_timeSlider.setSliderPosition( "LeftBottom", "0px", "20px" );
    g_timeSlider.setTextPosition( "RightBottom", "30px", "130px" );
    g_timeSlider.setTextSize( "96px" );
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

    g_webGLView.createShaderProgram( "objectMapLine", "vertexShaderLineObjectMap", "fragmentShaderLineObjectMap" );
    g_webGLView.createShaderProgram( "polyLine", "vertexShaderPolyLine", "fragmentShaderPolyLine" );
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
        loadRailData(0);
    })
}

function loadRailData(i)
{
    requestJsonData( g_railFileNameList[i], function(data){

        let glObjRail = new glObjectJsonData_Railroad(g_webGLView);
        glObjRail.setJsonData(data);
        glObjRail.attachShader("polyLine");
        glObjRail.setWidth( calcWidth() );
        glObjRail.setVisible( true );   
        glObjRail.setTime( g_timeSlider.getCurrentDate().year );
        g_webGLView.addGLObject(g_railFileNameList[i], glObjRail);
        g_loadView.setProgressRate( (i + 1) / g_railFileNameList.length * 100 );
        if( ( i + 1 ) < g_railFileNameList.length ){
            loadRailData( i + 1 );
        }else{
            g_loadView.show(false);
            // loadStationData()
        }
    })
}

function loadStationData(i)
{
    requestJsonData( g_stationFileName, function(data){
        let glObjStation = new glObjectJsonData_Railroad(g_webGLView);
        glObjStation.setJsonData(data, 0.001);
        glObjStation.attachShader("polyLine");
        glObjStation.setWidth( calcWidth() * 3.0 );
        glObjStation.setVisible( true );    
        g_webGLView.addGLObject(g_stationFileName, glObjStation);
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
    function selcectOff(){
        for( let i in g_railFileNameList ){
            let o = g_webGLView.getGLObject( g_railFileNameList[i] );
            o.setSelect(false, 0, 0);
        }
        // let o = g_webGLView.getGLObject( g_stationFileName );
        // o.setSelect(false, 0, 0); 
        g_info.clearData();
    }

    g_webGLView.mouseDownCallback = function( x, y, name, id1, id2, flag ){

        let index = g_railFileNameList.indexOf( name, 0 );
        
        if( index >= 0 ){
            selcectOff();
            let obj = g_webGLView.getGLObject( name );
            obj.setSelect(true, id1, id2)

            let attribData = obj.getAttributeData(id1, id2);
            let list = {}
            list[ "路線名" ] = attribData.N05_002;
            list[ "運営会社" ] = attribData.N05_003;
            let end = attribData.N05_005e;
            if( attribData.N05_005e == "9999" ) end = "";
            list[ "設置期間" ] = attribData.N05_004 + " - " + end;
            g_info.setAttribData(list);
        }

        // if( g_stationFileName == name ){
        //     selcectOff();            
        //     let obj = g_webGLView.getGLObject( g_stationFileName );
        //     obj.setSelect(true, id1, id2);  
        //     g_info.setAttribData(obj.getAttributeData(id1, id2));          
        // }

        return false;        
    }

    g_webGLView.mouseMoveCallback = function( x, y ){
    }

    g_webGLView.mouseWheelCallback = function( delta ){

        for( let i in g_railFileNameList ){
            let o = g_webGLView.getGLObject( g_railFileNameList[i] );
            o.setWidth( calcWidth() );
        }        

        // let station = g_webGLView.getGLObject( g_stationFileName );
        // station.setWidth( calcWidth() * 3 );

        return false;
    }

    let canvasArea = document.getElementById("glCanvasArea");
    function resizeEvent(event){
        let width = document.body.clientWidth;
        let height = 120;   
        g_timeSlider.setSliderSize( width, height );  

        g_webGLView.resize();        
    };
    window.addEventListener("resize", resizeEvent.bind(this) );

    g_timeSlider.onchange = function( currentTime ){
        // console.log( currentTime );
        selcectOff();
        for( let i in g_railFileNameList ){
            let o = g_webGLView.getGLObject( g_railFileNameList[i] );
            o.setTime( currentTime.year );
        }
    }.bind(this);

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
