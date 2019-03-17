
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
let g_isViewerMode = false;

let g_dataList = {};
let g_time = 0;
let g_selectedObjectName = null;

//let WorldLandFileName = "mapData/ne_110m_land.json";
//let WorldCountriesFileName = "mapData/ne_110m_admin_0_countries.json";
let WorldLandFileName = "mapData/ne_50m_land.json";
let WorldCountriesFileName = "mapData/ne_50m_admin_0_countries.json";

function appStart()
{
    // create webGL view
    g_webGLView = new webGLCanvas("glCanvasArea");

    // create all resources
    createGLShaderProgram();
    createGLObjects();
    
    // function
    g_dataResistration = new dataRegistrationManager();
    g_keywordFilter = new keywordFilterManager();
    g_cameraWork = new cameraWorkManager();
    g_timeManager = new timeManager();

    // create GUI dom
    g_timeSlider = new timeSliderArea();
    g_popup = new popupParamSetting();
    g_headerArea = new headerArea();
    g_paramSet = new paramSettingArea("paramSettingArea");
    g_guideArea = new guideArea();

    // event
    setUpEvent();

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

    let shiftKeyDown = false;
    document.addEventListener("keydown", function(e){
        shiftKeyDown = e.shiftKey;
    }.bind(this));

    document.addEventListener("keyup", function(e){
        shiftKeyDown = e.shiftKey;
    }.bind(this));    

    let moveObject = false;
    let moveArcStart = false;
    let moveArcEnd = false;
    g_webGLView.setMouseDownCallback( function( x, y, name, isTouch, buttonType ){

        if( shiftKeyDown ) return false;

        if( g_dataResistration.mousedown(x, y, isTouch, buttonType) ) 
        {
            g_popup.hide();
            return;
        }

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
                    g_paramSet.setParam( name );
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

        if( moveObject )
        {
            moveObject = false;
            moveArcStart = false;
            moveArcEnd = false;
            changeState("normal");
        }        

        if( g_selectedObjectName == null )
        {
            g_headerArea.setMode("DataList");
        }
    });

    g_webGLView.setMouseMoveCallback( function( x, y ){

        if( shiftKeyDown ) return false;

        if( g_dataResistration.mousemove( x, y ) ) return true;
        
        if( moveObject && g_selectedObjectName )
        {
            let movePos = calcHitPoint( x, y );
            if( moveArcStart )
            {
                g_dataList[ g_selectedObjectName ].startPosition = [ movePos[0], movePos[2] ];
            }
            else if ( moveArcEnd )
            {
                g_dataList[ g_selectedObjectName ].endPosition = [ movePos[0], movePos[2] ];
            }
            else
            {
                g_dataList[ g_selectedObjectName ].position = movePos;
            }
            g_paramSet.setParam( g_selectedObjectName );
            changeObjectParam( g_selectedObjectName );            
        }

        return false;                 
    });    

    g_webGLView.setMouseUpCallback( function(){
    });

    g_webGLView.setMouseOutCallback( function(){     
    });    

    g_webGLView.setMouseWheelCallback( function(){ 
        g_popup.hide();   
        g_dataResistration.mousewheel();
    });    

    g_dataResistration.setRegistrationCallback( function( data )
    {
        if( data.type == "BarGraph" )
        {
            let barGraph = new glObjectCube(g_webGLView)
            barGraph.attachShader("lighting");
            barGraph.setSelect( false );
            g_webGLView.addGLObject(data.name, barGraph);
        }   
        else if( data.type == "Point" )
        {
            let point = new glObjectImage(g_webGLView)
            point.attachShader("image");
            point.setBillboardMode( true );    
            point.setSelect( false );
            g_webGLView.addGLObject(data.name, point);          
        }   
        else if( data.type == "Arc" )
        {
            let arc = new glObjectArc(g_webGLView)
            arc.attachShader("arc");
            arc.setSelect( false );
            g_webGLView.addGLObject(data.name, arc);          
        }  
        else if( data.type == "Line" )
        {
            let line = new glObjectLine(g_webGLView);
            let vertexPos = [];
            for( let i = 0; i < data.vertices.length; ++i ){
                let pos = [ data.vertices[i][0], 0.0,  data.vertices[i][1] ];
                vertexPos.push( pos );
            }
            line.setPositions( vertexPos );            
            line.attachShader("line");
            line.setSelect( false );
            g_webGLView.addGLObject(data.name, line);          
        } 
        else if( data.type == "Polygon" )
        {
            let polygon = new glObjectPolygon(g_webGLView);
            let vertexPos = [];
            let triangles = generatePolygon( data.vertices );
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
            g_webGLView.addGLObject(data.name, polygon);          
        }    
        else
        {
            return;
        }

        g_dataList[data.name] = data;
        g_headerArea.setMode("DataList");
        g_paramSet.addDataList( data.name );
        g_popup.hide();
        changeObjectParam( data.name );

        if( g_selectedObjectName )
        {
            let lastObject = g_webGLView.getGLObject(g_selectedObjectName);
            lastObject.setSelect( false );
            g_selectedObjectName = null;
        }        
    } );

    g_popup.setChangeCallBack( function( eventType, value ){
        if( g_selectedObjectName == null ) return;
        if( eventType == "name" )
        {
            g_dataList[ g_selectedObjectName ].name = value;
            g_paramSet.setParam( g_selectedObjectName );
            g_paramSet.changeDataList( g_selectedObjectName );
            changeObjectParam( g_selectedObjectName );            
        }
        else if ( eventType == "value" )
        {
            g_dataList[ g_selectedObjectName ].value = value;
            g_paramSet.setParam( g_selectedObjectName );
            g_paramSet.changeDataList( g_selectedObjectName );
            changeObjectParam( g_selectedObjectName );
        }
        else if ( eventType == "move" )
        {
            changeState("moveData");
            moveObject = true;
            g_popup.hide();
        }
        else if ( eventType == "moveArcStart" )
        {
            changeState("moveData");
            moveObject = true;
            moveArcStart = true;            
            g_popup.hide();
        }
        else if ( eventType == "moveArcEnd" )
        {
            changeState("moveData");
            moveObject = true;
            moveArcEnd = true;   
            g_popup.hide();
        }     
    });
    
    resizeEvent();
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



///////////////////////////////////////////////////////////////////////
// global function
///////////////////////////////////////////////////////////////////////


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

function deleteObject( name )
{
    g_popup.hide();    
    g_paramSet.deleteDataList(name);    
    g_webGLView.deleteGLObject(name);
    delete g_dataList[name];
    g_selectedObjectName = null;
    g_headerArea.setMode("DataList");
}

function calcHitPoint( screenX, screenY )
{
    let x = screenX;
    let y = screenY;

    // calc camera vector
    let radH = g_webGLView.cameraPosH * 3.141592 / 180;
    let radV = g_webGLView.cameraPosV * 3.141592 / 180;
    let posX = g_webGLView.cameraPosR * Math.cos(radV) * Math.cos(radH);
    let posY = g_webGLView.cameraPosR * Math.sin(radV);
    let posZ = g_webGLView.cameraPosR * Math.cos(radV) * Math.sin(radH);
    posX += g_webGLView.targetPosX;
    posY += g_webGLView.targetPosY;
    posZ += g_webGLView.targetPosZ;
    let vecCameraToTarget = vec3.create( [ g_webGLView.targetPosX - posX, 
                                           g_webGLView.targetPosY - posY,      
                                           g_webGLView.targetPosZ - posZ ] );

    // calc rotation axis
    let targetRay = vec3.create( [0, 0, 0] );
    vec3.normalize( vecCameraToTarget, targetRay );
    let upVec = vec3.create( [0, 1, 0] );
    let cameraSideVec = vec3.create();
    let cameraUpVec = vec3.create();
    vec3.cross( targetRay, upVec, cameraSideVec );
    vec3.cross( targetRay, cameraSideVec, cameraUpVec );    

    // calc rotation
    let glViewWidth = g_webGLView.getWidth();
    let glViewHeight = g_webGLView.getHeight();
    let fovy = 60;
    let fovx = fovy * glViewWidth / glViewHeight;
    let rotUp = ( x - glViewWidth / 2 ) / glViewWidth * fovx;
    let rotSide = ( y - glViewHeight / 2 ) / glViewHeight * fovy;
    
    // rotate vector
    let tempMat = mat4.create();   
    mat4.identity(tempMat);
    let rotMatSideAxis = mat4.create();
    mat4.rotate( tempMat, - rotSide * 3.141592 / 180, cameraSideVec, rotMatSideAxis );    
    let rotateAxis = vec3.create();
    mat4.multiplyVec3( rotMatSideAxis, cameraUpVec, rotateAxis );
    let rotMatUpAxis = mat4.create();    
    mat4.rotate( tempMat, rotUp * 3.141592 / 180, rotateAxis, rotMatUpAxis );    
    let rotMat = mat4.create();
    mat4.multiply( rotMatUpAxis, rotMatSideAxis, rotMat );
    let hitPointRay = vec3.create( [0, 0, 0] );    
    mat4.multiplyVec3( rotMat, targetRay, hitPointRay );
    
    // let rotMatUp = mat4.create();    
    // mat4.rotate( tempMat, rotUp * 3.141592 / 180, cameraUpVec, rotMatUp );   
    // mat4.multiplyVec3( rotMatUp, targetRay, hitPointRay );
    // mat4.multiplyVec3( rotMatSideAxis, targetRay, hitPointRay );
    
    // cross at Y=0 plane
    let rayLength = - posY / hitPointRay[1];
    let hitPosX = posX + rayLength * hitPointRay[0];
    let hitPosZ = posZ + rayLength * hitPointRay[2];

    g_guideArea.setCurrentPosition( hitPosX, hitPosZ );

    return [ hitPosX, 0, hitPosZ ];              
}

function changeState( state )
{
    if( state == "normal" )
    {
        g_webGLView.getGLObject("worldMap").setColor( 0.4, 0.4, 0.4, 1.0 );
        g_webGLView.getGLObject("bgImage").setLuminance( 1.0 );        
        g_webGLView.getGLObject("grid").setVisible( false );
        g_guideArea.showCurrentPosition( false );
    }
    else if( state == "addData" )
    {
        g_webGLView.getGLObject("worldMap").setColor( 0.8, 0.8, 0.8, 1.0 );
        g_webGLView.getGLObject("bgImage").setLuminance( 0.5 );
        g_webGLView.getGLObject("grid").setAnimationStartTime( g_time, 1.0 );
        g_webGLView.getGLObject("grid").setVisible( true );            
        g_guideArea.showCurrentPosition( true ); 
    }    
    else if( state == "moveData" )
    {
        g_webGLView.getGLObject("worldMap").setColor( 0.8, 0.8, 0.8, 1.0 );
        g_webGLView.getGLObject("bgImage").setLuminance( 0.5 );
        g_webGLView.getGLObject("grid").setAnimationStartTime( g_time, 0.0 );
        g_webGLView.getGLObject("grid").setVisible( true );            
        g_guideArea.showCurrentPosition( true );         
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