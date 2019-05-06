
function addObject( objName, data )
{
    if( data.type == "BarGraph" )
    {
        let barGraph = new glObjectCube(g_webGLView)
        barGraph.attachShader("lighting");
        barGraph.setSelect( false );
        g_webGLView.addGLObject(objName, barGraph);
    }   
    else if( data.type == "Point" )
    {
        let point = new glObjectImage(g_webGLView)
        point.attachShader("image");
        point.setBillboardMode( true );    
        point.setSelect( false );
        g_webGLView.addGLObject(objName, point);          
    }   
    else if( data.type == "Arc" )
    {
        let arc = new glObjectArc(g_webGLView)
        arc.attachShader("arc");
        arc.setSelect( false );
        g_webGLView.addGLObject(objName, arc);          
    }  
    else if( data.type == "Line" )
    {
        let line = new glObjectLine(g_webGLView);
        let vertexPos = [];
        for( let i = 0; i < data.vertices.length; ++i ){
            let pos = [ data.vertices[i][0], 0.0, -data.vertices[i][1] ];
            vertexPos.push( pos );
        }
        line.setPositions( vertexPos );            
        line.attachShader("line");
        line.setSelect( false );
        g_webGLView.addGLObject(objName, line);          
    } 
    else if( data.type == "Polygon" )
    {
        let polygon = new glObjectPolygon(g_webGLView);
        let vertexPos = [];
        let triangles = generatePolygon( data.vertices );
        for( let i = 0; i < triangles.length; ++i ){
            let v1 = [ triangles[i][0][0], 0.0, -triangles[i][0][1] ];
            let v2 = [ triangles[i][1][0], 0.0, -triangles[i][1][1] ];
            let v3 = [ triangles[i][2][0], 0.0, -triangles[i][2][1] ];
            vertexPos.push( v1 );
            vertexPos.push( v2 );
            vertexPos.push( v3 );            
        }
        polygon.setVertices( vertexPos );            
        polygon.attachShader("polygon");
        polygon.setSelect( false );
        g_webGLView.addGLObject(objName, polygon);          
    }    
    else
    {
        return;
    }

    g_dataList[ objName ] = data;
    changeObjectParam( objName );

    g_settingArea.setData( objName, g_dataList[ objName ] );
    g_settingArea.addDataList( objName );
    //g_popup.hide();

    if( g_selectedObjectName )
    {
        let lastObject = g_webGLView.getGLObject(g_selectedObjectName);
        lastObject.setSelect( false );
        g_selectedObjectName = null;
    }  
}

function changeObjectParam( name )
{
    data = g_dataList[name];

    let obj = g_webGLView.getGLObject( name );    
    if( data.type == "BarGraph" )
    { 
        let pos = [ data.position[0], 0, -data.position[1] ];
        obj.setPosition( pos );
        obj.setScale( [ data.size, data.height, data.size ] );
        obj.setColor( data.color[0], data.color[1], data.color[2], 1.0 );
    }
    else if ( data.type == "Point" )
    {
        let pos = [ data.position[0], 0, -data.position[1] ];
        pos[1] = data.size;
        obj.setPosition( pos );
        obj.setTexture( data.icon );
        obj.setScale( [ data.size, data.size, data.size ] );
    }
    else if ( data.type == "Arc" )
    {
        let startPos = [ data.startPosition[0], -data.startPosition[1] ];
        let endPos = [ data.endPosition[0], -data.endPosition[1] ];
        obj.setPosition( startPos, endPos );
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
    g_settingArea.deleteDataList(name);    
    g_webGLView.deleteGLObject(name);
    delete g_dataList[name];
    g_selectedObjectName = null;
    g_settingArea.changeSettingView( "Data List" );
}

function selectObject( name )
{
    if( name && g_dataList[name] ){
        let selectedObject = g_webGLView.getGLObject(name);
        if( selectedObject.setSelect ){
            if( g_selectedObjectName ){
                let lastObject = g_webGLView.getGLObject(g_selectedObjectName);
                lastObject.setSelect( false );
            }                      
            g_selectedObjectName = name;                    
            selectedObject.setSelect( true );
            // console.log( g_selectedObjectName );

            g_settingArea.setData( name, g_dataList[name] );
        }
    }else{
        if( g_selectedObjectName )
        {
            let lastObject = g_webGLView.getGLObject(g_selectedObjectName);
            lastObject.setSelect( false );
            g_selectedObjectName = null;
        }        
        if( Object.keys( g_dataList ).length > 0 ){
            g_settingArea.changeSettingView( "Data List" );      
        }
    }   
}

function calcHitPoint( screenX, screenY )
{    
    // ray
    let ray = g_webGLView.calcRayVector( screenX, screenY );

    // camera
    let posX = g_webGLView.cameraPosX;
    let posY = g_webGLView.cameraPosY;
    let posZ = g_webGLView.cameraPosZ;    

    // cross at Y=0 plane
    let rayLength = - posY / ray[1];
    let hitPosX   = posX + rayLength * ray[0];
    let hitPosZ   = posZ + rayLength * ray[2];
    g_informationBar.setCurrentPosition( hitPosX, -hitPosZ );

    return [ hitPosX, 0, hitPosZ ];              
}

function changeState( state )
{
    if( state == "normal" )
    {
        g_webGLView.getGLObject("worldMap").setColor( 0.4, 0.4, 0.4, 1.0 );
        g_webGLView.getGLObject("bgImage").setLuminance( 1.0 );        
        g_webGLView.getGLObject("grid").setVisible( false );
        g_informationBar.showCurrentPosition( false );
    }
    else if( state == "addData" )
    {
        g_webGLView.getGLObject("worldMap").setColor( 0.8, 0.8, 0.8, 1.0 );
        g_webGLView.getGLObject("bgImage").setLuminance( 0.5 );
        g_webGLView.getGLObject("grid").setAnimationStartTime( g_time, 1.0 );
        g_webGLView.getGLObject("grid").setVisible( true );            
        g_informationBar.showCurrentPosition( true ); 
    }    
    else if( state == "moveData" )
    {
        g_webGLView.getGLObject("worldMap").setColor( 0.8, 0.8, 0.8, 1.0 );
        g_webGLView.getGLObject("bgImage").setLuminance( 0.5 );
        g_webGLView.getGLObject("grid").setAnimationStartTime( g_time, 0.0 );
        g_webGLView.getGLObject("grid").setVisible( true );            
        g_informationBar.showCurrentPosition( true );         
    }
}

function changeColorStyle( color, style )
{
    let r = color.r;
    let g = color.g;
    let b = color.b;
    g_settingArea.setBackgroundColor( r, g, b );
    g_newDataArea.setBackgroundColor( r, g, b );

    if( style == "lightgreen" ){
        g_webGLView.getGLObject("bgImage").setType("image");
    }else if( style == "blue" ){
        g_webGLView.getGLObject("bgImage").setType("image");
    }else if( style == "pink" ){
        r = r / 255;
        g = g / 255;
        b = b / 255;    
        g_webGLView.getGLObject("bgImage").setColor( r, g, b, 1.0 );
        g_webGLView.getGLObject("bgImage").setType("gradation");
    }else if( style == "black" ){
        r = r / 255 * 0.6;
        g = g / 255 * 0.6;
        b = b / 255 * 0.6;    
        g_webGLView.getGLObject("bgImage").setColor( r, g, b, 1.0 );
        g_webGLView.getGLObject("bgImage").setType("singleColor");
    }
}

function checkTime( currentTime, dataFrom, dataTo )
{
    function convertDateToValue(date)
    {
        let year  = date.year;
        let month = date.month;
        let day   = date.day; 
        let value = year * 10000 + month * 100 + day * 1;
        return value;
    }

    if( !dataFrom.enable && !dataTo.enable ){
        return true;
    }

    let show = false;    
    let now = convertDateToValue(currentTime);
    if( dataFrom.enable && !dataTo.enable ) {
        let from = convertDateToValue(dataFrom);
        if( from <= now ){
            show = true;
        }
    }else if( !dataFrom.enable && dataTo.enable ){
        let to = convertDateToValue(dataTo);
        if( now <= to ){
            show = true;
        }
    }else if( dataFrom.enable && dataTo.enable ){
        let from = convertDateToValue(dataFrom);      
        let to = convertDateToValue(dataTo);
        if( from <= now && now <= to ) {
            show = true;
        }
    }

    return show;
}

function loadProjectFile( files )
{
    if ( !files[0] ) return;

    let reader = new FileReader();    
    reader.readAsText(files[0]);
    reader.onload = function (e)
    {
        let projectData = JSON.parse( reader.result );
        console.log(projectData);

        let objDataList = projectData["dataList"];
        if( objDataList == null ) return;
        for( let i = 0; i < objDataList.length; ++i )
        {
            let objData = objDataList[i];
            let objName = g_newDataManager.assignObjName(objData.type);
            addObject( objName, objData );
        }

        let configData = projectData["config"];
        if( configData == null ) return;

        if( configData.view ){
            g_webGLView.targetPosX = configData.view.x;
            g_webGLView.targetPosY = configData.view.y;
            g_webGLView.targetPosZ = configData.view.z;
            g_webGLView.cameraPosR = configData.view.distance;
        }

        if( configData.style ){
            g_settingArea.setColorStyle( configData.style );
        }

        if( configData.defaultParam ){
            for( let type in configData.defaultParam ){
                let param = configData.defaultParam[type];
                g_newDataManager.setDefalutParameter( type, param );
                g_settingArea.setDefaultParam( type, param );
            }
        }        

        if( configData.time ){
            g_timeFilter.setCurrentDate( configData.time );
        }            
    }         
}

function downloadProjectFile( filePath, downloader )
{
    let projectData = {};

    // data
    projectData["dataList"] = [];
    for( objName in g_dataList ){
        projectData["dataList"].push( g_dataList[objName] );
    }

    // config
    let view = {
        x : g_webGLView.targetPosX,
        y : g_webGLView.targetPosY,
        z : g_webGLView.targetPosZ,
        distance : g_webGLView.cameraPosR,
    }
    projectData["config"] = {
        view         : view,
        style        : g_settingArea.getColorStyle(),
        defaultParam : g_newDataManager.getDefalutParameter(),
        time         : g_timeFilter.getCurrentDate(),
    }
    
    console.log( projectData );
    let data = JSON.stringify( projectData );
    let fileName = filePath + ".json";
    var blob = new Blob([data], { "type": "text/plain" });
    if (window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(blob, fileName);
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    }else{
        downloader.download = fileName;
        downloader.href = window.URL.createObjectURL(blob);
    }    
}

function jumpToObjectPosition( objName )
{
    let data = g_dataList[objName];

    function range( points ){
        let minX = 10000, maxX = -10000;
        let minY = 10000, maxY = -10000;
        for( let i in points ){
            if( points[i][0] < minX ) minX = points[i][0];
            if( points[i][1] < minY ) minY = points[i][1];
            if( maxX < points[i][0] ) maxX = points[i][0];
            if( maxY < points[i][1] ) maxY = points[i][1];   
        }
        let diffX = maxX - minX;
        let diffY = maxY - minY;
        return Math.sqrt( diffX * diffX + diffY + diffY );
    }

    if( data.type == "BarGraph"){
        let distance = data.height * 4;
        g_cameraWork.startTransition( data.position[0], -data.position[1], 800, distance );
    }else if( data.type == "Arc"){
        let distance = data.height * 4;
        let x = ( data.startPosition[0] + data.endPosition[0] ) / 2
        let z = ( data.startPosition[1] + data.endPosition[1] ) / 2            
        g_cameraWork.startTransition( x, -z, 800, distance );
    }else if( data.type == "Point"){
        let distance = data.size * 12;
        g_cameraWork.startTransition( data.position[0], -data.position[1], 800, distance );
    }else if( data.type == "Line"){
        let distance = range( data.vertices ) * 4;
        g_cameraWork.startTransition( data.position[0], -data.position[1], 800, distance );
    }else if( data.type == "Polygon"){
        let distance = range( data.vertices ) * 4;
        g_cameraWork.startTransition( data.position[0], -data.position[1], 800, distance );
    }
}

function jumpToObjectTime( objName )
{
    let data = g_dataList[objName];
    let targetTime;
    if( !data.startTime.enable && !data.endTime.enable ){
        return;
    }else if( !data.startTime.enable ){
        targetTime = data.endTime;
    }else{
        targetTime = data.startTime;
    }
    g_timeTraveler.startTransition( targetTime, 800 );            
}