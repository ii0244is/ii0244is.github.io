
// Too many grobal variables... ( for easy and fast implementation )
// This is not good.
let g_webGLView;
let g_paramSet;
let g_timeline;
let g_dataResistration;
let g_popup;
let g_headerArea;
let g_timeSlider;
let g_guideArea;
let g_keywordFilter;
let g_cameraWork;
let g_timeManager;
let g_isViewerMode = true;

let g_dataList = {};
let g_time = 0;
let g_selectedObjectName = null;

//let WorldLandFileName = "mapData/ne_110m_land.json";
//let WorldCountriesFileName = "mapData/ne_110m_admin_0_countries.json";
let WorldLandFileName = "mapData/ne_50m_land.json";
let WorldCountriesFileName = "mapData/ne_50m_admin_0_countries.json";

function appStart()
{
    let mainArea = document.getElementById( "mainArea" );    
    let fileSelect = document.getElementById( "fileSelect" );

    if( location.hash )
    {
        fileSelect.style.display = "none";

        let fileName = "projects/" + location.hash.slice(1) + ".json";
        let request = new window.XMLHttpRequest();
        request.open("GET", fileName, true);
        request.onreadystatechange = function(){
            if( request.readyState == 4 )
            {
                let projectData = JSON.parse( request.responseText );
                // console.log(projectData);
                startViewer(projectData);                
            }
        }
        request.send(null);
    }
    else
    {
        mainArea.style.display = "none";

        let projectFileInputArea = document.createElement( "div" );        
        let projectFileInputText = document.createElement( "div" );                
        projectFileInputText.textContent = "Select your project file."    
        projectFileInputText.style.fontSize = "42px";  
        projectFileInputText.style.padding = "0px 0px 18px 0px";       
        let projectFileInput = document.createElement( "input" );
        projectFileInput.type = "file";
        projectFileInput.style.padding = "0px 0px 18px 0px";
        projectFileInput.onchange = function(event){
            if ( !event.target.files[0] ) return;
            let reader = new FileReader();    
            reader.readAsText(event.target.files[0]);
            reader.onload = function (e)
            {
                let projectData = JSON.parse( reader.result );
                console.log(projectData);
                startViewer(projectData);
            }
            fileSelect.style.display = "none";    
            mainArea.style.display = "block";
        }

        projectFileInputArea.appendChild(projectFileInputText);
        projectFileInputArea.appendChild(projectFileInput);        
        fileSelect.appendChild(projectFileInputArea);
        document.body.appendChild(fileSelect);
    }
}

function startViewer(projectData)
{
    // create webGL view
    g_webGLView = new webGLCanvas("glCanvasArea");

    // create all resources
    createGLShaderProgram();
    createGLObjects();
    
    // function
    g_keywordFilter = new keywordFilterManager();
    g_cameraWork = new cameraWorkManager();
    g_timeManager = new timeManager();
    g_popup = new popupParamViewer();

    // create GUI dom
    g_timeSlider = new timeSliderArea();    
    g_headerArea = new headerArea();
    g_paramSet = new paramSettingArea("paramSettingArea");
    g_guideArea = new guideArea();

    // event
    setUpEvent();

    // load file
    loadProjectFile(projectData);

    // draw
    mainLoop();
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
    g_webGLView.createShaderProgram( "imageButton2D", "vertexShader2DImageButton", "fragmentShader2DImageButton" );
}

function createGLObjects()
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

function requestJsonData( fileName, callback )
{
    let request = new window.XMLHttpRequest();
    request.open("GET", fileName, true);
    request.onreadystatechange = function(){
        if( request.readyState == 4 )
        {
            let data = JSON.parse( request.responseText );
            // console.log(data);
            if( callback ) callback( data );
        }
    }
    request.send(null);   
}

function setUpEvent()
{
    let mainAreaDom = document.getElementById("mainArea");
    function resizeEvent(event)
    {
        let width = mainAreaDom.clientWidth;
        let height = mainAreaDom.clientHeight;
        if( width < 900 )  width = 900;
        if( height < 450 ) height = 450;

        let paramSettingAreaWidth  = width * 0.35;
        let glViewWidth = width * 0.65;
        let paramSettingAreaHeight = height - 80;            
        let glViewHeight = height - 80;
        if( paramSettingAreaWidth < 350 ) paramSettingAreaWidth = 350;
        else if( paramSettingAreaWidth > 540 )  paramSettingAreaWidth = 540;
        glViewWidth = width - paramSettingAreaWidth;

        g_paramSet.setSize( paramSettingAreaWidth, paramSettingAreaHeight );
        g_webGLView.setSize( glViewWidth, glViewHeight );

        let glViewRect = g_webGLView.getCanvasRect();
        let timeSliderPosX = glViewRect.right - ( g_timeSlider.getWidth() + 20 );
        let timeSliderPosY = glViewRect.bottom - ( g_timeSlider.getHeight() + 20 );        
        g_timeSlider.setPosition( timeSliderPosX, timeSliderPosY );

        let guideAreaPosX = glViewRect.right - ( g_guideArea.getWidth() + 20 );
        let guideAreaPosY = glViewRect.top + 20;
        g_guideArea.setPosition( guideAreaPosX, guideAreaPosY );        
    };
    window.addEventListener("resize", resizeEvent.bind(this) );

    g_webGLView.setMouseDownCallback( function( x, y, name, isTouch ){
        if( name )
        {
            if( g_dataList[name] )
            {
                let nextObject = g_webGLView.getGLObject(name);
                if( nextObject.setSelect )
                {
                    if( g_selectedObjectName )
                    {
                        let lastObject = g_webGLView.getGLObject(g_selectedObjectName);
                        lastObject.setSelect( false );
                    }                      
                    g_selectedObjectName = name;                    
                    nextObject.setSelect( true );
                    g_paramSet.setParamView( name );
                    g_popup.setParam( g_dataList[ name ] );
                    g_popup.show( x, y );
                }
            }
        }
        else
        {
            if( g_selectedObjectName && !g_popup.isShown )
            {
                let lastObject = g_webGLView.getGLObject(g_selectedObjectName);
                lastObject.setSelect( false );
                g_selectedObjectName = null;
            }  
            g_popup.hide();
        }   
        
        if( g_selectedObjectName == null )
        {
            g_headerArea.setMode("DataList");
        }        
    });
    
    g_webGLView.setMouseWheelCallback( function(){ 
        g_popup.hide();    
    });

    resizeEvent();
}

function loadProjectFile(projectData)
{
    let objDataList = projectData["dataList"]
    if( objDataList == null ) return;

    let barGraphDataCount = 0;
    let pointDataCount = 0;
    let arcDataCount = 0;
    let lineDataCount = 0;
    let polygonDataCount = 0;
    
    for( let i = 0; i < objDataList.length; ++i )
    {
        let objData = objDataList[i];
        let name = "";
        if( objData.type == "BarGraph" )
        {
            name = "BarGraph" + barGraphDataCount;
            let barGraph = new glObjectCube(g_webGLView)
            barGraph.attachShader("lighting");
            barGraph.setSelect( false );
            g_webGLView.addGLObject(name, barGraph);
            ++barGraphDataCount;
        }   
        else if( objData.type == "Point" )
        {
            name = "Point" + pointDataCount;
            let point = new glObjectImage(g_webGLView)
            point.attachShader("image");
            point.setBillboardMode( true );    
            point.setSelect( false );
            g_webGLView.addGLObject(name, point);          
            ++pointDataCount;
        }   
        else if( objData.type == "Arc" )
        {
            name = "Arc" + arcDataCount;
            let arc = new glObjectArc(g_webGLView)
            arc.attachShader("arc");
            arc.setSelect( false );
            g_webGLView.addGLObject(name, arc);
            ++arcDataCount;
        }
        else if( objData.type == "Line" )
        {
            name = "Line" + lineDataCount;
            let line = new glObjectLine(g_webGLView);
            let vertexPos = [];
            for( let i = 0; i < objData.vertices.length; ++i ){
                let pos = [ objData.vertices[i][0], 0.0,  objData.vertices[i][1] ];
                vertexPos.push( pos );
            }
            line.setPositions( vertexPos );            
            line.attachShader("line");
            line.setSelect( false );
            g_webGLView.addGLObject(name, line);   
            ++lineDataCount;     
        }   
        else if( objData.type == "Polygon" )
        {
            name = "Polygon" + polygonDataCount;
            let polygon = new glObjectPolygon(g_webGLView);
            let vertexPos = [];
            let triangles = generatePolygon( objData.vertices );
            for( let i = 0; i < triangles.length; ++i ){
                let v1 = [ triangles[i][0][0], 0.0, triangles[i][0][1] ];
                let v2 = [ triangles[i][1][0], 0.0, triangles[i][1][1] ];
                let v3 = [ triangles[i][2][0], 0.0, triangles[i][2][1] ];
                vertexPos.push( v1 );
                vertexPos.push( v2 );
                vertexPos.push( v3 );            
            }
            polygon.setVertices( vertexPos );            
            polygon.attachShader("polygon");
            polygon.setSelect( false );
            g_webGLView.addGLObject(name, polygon); 
            ++polygonDataCount; 
        }
        else
        {
            continue;
        }

        g_dataList[name] = objData;
        g_paramSet.addDataList( name );
        changeObjectParam( name );
    }

    let configData = projectData["configData"]
    if( configData == null ) return;
    g_headerArea.setTitle( configData.title );
    g_paramSet.addKeywords( configData.keywords );
    g_paramSet.setStartTime( configData.time.start );
    g_paramSet.setEndTime( configData.time.end );
    g_timeSlider.setCurrentDate( configData.time.current.year, 
                                 configData.time.current.month, 
                                 configData.time.current.date );
    g_timeSlider.setTimeSliderScale( configData.time.sliderScale );   
    if( configData.time.period ){
        g_timeSlider.setDisplayPeriod(configData.time.period.value, configData.time.period.unit);
    }      
}

function mainLoop()
{
    let displayPeriod = g_timeSlider.getPeriod();
    let showStart = displayPeriod.startTime;
    let showEnd   = displayPeriod.endTime;
    let keywords = g_keywordFilter.getKeywords();
    for( var data in g_dataList )
    {
        let dataStart = g_dataList[data].startTime;
        let dataEnd = g_dataList[data].endTime;
        let isDataInTime = checkTime( showStart, showEnd, dataStart, dataEnd ) ;

        let isFilter = false;        
        if( g_keywordFilter.isFilterEnable() )
        {
            isFilter = true;
            for( let i in g_dataList[data].keywords )
            {
                for( let j in keywords )
                {
                    if( g_dataList[data].keywords[i] == keywords[j] )
                    {
                        isFilter = false;
                        break;
                    }
                }
            }
        }

        g_webGLView.getGLObject( data ).setVisible( isDataInTime && !isFilter );
    }

    g_cameraWork.updateCameraPosition();

    g_timeManager.updateTime();    

    g_webGLView.draw(g_time);
    
    g_time += 15;
    setTimeout(mainLoop, 15);
}

function changeObjectParam( name )
{
    let data = g_dataList[name];
    let obj = g_webGLView.getGLObject( name );    
    if( data.type == "BarGraph" )
    { 
        obj.setPosition( data.position );
        obj.setScale( [ data.size, data.height, data.size ] );
        obj.setColor( data.color[0], data.color[1], data.color[2], 1.0 );
    }
    else if ( data.type == "Point" )
    {
        let pos = data.position;
        pos[1] = data.size;
        obj.setPosition( pos );
        obj.setTexture( data.icon );
        obj.setScale( [ data.size, data.size, data.size ] );
    }
    else if ( data.type == "Arc" )
    {
        obj.setPosition( data.startPosition, data.endPosition );
        obj.setHeight( data.height );
        obj.setWidth( data.size );        
        obj.setColor( data.color[0], data.color[1], data.color[2], 1.0 );
    }
    else if ( data.type == "Line" )
    {
        obj.setWidth( data.width );        
        obj.showArrow( data.showArrow ); 
        obj.setColor( data.color[0], data.color[1], data.color[2], 1.0 );
    }
    else if ( data.type == "Polygon" )
    {
        obj.setColor( data.color[0], data.color[1], data.color[2], 1.0 );
    }  
}

function checkTime( showStart, showEnd, dataStart, dataEnd )
{
    function convertDateObjToValue(date)
    {
        let year  = date.getFullYear();
        let month = date.getMonth() + 1;
        let day   = date.getDate(); 
        let value = year * 10000 + month * 100 + day * 1;
        return value;
    }

    function convertDateInputToValue(date)
    {
        let year   = Number( date.substr(0, 4) );
        let month  = Number( date.substr(5, 2) );
        let day    = Number( date.substr(8, 2) );    
        let value = year * 10000 + month * 100 + day * 1;
        return value;
    }

    if( dataStart == "" && dataEnd == "" ){
        return true;
    }

    let show = false;    

    if( dataStart != "" && dataEnd == "" ) {
        showEndVal = convertDateObjToValue(showEnd);
        dataStartVal = convertDateInputToValue(dataStart);
        if( dataStartVal <= showEndVal ){
            show = true;
        }
    }else if( dataStart == "" && dataEnd != "" ){
        showStartVal = convertDateObjToValue(showStart);
        dataEndVal = convertDateInputToValue(dataEnd);
        if( showStartVal <= dataEndVal ){
            show = true;
        }
    }else if( dataStart != "" && dataEnd != "" ){
        showStartVal = convertDateObjToValue(showStart);        
        showEndVal = convertDateObjToValue(showEnd);
        dataStartVal = convertDateInputToValue(dataStart);
        dataEndVal = convertDateInputToValue(dataEnd);
        if( ( showStartVal <= dataEndVal && dataEndVal <= showEndVal ) ||
            ( dataStartVal <= showEndVal && showStartVal <= dataEndVal ) ) 
        {
            show = true;
        }
    }

    return show;
}