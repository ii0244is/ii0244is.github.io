

// Too many global variables... ( for easy and fast implementation )
// This is not good.

let g_webGLView;
let g_settingArea;
let g_newDataArea;
let g_timeFilter;
let g_informationBar;

let g_newDataManager;
let g_cameraWork;
let g_timeTraveler;
let g_pointIcon;
let g_keywordFilter;
let g_vertexEditor;

let g_dataList = {};
let g_isViewerMode = false;
let g_time = 0;
let g_selectedObjectName = null;

let WorldLandFileName = "mapData/ne_50m_land.json";
let WorldCountriesFileName = "mapData/ne_50m_admin_0_countries.json";

function appStart()
{
    if( location.hash ){
        g_isViewerMode = true;
    }

    g_webGLView = new WebGLCanvas();
    createGLShaderProgram();
    createFunctions();
    createGui();
    createMap();
    setUpEvent();
    mainLoop();
}

function createGui()
{
    g_newDataArea = new NewDataArea();
    g_settingArea = new SettingArea();
    g_timeFilter = new TimeFilter();
    g_informationBar = new InformationBar();
    g_timeFilter.setSize( 300, 80 );
    g_timeFilter.setPosition( 90, 20 );
    g_informationBar.setPosition( 500, 20 );

    let mainArea    = document.getElementById("MainArea");
    let webGLCanvas = document.getElementById("WebGLCanvas");
    let newDataArea = document.getElementById("NewDataArea");
    let settingArea = document.getElementById("SettingArea");
    if( g_isViewerMode ){
        webGLCanvas.style.width = "calc( 100% - 480px )";
        newDataArea.style.display = "none";
        g_timeFilter.setPosition( 20, 20 );
    }
    webGLCanvas.appendChild( g_webGLView.getDom() );
    newDataArea.appendChild( g_newDataArea.getDom() );
    settingArea.appendChild( g_settingArea.getDom() );
    mainArea.appendChild( g_timeFilter.getDom() );

    g_settingArea.setDefaultParam( "BarGraph", {
        name   : "BarGraph", 
        height : 10.0, 
        size   : 1.0, 
        color  : [0.8, 0.2, 0.2],         
    });

    g_settingArea.setDefaultParam( "Arc", {
        name   : "Arc",       
        size   : 1,
        height : 20,
        color  : [0.8, 0.2, 0.2],     
    });    

    g_settingArea.setDefaultParam( "Point", {
        name : "Point",       
        size : 2.5,
        icon : "pointerRed",  
    });  

    g_settingArea.setDefaultParam( "Line", {
        name      : "Line",       
        width     : 0.5,
        showArrow : false,
        color     : [0.8, 0.2, 0.2],
    });  
    
    g_settingArea.setDefaultParam( "Polygon", {
        name      : "Polygon",       
        color     : [0.8, 0.2, 0.2],
    });      
}

function createGLShaderProgram()
{
    g_webGLView.createShaderProgram( "objectMap", "vertexShaderObjectMap", "fragmentShaderObjectMap" );
    g_webGLView.createShaderProgram( "lineObjectMap", "vertexShaderLineObjectMap", "fragmentShaderLineObjectMap" );        
    g_webGLView.createShaderProgram( "grid", "vertexShaderGrid", "fragmentShaderGrid" );
    g_webGLView.createShaderProgram( "singleColor", "vertexShaderSingleColor", "fragmentShaderSingleColor" );
    g_webGLView.createShaderProgram( "lighting", "vertexShaderLighting", "fragmentShaderLighting" );
    g_webGLView.createShaderProgram( "arc", "vertexShaderArc", "fragmentShaderArc" );
    g_webGLView.createShaderProgram( "line", "vertexShaderLine", "fragmentShaderLine" );        
    g_webGLView.createShaderProgram( "polygon", "vertexShaderPolygon", "fragmentShaderPolygon" );    
    g_webGLView.createShaderProgram( "image", "vertexShaderImage", "fragmentShaderImage" );
    g_webGLView.createShaderProgram( "imageBg", "vertexShaderBgImage", "fragmentShaderBgImage" );
    g_webGLView.createShaderProgram( "image2D", "vertexShader2DImage", "fragmentShader2DImage" );
}

function createFunctions()
{
    g_newDataManager = new NewDataManager();
    g_cameraWork = new CameraWorkManager();
    g_pointIcon = new PointIconManager();
    g_timeTraveler = new TimeTraveler();
    g_vertexEditor = new VertexEditor();
}

function createMap()
{
    let bgImage = new glObjectBgImage(g_webGLView);
    bgImage.attachShader("imageBg");
    bgImage.setImage(g_webGLView.context, "image/bgImage.png", function(){});
    g_webGLView.addGLObject("bgImage", bgImage);

    requestJsonData( WorldLandFileName, function( data ){
        let glObjLand = new glObjectShapeJson(g_webGLView);
        glObjLand.setJsonData(data, 0.002);
        glObjLand.attachShader("singleColor");
        glObjLand.setColor(0.4, 0.4, 0.4, 1.0);
        glObjLand.setVisible( true );    
        g_webGLView.addGLObject("worldMap", glObjLand);    
        requestJsonData( WorldCountriesFileName, function( data ){
            let glObjBorder = new glObjectShapeJson(g_webGLView);
            glObjBorder.setJsonData(data, 0.001);
            glObjBorder.attachShader("singleColor");
            glObjBorder.setColor(0.6, 0.6, 0.6, 1.0);
            glObjBorder.setVisible( true );    
            g_webGLView.addGLObject("worldBorder", glObjBorder);  
        });
    })   
}

function setUpEvent()
{
    function resizeEvent (){
        g_webGLView.resize();
        g_settingArea.resize();
        g_timeFilter.resize();
    }    
    window.addEventListener("resize", resizeEvent );

    let shiftKeyDown = false;
    document.addEventListener("keydown", function(e){
        shiftKeyDown = e.shiftKey;
    }.bind(this));

    document.addEventListener("keyup", function(e){
        shiftKeyDown = e.shiftKey;
    }.bind(this)); 

    g_webGLView.setMouseDownCallback( function( x, y, name, isTouch, buttonType )
    {
        if( shiftKeyDown ) return false;
        if( g_newDataManager.mousedown( x, y, isTouch, buttonType ) ) return true;
        if( g_vertexEditor.mousedown( x, y, name ) ) return true;
        selectObject( name );
    } );

    g_webGLView.setMouseMoveCallback( function( x, y )
    {
        if( shiftKeyDown ) return false;
        if( g_newDataManager.mousemove( x, y, false, null ) ) return true;
        if( g_vertexEditor.mousemove( x, y ) ) return true;
    } );

    g_webGLView.setMouseUpCallback( function ()
    {
        if( g_vertexEditor.mouseup() ) return true;
    } );

    g_webGLView.setMouseWheelCallback( function( x, y ){
        g_newDataManager.mousewheel();
        g_vertexEditor.mousewheel();
    } );

    resizeEvent();
}

function mainLoop()
{
    for( var data in g_dataList )
    {
        let currentTime  = g_timeFilter.getCurrentDate();
        let dataStart    = g_dataList[data].startTime;
        let dataEnd      = g_dataList[data].endTime;
        let isDataInTime = checkTime( currentTime, dataStart, dataEnd );
        g_webGLView.getGLObject( data ).setVisible( isDataInTime );
    }

    g_cameraWork.updateCameraPosition();

    g_timeTraveler.updateTime();    

    g_webGLView.draw(g_time);
    
    g_time += 15;
    setTimeout(mainLoop, 15);
}