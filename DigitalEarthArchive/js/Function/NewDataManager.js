
let NewDataManager = function ()
{
    this.type = "";
    this.lastMousePos = [ 0, 0 ];   

    // default parameter
    this.defaultDataParam = {
        startTime : "",
        endTime   : "",  
    }

    // Bar Graph
    this.defaultBarGraphParam = {
        type      : "BarGraph",
        name      : "BarGraph",
        height    : 10.0,            
        size      : 1.0, 
        color     : [0.8, 0.2, 0.2],         
    }
    this.barGraphDataCount = 0;
    this.startBarGraphDataRegistration = false;
    this.moveTemporaryBarGraph = false;

    // Arc 
    this.defaultArcParam = {
        type   : "Arc",
        name   : "Arc",       
        size   : 1,
        height : 20,
        color  : [0.8, 0.2, 0.2],
    }         
    this.arcDataCount = 0;
    this.startArcDataRegistration = false;    
    this.moveTemporaryArcStart = false;
    this.moveTemporaryArcEnd = false;
    this.arcStartPos = [0.0, 0.0]; 

    // Point   
    this.defaultPointParam = {
        type : "Point",
        name : "Point",       
        size : 2.5,
        icon : "pointerRed",
    }              
    this.pointDataCount = 0;
    this.startPointDataRegistration = false;    
    this.moveTemporaryPoint = false;
 
    // Line
    this.defaultLineParam = {
        type      : "Line",
        name      : "Line",       
        width     : 0.5,
        showArrow : false,
        color     : [0.8, 0.2, 0.2],
    }        
    this.lineDataCount = 0; 
    this.startLineDataRegistration = false;
    this.addLineVertex = false;
    this.tempLine = null;
    this.lineVertices = [];

    // Polygon
    this.defaultPolygonParam = {
        type      : "Polygon",
        name      : "Polygon",       
        color     : [0.8, 0.2, 0.2],
    }        
    this.polygonDataCount = 0; 
    this.startPolygonDataRegistration = false;    
    this.addPolygonVertex = false;
    this.tempPolygonSides = null;
    this.polygonVertices = [];    

    // Grid
    let grid = new glObjectGrid(g_webGLView, -200, -200, 0, 40, 40, 10);
    grid.attachShader("grid");
    grid.setColor( 0.2, 0.2, 0.2, 1.0 );
    grid.setVisible( false );
    g_webGLView.addGLObject("grid", grid); 

    this.tempCube = new glObjectCube(g_webGLView);
    this.tempCube.setPosition( [ 0.0, 0.0, 0.0 ] );
    this.tempCube.setScale( [ 1.0, 10.0, 1.0 ] ); 
    this.tempCube.setColor( 0.8, 0.2, 0.2, 0.5 );
    this.tempCube.setSelect( true );    
    this.tempCube.setVisible( false );
    this.tempCube.attachShader("lighting");
    g_webGLView.addGLObject("tempCube", this.tempCube);

    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];    
    this.tempArcStart = new glObjectPointer(g_webGLView);
    this.tempArcStart.setPosition( [ 0.0, 0.0, 0.0 ] );
    this.tempArcStart.setScale( scale ); 
    this.tempArcStart.setColor( 1.0, 0.0, 0.0, 1.0 );
    this.tempArcStart.setSelect( true );    
    this.tempArcStart.setVisible( false );
    this.tempArcStart.attachShader("singleColor");
    g_webGLView.addGLObject("tempArcStart", this.tempArcStart);

    this.tempArcEnd = new glObjectPointer(g_webGLView);
    this.tempArcEnd.setPosition( [ 0.0, 0.0, 0.0 ] );
    this.tempArcEnd.setScale( scale ); 
    this.tempArcEnd.setColor( 1.0, 0.0, 0.0, 1.0 );
    this.tempArcEnd.setSelect( true );    
    this.tempArcEnd.setVisible( false );
    this.tempArcEnd.attachShader("singleColor");
    g_webGLView.addGLObject("tempArcEnd", this.tempArcEnd);

    this.tempArc = new glObjectArc(g_webGLView);
    this.tempArc.setPosition( [ 0.0, 0.0 ], [ 0.0, 0.0 ] );
    this.tempArc.setHeight( 20 ); 
    this.tempArc.setColor( 1.0, 0.0, 0.0, 1.0 );
    this.tempArc.setSelect( true );    
    this.tempArc.setVisible( false );
    this.tempArc.attachShader("arc");
    g_webGLView.addGLObject("tempArc", this.tempArc);    

    this.tempImage = new glObjectImage(g_webGLView);
    this.tempImage.setImage(g_webGLView.context, "image/pointer.png", function(){});
    this.tempImage.setPosition( [ 0.0, 0.0, 0.0 ] );
    this.tempImage.setScale( [ 2.5, 2.5, 2.5 ] );
    this.tempImage.setSelect( true );    
    this.tempImage.setVisible( false );
    this.tempImage.setBillboardMode( true );    
    this.tempImage.attachShader("image");
    g_webGLView.addGLObject("tempPointImage", this.tempImage); 
    
    this.tempPointer = new glObjectPointer(g_webGLView);
    this.tempPointer.setPosition( [ 10000.0, 10000.0, 10000.0 ] );
    this.tempPointer.setScale( scale ); 
    this.tempPointer.setColor( 1.0, 0.0, 0.0, 1.0 );
    this.tempPointer.setSelect( true );    
    this.tempPointer.setVisible( false );
    this.tempPointer.attachShader("singleColor");
    g_webGLView.addGLObject("tempPointer", this.tempPointer);
}

NewDataManager.prototype.start = function ( type )
{
    if( this.type == "" )
    {
        this.type = type;
        changeState( "addData" );
    
        if( this.type == "Arc" ){
            this.moveTemporaryArcStart = true;
            this.startArcDataRegistration = false;
            let col = this.defaultArcParam.color;
            this.tempArcStart.setColor( col[0], col[1], col[2], 1.0 );
            this.tempArcEnd.setColor( col[0], col[1], col[2], 1.0 );
            this.mousewheel();
        }else if( this.type == "Line" ){
            this.addLineVertex = true;
            this.tempPointer.setColor( 1.0, 0.0, 0.0, 1.0 );
            let col = this.defaultLineParam.color;
            this.tempPointer.setColor( col[0], col[1], col[2], 1.0 );
            this.tempPointer.setVisible( true );
            this.mousewheel();
        }else if( this.type == "Polygon" ){
            this.addPolygonVertex = true;
            let col = this.defaultPolygonParam.color;
            this.tempPointer.setColor( col[0], col[1], col[2], 1.0 );
            this.tempPointer.setVisible( true );
            this.mousewheel();
        }        
    }
}

NewDataManager.prototype.mousedown = function ( x, y, isTouch, buttonType )
{
    let result = true;

    if( this.type == "BarGraph" ){
        this.mouseEvent_BarGraph( "down", x, y, isTouch, buttonType );
    }else if( this.type == "Arc" ){
        this.mouseEvent_Arc( "down", x, y, isTouch, buttonType );
    }else if( this.type == "Point" ){
        this.mouseEvent_Point( "down", x, y, isTouch, buttonType );
    }else if( this.type == "Line" ){
        this.mouseEvent_Line( "down", x, y, isTouch, buttonType );
    }else if( this.type == "Polygon" ){
        this.mouseEvent_Polygon( "down", x, y, isTouch, buttonType );
    }else{
        result = false;
    }

    return result;
}

NewDataManager.prototype.mousemove = function ( x, y, isTouch )
{
    let result = true;

    if( this.type == "BarGraph" ){
        this.mouseEvent_BarGraph( "move", x, y, isTouch, null );
    }else if( this.type == "Arc" ){
        this.mouseEvent_Arc( "move", x, y, isTouch, null );
    }else if( this.type == "Point" ){
        this.mouseEvent_Point( "move", x, y, isTouch, null );
    }else if( this.type == "Line" ){
        this.mouseEvent_Line( "move", x, y, isTouch, null );
    }else if( this.type == "Polygon" ){
        this.mouseEvent_Polygon( "move", x, y, isTouch, null );
    }else{
        result = false;
    }

    return result;
}

NewDataManager.prototype.mousewheel = function ()
{
    let result = true;
    
    if( this.type == "Arc" ){
        let s = g_webGLView.cameraPosR * 0.03;
        let scale = [ s, s, s ];
        this.tempArcStart.setScale(scale);
        this.tempArcEnd.setScale(scale);
    }else if( this.type == "Line" || this.type == "Polygon" ){
        let s = g_webGLView.cameraPosR * 0.03;
        let scale = [ s, s, s ];
        this.tempPointer.setScale(scale);
    }else{
        result = false;
    }

    return result;
}

NewDataManager.prototype.mouseEvent_BarGraph = function ( eventType, x, y, isTouch, buttonType )
{
    if( eventType == "move" )
    {
        let pos = calcHitPoint( x, y );
        this.tempCube.setPosition( pos );   
        this.tempCube.setVisible( true );
    }
    else if( eventType == "down" )
    {
        changeState( "normal" );
        this.tempCube.setVisible( false );
        this.tempCube.setPosition([-10000, -10000, -10000]);  
        this.startBarGraphDataRegistration = false;
        this.moveTemporaryBarGraph = false;
        this.type = "";

        let data = {};
        let pos = calcHitPoint( x, y )
        let col = this.defaultBarGraphParam.color
        let objName = "BarGraph" + this.barGraphDataCount;
        data.type = "BarGraph";
        data.name = this.defaultBarGraphParam.name + this.barGraphDataCount;
        data.position = [ pos[0], -pos[2] ];
        data.note = "";
        data.startTime = { year:2000, month:1, day:1, enable:false };
        data.endTime   = { year:2000, month:1, day:1, enable:false };            
        data.height = this.defaultBarGraphParam.height;            
        data.size = this.defaultBarGraphParam.size;
        data.color = [ col[0], col[1], col[2] ]; 
        data.keywords = [];            
        ++this.barGraphDataCount;

        addObject( objName, data );
    }
}

NewDataManager.prototype.mouseEvent_Arc = function ( eventType, x, y, isTouch, buttonType )
{
    if( eventType == "move" )
    {
        if( this.moveTemporaryArcStart )
        {
            let pos = calcHitPoint( x, y );
            this.tempArcStart.setPosition( pos );   
            this.tempArcStart.setVisible( true );
            this.arcStartPos[0] = pos[0];
            this.arcStartPos[1] = pos[2];           
        }  
        else if( this.moveTemporaryArcEnd )
        {
            let pos = calcHitPoint( x, y );
            this.tempArcEnd.setPosition( pos );   
            this.tempArcEnd.setVisible( true );
            this.tempArc.setPosition( this.arcStartPos, [ pos[0], pos[2] ] );  
            this.tempArc.setVisible( true );     
        }          
    }
    else if( eventType == "down" )
    {
        if( this.moveTemporaryArcStart )    
        {
            this.moveTemporaryArcStart = false;
            this.moveTemporaryArcEnd = true;
        }
        else if( this.moveTemporaryArcEnd )
        {
            changeState( "normal" );
            this.tempArcStart.setVisible( false );
            this.tempArcStart.setPosition([-10000, -10000, -10000]); 
            this.tempArcEnd.setVisible( false );
            this.tempArcEnd.setPosition([-10000, -10000, -10000]); 
            this.tempArc.setVisible( false );
            this.startArcDataRegistration = false;   
            this.moveTemporaryArcStart = false;
            this.moveTemporaryArcEnd = false; 
            this.type = "";
            
            let data = {};
            let objName = "Arc" + this.arcDataCount;
            let col = this.defaultArcParam.color;
            let pos = calcHitPoint( x, y );
            data.type = "Arc";
            data.name = this.defaultArcParam.name + this.arcDataCount;
            data.startPosition = [ this.arcStartPos[0], -this.arcStartPos[1] ];
            data.endPosition = [ pos[0], -pos[2] ];
            data.value = "";
            data.note = "";
            data.startTime = { year:2000, month:1, day:1, enable:false };
            data.endTime   = { year:2000, month:1, day:1, enable:false };            
            data.size = this.defaultArcParam.size;
            data.height = this.defaultArcParam.height;
            data.color = [ col[0], col[1], col[2] ]; 
            data.keywords = [];
            ++this.arcDataCount;

            addObject( objName, data );
        }
    }    
}

NewDataManager.prototype.mouseEvent_Point = function ( eventType, x, y, isTouch, buttonType )
{
    if( eventType == "move" )
    {
        let pos = calcHitPoint( x, y );
        pos[1] = this.defaultPointParam.size;
        this.tempImage.setPosition( pos );   
        this.tempImage.setVisible( true );
    }
    else if( eventType == "down" )
    {
        changeState( "normal" );
        this.tempImage.setVisible( false );
        this.tempImage.setPosition([-10000, -10000, -10000]);  
        this.startPointDataRegistration = false;
        this.moveTemporaryPoint = false;
        this.type = "";

        let data = {};
        let objName = "Point" + this.pointDataCount;
        let pos = calcHitPoint( x, y );
        data.type = "Point";
        data.name = this.defaultPointParam.name + this.pointDataCount;
        data.position = [ pos[0], -pos[2] ];
        data.note = "";
        data.startTime = { year:2000, month:1, day:1, enable:false };
        data.endTime   = { year:2000, month:1, day:1, enable:false };   
        data.size  = this.defaultPointParam.size;
        data.icon  = this.defaultPointParam.icon;
        data.keywords = [];   
        ++this.pointDataCount;

        addObject( objName, data );
    }
}

NewDataManager.prototype.mouseEvent_Line = function ( eventType, x, y, isTouch, buttonType )
{
    if( eventType == "move" )
    {
        if( this.addLineVertex && ( this.tempLine == null ) )
        {
            let pos = calcHitPoint( x, y );
            this.tempPointer.setPosition( pos );     
        }       
        else if( this.addLineVertex && this.tempLine )
        {
            let prevVertexPos = this.lineVertices[ this.lineVertices.length - 1 ];
            let startPos = [ prevVertexPos[0], -prevVertexPos[1] ];
            let pos = calcHitPoint( x, y );
            let endPos = [ pos[0], pos[2] ];
            this.tempLine.setPosition( startPos, endPos );
            this.tempPointer.setPosition( pos );        
        }           
    }
    else if( eventType == "down" )
    {
        let isDblClick = false;
        if( this.lastMousePos[0] == x && this.lastMousePos[1] == y ){
            isDblClick = true;
        }
        this.lastMousePos[0] = x;
        this.lastMousePos[1] = y;

        if( buttonType == 0 && !isDblClick )
        {
            let vertexPos = calcHitPoint( x, y );
            let startPos2D = [ vertexPos[0], vertexPos[2] ];
            this.tempLine = new glObjectStraightLine(g_webGLView);
            this.tempLine.setPosition( startPos2D, startPos2D );
            this.tempLine.attachShader("singleColor");
            let col = this.defaultLineParam.color;
            this.tempLine.setColor( col[0], col[1], col[2], 1.0 );
            this.tempLine.setVisible( true );
            let name = "tempLine" + this.lineVertices.length;
            g_webGLView.addGLObject(name, this.tempLine); 
            let vertPos = [ vertexPos[0], -vertexPos[2] ];
            this.lineVertices.push( vertPos );
        }
        else if( buttonType == 2 || isDblClick )
        {
            changeState( "normal" );
            this.tempPointer.setPosition([-10000, -10000, -10000]);  
            this.tempPointer.setVisible( false );
            this.addLineVertex = false;
            this.startLineDataRegistration = false;
            this.tempLine = null;
            this.type = "";

            let vertexPos = calcHitPoint( x, y );
            let endPos = [ vertexPos[0], -vertexPos[2] ];
            this.lineVertices.push( endPos );
            let vertices = [];
            let position = [0, 0];
            let minX = 10000, maxX = -10000;
            let minZ = 10000, maxZ = -10000;
            for( let i = 0; i < this.lineVertices.length-1; ++i ){
                let name = "tempLine" + i;
                vertices.push( this.lineVertices[i] );
                g_webGLView.deleteGLObject(name);
                if( this.lineVertices[i][0] < minX ) minX = this.lineVertices[i][0];
                if( this.lineVertices[i][1] < minZ ) minZ = this.lineVertices[i][1];
                if( maxX < this.lineVertices[i][0] ) maxX = this.lineVertices[i][0];
                if( maxZ < this.lineVertices[i][1] ) maxZ = this.lineVertices[i][1];
            }
            this.lineVertices = [];
            position[0] = (minX + maxX) / 2;
            position[1] = (minZ + maxZ) / 2;            

            let data = {};
            let objName = "Line" + this.lineDataCount;
            let col = this.defaultLineParam.color;
            data.type = "Line";
            data.name = this.defaultLineParam.name + this.lineDataCount;
            data.position = position;
            data.vertices = vertices;
            data.note = "";
            data.startTime = { year:2000, month:1, day:1, enable:false };
            data.endTime   = { year:2000, month:1, day:1, enable:false };            
            data.width = this.defaultLineParam.width;
            data.showArrow = this.defaultLineParam.showArrow;             
            data.color = [ col[0], col[1], col[2] ]; 
            data.keywords = [];
            ++this.lineDataCount;

            addObject( objName, data );
        }        
    }
}

NewDataManager.prototype.mouseEvent_Polygon = function ( eventType, x, y, isTouch, buttonType )
{
    if( eventType == "move" )
    {
        if( this.addPolygonVertex && ( this.tempPolygonSides == null ) )
        {
            let pos = calcHitPoint( x, y );
            this.tempPointer.setPosition( pos );          
        }       
        else if( this.addPolygonVertex && this.tempPolygonSides )
        {
            let prevVertexPos = this.polygonVertices[ this.polygonVertices.length - 1 ];
            let startPos = [ prevVertexPos[0], -prevVertexPos[1] ];
            let pos = calcHitPoint( x, y );
            let endPos = [ pos[0], pos[2] ];
            this.tempPolygonSides.setPosition( startPos, endPos );
            this.tempPointer.setPosition( pos );         
        }           
    }
    else if( eventType == "down" )
    {
        let isDblClick = false;
        if( this.lastMousePos[0] == x && this.lastMousePos[1] == y ){
            isDblClick = true;
        }
        this.lastMousePos[0] = x;
        this.lastMousePos[1] = y;

        if( buttonType == 0 && !isDblClick )
        {
            let vertexPos = calcHitPoint( x, y );
            let startPos2D = [ vertexPos[0], vertexPos[2] ];
            this.tempPolygonSides = new glObjectStraightLine(g_webGLView);
            this.tempPolygonSides.setPosition( startPos2D, startPos2D );
            this.tempPolygonSides.attachShader("singleColor");
            let col = this.defaultPolygonParam.color;        
            this.tempPolygonSides.setColor( col[0], col[1], col[2], 1.0 );
            this.tempPolygonSides.setVisible( true );
            let name = "tempLine" + this.polygonVertices.length;
            g_webGLView.addGLObject(name, this.tempPolygonSides); 
            let vertPos = [ vertexPos[0], -vertexPos[2] ];
            this.polygonVertices.push( vertPos );
        }
        else if( buttonType == 2 || isDblClick )
        {
            changeState( "normal" );
            this.tempPointer.setPosition([-10000, -10000, -10000]);  
            this.tempPointer.setVisible( false );
            this.addPolygonVertex = false;
            this.startLineDataRegistration = false;
            this.tempPolygonSides = null;
            let vertexPos = calcHitPoint( x, y );
            let endPos = [ vertexPos[0], -vertexPos[2] ];
            this.polygonVertices.push( endPos );
            this.type = "";

            let vertices = [];
            let position = [0, 0];
            let minX = 10000, maxX = -10000;
            let minZ = 10000, maxZ = -10000;
            for( let i = 0; i < this.polygonVertices.length-1; ++i ){
                let name = "tempLine" + i;
                vertices.push( this.polygonVertices[i] );
                g_webGLView.deleteGLObject(name);
                if( this.polygonVertices[i][0] < minX ) minX = this.polygonVertices[i][0];
                if( this.polygonVertices[i][1] < minZ ) minZ = this.polygonVertices[i][1];
                if( maxX < this.polygonVertices[i][0] ) maxX = this.polygonVertices[i][0];
                if( maxZ < this.polygonVertices[i][1] ) maxZ = this.polygonVertices[i][1];                
            }
            this.polygonVertices = [];
            position[0] = (minX + maxX) / 2;
            position[1] = (minZ + maxZ) / 2;      

            let data = {};
            let col = this.defaultPolygonParam.color;
            let objName = "Polygon" + this.polygonDataCount;
            data.type = "Polygon";
            data.name = this.defaultPolygonParam.name + this.polygonDataCount;
            data.position = position;
            data.vertices = vertices;
            data.note = "";
            data.startTime = { year:2000, month:1, day:1, enable:false };
            data.endTime   = { year:2000, month:1, day:1, enable:false };          
            data.color = [ col[0], col[1], col[2] ]; 
            data.keywords = [];
            ++this.polygonDataCount;

            addObject( objName, data );
        }        
    }
}

NewDataManager.prototype.assignObjName = function (type)
{
    let name = "";
    
    if( type == "BarGraph" )
    {
        name = "BarGraph" + this.barGraphDataCount;
        ++this.barGraphDataCount;
    }   
    else if( type == "Point" )
    {
        name = "Point" + this.pointDataCount;
        ++this.pointDataCount;
    }   
    else if( type == "Arc" )
    {
        name = "Arc" + this.arcDataCount;
        ++this.arcDataCount;
    }
    else if( type == "Line" )
    {
        name = "Line" + this.lineDataCount;
        ++this.lineDataCount;
    }   
    else if( type == "Polygon" )
    {
        name = "Polygon" + this.polygonDataCount;
        ++this.polygonDataCount;
    }

    return name;
}

NewDataManager.prototype.setDefalutParameter = function (type, param)
{
    if( type == "BarGraph" )
    {
        this.defaultBarGraphParam.name   = param.name;
        this.defaultBarGraphParam.height = param.height;
        this.defaultBarGraphParam.size   = param.size;
        this.defaultBarGraphParam.color  = param.color;
        let obj = g_webGLView.getGLObject( "tempCube" );  
        obj.setScale( [ param.size, param.height, param.size ] );
        obj.setColor( param.color[0], param.color[1], param.color[2], 1.0 );
    }   
    else if( type == "Arc" )
    {
        this.defaultArcParam.name   = param.name;
        this.defaultArcParam.size   = param.size;
        this.defaultArcParam.height = param.height;
        this.defaultArcParam.color  = param.color;
        let obj = g_webGLView.getGLObject( "tempArc" );  
        obj.setHeight( param.height );
        obj.setWidth( param.size );  
        obj.setColor( param.color[0], param.color[1], param.color[2], 1.0 );
    }   
    else if( type == "Point" )
    {
        this.defaultPointParam.name = param.name;
        this.defaultPointParam.size = param.size;
        // this.defaultPointParam.icon = param.icon;
        let obj = g_webGLView.getGLObject( "tempPointImage" );  
        obj.setScale( [ param.size, param.size, param.size ] );        
        // obj.setTexture( data.icon );
    }
    else if( type == "Line" )
    {
        this.defaultLineParam.name      = param.name;
        this.defaultLineParam.width     = param.width;
        this.defaultLineParam.showArrow = param.showArrow;
        this.defaultLineParam.color     = param.color;
    }   
    else if( type == "Polygon" )
    {
        this.defaultPolygonParam.name  = param.name;
        this.defaultPolygonParam.color = param.color;
    }
}

NewDataManager.prototype.getDefalutParameter = function ()
{
    let param = {}
    param["BarGraph"] = this.defaultBarGraphParam
    param["Arc"] = this.defaultArcParam
    param["Point"] = this.defaultPointParam
    param["Line"] = this.defaultLineParam
    param["Polygon"] = this.defaultPolygonParam
    return param;
}