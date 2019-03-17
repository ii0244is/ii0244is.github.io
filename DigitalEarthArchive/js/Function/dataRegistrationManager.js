
dataRegistrationManager = function ()
{
    this.buttonRectList = {};
    this.registrationCallback = null;
    this.lastMousePos = [ 0, 0 ];

    // Bar Graph
    this.barGraphDataCount = 0;
    this.startBarGraphDataRegistration = false;
    this.moveTemporaryBarGraph = false;

    // Point    
    this.pointDataCount = 0;
    this.startPointDataRegistration = false;    
    this.moveTemporaryPoint = false;

    // Arc    
    this.arcDataCount = 0;
    this.startArcDataRegistration = false;    
    this.moveTemporaryArcStart = false;
    this.moveTemporaryArcEnd = false;
    this.arcStartPos = [0.0, 0.0]; 

    // Line
    this.lineDataCount = 0; 
    this.startLineDataRegistration = false;
    this.addLineVertex = false;
    this.tempLine = null;
    this.lineVertices = [];

    // Polygon
    this.polygonDataCount = 0; 
    this.startPolygonDataRegistration = false;    
    this.addPolygonVertex = false;
    this.tempPolygonSides = null;
    this.polygonVertices = [];

    let grid = new glObjectGrid(g_webGLView, -200, -200, 0, 40, 40, 10);
    grid.attachShader("grid");
    grid.setColor( 0.2, 0.2, 0.2, 1.0 );
    grid.setVisible( false );
    g_webGLView.addGLObject("grid", grid);    

    let buttonAddBarGraph = new glObject2DButton(g_webGLView);
    buttonAddBarGraph.attachShader("imageButton2D");
    buttonAddBarGraph.setPosition( 20, 20, 50, 50 );
    buttonAddBarGraph.setImage(g_webGLView.context, "image/addBarGraph.png", function(){});
    g_webGLView.addGLObject("buttonAddBarGraph", buttonAddBarGraph);    
    this.buttonRectList["addBarGraph"] = new rect( 20, 20, 50, 50 );

    let popupTextAddBarGraph = new glObject2DImage(g_webGLView);
    popupTextAddBarGraph.attachShader("image2D");
    popupTextAddBarGraph.setPosition( 80, 28, 140, 36 );
    popupTextAddBarGraph.setVisible( false );
    popupTextAddBarGraph.setImage(g_webGLView.context, "image/popupText_addBarGraph.png", function(){});
    g_webGLView.addGLObject("popupTextAddBarGraph", popupTextAddBarGraph);
    
    let buttonAddPoint = new glObject2DButton(g_webGLView);
    buttonAddPoint.attachShader("imageButton2D");
    buttonAddPoint.setPosition( 20, 80, 50, 50 );
    buttonAddPoint.setImage(g_webGLView.context, "image/addPoint.png", function(){});
    g_webGLView.addGLObject("buttonAddPoint", buttonAddPoint);    
    this.buttonRectList["addPoint"] = new rect( 20, 80, 50, 50 );

    let popupTextAddPoint = new glObject2DImage(g_webGLView);
    popupTextAddPoint.attachShader("image2D");
    popupTextAddPoint.setPosition( 80, 88, 140, 36 );
    popupTextAddPoint.setVisible( false );
    popupTextAddPoint.setImage(g_webGLView.context, "image/popupText_addPoint.png", function(){});
    g_webGLView.addGLObject("popupTextAddPoint", popupTextAddPoint);

    let buttonAddArc = new glObject2DButton(g_webGLView);
    buttonAddArc.attachShader("imageButton2D");
    buttonAddArc.setPosition( 20, 140, 50, 50 );
    buttonAddArc.setImage(g_webGLView.context, "image/addArc.png", function(){});
    g_webGLView.addGLObject("buttonAddArc", buttonAddArc);    
    this.buttonRectList["addArc"] = new rect( 20, 140, 50, 50 );

    let popupTextAddArc = new glObject2DImage(g_webGLView);
    popupTextAddArc.attachShader("image2D");
    popupTextAddArc.setPosition( 80, 148, 140, 36 );
    popupTextAddArc.setVisible( false );
    popupTextAddArc.setImage(g_webGLView.context, "image/popupText_addArc.png", function(){});
    g_webGLView.addGLObject("popupTextAddArc", popupTextAddArc);

    let buttonAddLine = new glObject2DButton(g_webGLView);
    buttonAddLine.attachShader("imageButton2D");
    buttonAddLine.setPosition( 20, 200, 50, 50 );
    buttonAddLine.setImage(g_webGLView.context, "image/addLine.png", function(){});
    g_webGLView.addGLObject("buttonAddLine", buttonAddLine);    
    this.buttonRectList["addLine"] = new rect( 20, 200, 50, 50 );

    let popupTextAddLine = new glObject2DImage(g_webGLView);
    popupTextAddLine.attachShader("image2D");
    popupTextAddLine.setPosition( 80, 208, 140, 36 );
    popupTextAddLine.setVisible( false );
    popupTextAddLine.setImage(g_webGLView.context, "image/popupText_addLine.png", function(){});
    g_webGLView.addGLObject("popupTextAddLine", popupTextAddLine);

    let buttonAddPolygon = new glObject2DButton(g_webGLView);
    buttonAddPolygon.attachShader("imageButton2D");
    buttonAddPolygon.setPosition( 20, 260, 50, 50 );
    buttonAddPolygon.setImage(g_webGLView.context, "image/addPolygon.png", function(){});
    g_webGLView.addGLObject("buttonAddPolygon", buttonAddPolygon);    
    this.buttonRectList["addPolygon"] = new rect( 20, 260, 50, 50 );

    let popupTextAddPolygon = new glObject2DImage(g_webGLView);
    popupTextAddPolygon.attachShader("image2D");
    popupTextAddPolygon.setPosition( 80, 268, 140, 36 );
    popupTextAddPolygon.setVisible( false );
    popupTextAddPolygon.setImage(g_webGLView.context, "image/popupText_addPolygon.png", function(){});
    g_webGLView.addGLObject("popupTextAddPolygon", popupTextAddPolygon);    

    this.tempCube = new glObjectCube(g_webGLView);
    this.tempCube.setPosition( [ 0.0, 0.0, 0.0 ] );
    this.tempCube.setScale( [ 1.5, 10.0, 1.5 ] ); 
    this.tempCube.setColor( 0.8, 0.2, 0.2, 0.5 );
    this.tempCube.setSelect( true );    
    this.tempCube.setVisible( false );
    this.tempCube.attachShader("lighting");
    g_webGLView.addGLObject("tempCube", this.tempCube);

    this.tempImage = new glObjectImage(g_webGLView);
    this.tempImage.setImage(g_webGLView.context, "image/pointer.png", function(){});
    this.tempImage.setPosition( [ 0.0, 0.0, 0.0 ] );
    this.tempImage.setScale( [ 2.5, 2.5, 2.5 ] );
    this.tempImage.setSelect( true );    
    this.tempImage.setVisible( false );
    this.tempImage.setBillboardMode( true );    
    this.tempImage.attachShader("image");
    g_webGLView.addGLObject("tempImage", this.tempImage);

    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];    
    this.tempPointer = new glObjectPointer(g_webGLView);
    this.tempPointer.setPosition( [ 10000.0, 10000.0, 10000.0 ] );
    this.tempPointer.setScale( scale ); 
    this.tempPointer.setColor( 1.0, 0.0, 0.0, 1.0 );
    this.tempPointer.setSelect( true );    
    this.tempPointer.setVisible( false );
    this.tempPointer.attachShader("singleColor");
    g_webGLView.addGLObject("tempPointer", this.tempPointer);

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
    this.tempArc.setHeight( 30 ); 
    this.tempArc.setColor( 1.0, 0.0, 0.0, 1.0 );
    this.tempArc.setSelect( true );    
    this.tempArc.setVisible( false );
    this.tempArc.attachShader("arc");
    g_webGLView.addGLObject("tempArc", this.tempArc);
}

dataRegistrationManager.prototype.setRegistrationCallback = function ( callback )
{
    this.registrationCallback = callback;
}

dataRegistrationManager.prototype.mousedown = function ( x, y, isTouch, buttonType )
{
    let isDblClick = false;
    if( this.lastMousePos[0] == x && this.lastMousePos[1] == y ){
        isDblClick = true;
    }
    this.lastMousePos[0] = x;
    this.lastMousePos[1] = y;

    // bar graph data
    if( this.buttonRectList["addBarGraph"].isInsideRect( x, y ) )
    {
        if( isTouch ){
            this.moveTemporaryBarGraph = true;
            this.startBarGraphDataRegistration = false;
        }else{
            this.startBarGraphDataRegistration = true;              
        }
        changeState( "addData" );
        return true;
    }
    else if( this.moveTemporaryBarGraph )
    {
        changeState( "normal" );
        this.tempCube.setVisible( false );
        this.tempCube.setPosition([-10000, -10000, -10000]);  
        this.startBarGraphDataRegistration = false;
        this.moveTemporaryBarGraph = false;
        ++this.barGraphDataCount;

        if( this.registrationCallback )
        {
            let data = {};
            data.type = "BarGraph";
            data.name = "BarGraph" + this.barGraphDataCount;
            data.position = calcHitPoint( x, y );
            data.value = "";
            data.memo = "";
            data.startTime = "";
            data.endTime = "";   
            data.height = 10.0;            
            data.size = 1.5;
            data.color = [0.8, 0.2, 0.2]; 
            data.keywords = [];            
            this.registrationCallback( data );
        }

        this.resetButtonState();
    }


    // point data
    if( this.buttonRectList["addPoint"].isInsideRect( x, y ) )
    {
        if( isTouch ){
            this.moveTemporaryPoint = true;
            this.startPointDataRegistration = false;
        }else{
            this.startPointDataRegistration = true;
        }        
        changeState( "addData" );
        return true;
    }
    else if( this.moveTemporaryPoint )    
    {
        changeState( "normal" );
        this.tempImage.setVisible( false );
        this.tempImage.setPosition([-10000, -10000, -10000]);  
        this.startPointDataRegistration = false;
        this.moveTemporaryPoint = false;
        ++this.pointDataCount;

        if( this.registrationCallback )
        {
            let data = {};
            data.type = "Point";
            data.name = "Point" + this.pointDataCount;
            data.position = calcHitPoint( x, y );
            data.value = "";
            data.memo = "";
            data.startTime = "";
            data.endTime = "";   
            data.size  = 2.5;
            data.icon  = "pointerRed";
            data.keywords = [];            
            this.registrationCallback( data );
        }
    }


    // arc data
    if( this.buttonRectList["addArc"].isInsideRect( x, y ) )
    {
        if( isTouch ){
            this.moveTemporaryArcStart = true;
            this.startArcDataRegistration = false;
        }else{
            this.startArcDataRegistration = true;
        }                   
        changeState( "addData" );
        return true;
    }
    else if( this.moveTemporaryArcStart )    
    {
        this.moveTemporaryArcStart = false;
        this.moveTemporaryArcEnd = true;
        return true;
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
        ++this.arcDataCount;

        if( this.registrationCallback )
        {
            let data = {};
            let pos = calcHitPoint( x, y );
            data.type = "Arc";
            data.name = "Arc" + this.arcDataCount;
            data.startPosition = [ this.arcStartPos[0], this.arcStartPos[1] ];
            data.endPosition = [ pos[0], pos[2] ];
            data.value = "";
            data.memo = "";
            data.startTime = "";
            data.endTime = "";            
            data.size = 1;
            data.height = 30;
            data.color = [0.8, 0.2, 0.2]; 
            data.keywords = [];
            this.registrationCallback( data );
        }
    }

    // line data
    if( this.buttonRectList["addLine"].isInsideRect( x, y ) )
    {
        if( isTouch ){
            this.addLineVertex = true;
            this.startLineDataRegistration = false;
        }else{
            this.startLineDataRegistration = true;
        }                   
        changeState( "addData" );
        return true;
    }
    else if( this.addLineVertex ) 
    {
        if( buttonType == 0 && !isDblClick ){
            let vertexPos = calcHitPoint( x, y );
            let startPos2D = [ vertexPos[0], vertexPos[2] ];
            this.tempLine = new glObjectStraightLine(g_webGLView);
            this.tempLine.setPosition( startPos2D, startPos2D );
            this.tempLine.attachShader("singleColor");
            this.tempLine.setColor( 1.0, 0.2, 0.2, 1.0 );
            this.tempLine.setVisible( true );
            let name = "tempLine" + this.lineVertices.length;
            g_webGLView.addGLObject(name, this.tempLine); 
            this.lineVertices.push( startPos2D );
        }
        else if( buttonType == 2 || isDblClick ){
            let vertexPos = calcHitPoint( x, y );
            let endPos = [ vertexPos[0], vertexPos[2] ];
            this.lineVertices.push( endPos );

            changeState( "normal" );
            this.tempPointer.setPosition([-10000, -10000, -10000]);  
            this.tempPointer.setVisible( false );
            this.addLineVertex = false;
            this.startLineDataRegistration = false;
            this.tempLine = null;
            ++this.lineDataCount;

            let vertices = [];
            let position = [0, 0, 0];
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
            position[2] = (minZ + maxZ) / 2;            

            if( this.registrationCallback )
            {
                let data = {};

                data.type = "Line";
                data.name = "Line" + this.lineDataCount;
                data.position = position;
                data.vertices = vertices;
                data.value = "";
                data.memo = "";
                data.startTime = "";
                data.endTime = "";            
                data.width = 0.5;
                data.showArrow = false;                
                data.height = 30;
                data.color = [0.8, 0.2, 0.2]; 
                data.keywords = [];

                this.registrationCallback( data );
            }
        }
    }


    // polygon data
    if( this.buttonRectList["addPolygon"].isInsideRect( x, y ) )
    {
        if( isTouch ){
            this.addPolygonVertex = true;
            this.startPolygonDataRegistration = false;
        }else{
            this.startPolygonDataRegistration = true;
        }                   
        changeState( "addData" );
        return true;
    }
    else if( this.addPolygonVertex ) 
    {
        if( buttonType == 0 && !isDblClick ){
            let vertexPos = calcHitPoint( x, y );
            let startPos2D = [ vertexPos[0], vertexPos[2] ];
            this.tempPolygonSides = new glObjectStraightLine(g_webGLView);
            this.tempPolygonSides.setPosition( startPos2D, startPos2D );
            this.tempPolygonSides.attachShader("singleColor");
            this.tempPolygonSides.setColor( 1.0, 0.2, 0.2, 1.0 );
            this.tempPolygonSides.setVisible( true );
            let name = "tempLine" + this.polygonVertices.length;
            g_webGLView.addGLObject(name, this.tempPolygonSides); 
            this.polygonVertices.push( startPos2D );
        }
        else if( buttonType == 2 || isDblClick ){
            let vertexPos = calcHitPoint( x, y );
            let endPos = [ vertexPos[0], vertexPos[2] ];
            this.polygonVertices.push( endPos );

            changeState( "normal" );
            this.tempPointer.setPosition([-10000, -10000, -10000]);  
            this.tempPointer.setVisible( false );
            this.addPolygonVertex = false;
            this.startLineDataRegistration = false;
            this.tempPolygonSides = null;
            ++this.polygonDataCount;

            let vertices = [];
            let position = [0, 0, 0];
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
            position[2] = (minZ + maxZ) / 2;      

            if( this.registrationCallback )
            {
                let data = {};

                data.type = "Polygon";
                data.name = "Polygon" + this.polygonDataCount;
                data.position = position;
                data.vertices = vertices;
                data.value = "";
                data.memo = "";
                data.startTime = "";
                data.endTime = "";            
                data.width = 1;
                data.height = 1;
                data.color = [0.8, 0.2, 0.2]; 
                data.keywords = [];

                this.registrationCallback( data );
            }
        }
    }

    return false;
}

dataRegistrationManager.prototype.mousemove = function ( x, y )
{
    // bar graph data.
    if( this.startBarGraphDataRegistration )
    {
        if( !this.buttonRectList["addBarGraph"].isInsideRect( x, y ) && this.moveTemporaryBarGraph == false )
        {
            this.moveTemporaryBarGraph = true;
            this.startBarGraphDataRegistration = false;
        }
        return true; 
    }
    else if( this.moveTemporaryBarGraph )
    {
        let pos = calcHitPoint( x, y );
        this.tempCube.setPosition( pos );   
        this.tempCube.setVisible( true );
        return true;         
    }    


    // point data.
    if( this.startPointDataRegistration )
    {
        if( !this.buttonRectList["addPoint"].isInsideRect( x, y ) && this.moveTemporaryPoint == false )
        {
            this.moveTemporaryPoint = true;
            this.startPointDataRegistration = false;
        }
        return true; 
    }
    else if( this.moveTemporaryPoint )
    {
        let pos = calcHitPoint( x, y );
        pos[1] = 2.5;
        this.tempImage.setPosition( pos );   
        this.tempImage.setVisible( true );
        return true;         
    }    


    // arc data.
    if( this.startArcDataRegistration )
    {
        if( !this.buttonRectList["addArc"].isInsideRect( x, y ) && this.moveTemporaryArcStart == false )
        {
            this.moveTemporaryArcStart = true;
            this.startArcDataRegistration = false;
        }
        return true; 
    }
    else if( this.moveTemporaryArcStart )
    {
        let pos = calcHitPoint( x, y );
        this.tempArcStart.setPosition( pos );   
        this.tempArcStart.setVisible( true );
        this.arcStartPos[0] = pos[0];
        this.arcStartPos[1] = pos[2];        
        return true;         
    }  
    else if( this.moveTemporaryArcEnd )
    {
        let pos = calcHitPoint( x, y );
        this.tempArcEnd.setPosition( pos );   
        this.tempArcEnd.setVisible( true );
        this.tempArc.setPosition( this.arcStartPos, [ pos[0], pos[2] ] );  
        this.tempArc.setVisible( true );
        return true;         
    }  


    // line data.
    if( this.startLineDataRegistration )
    {
        if( !this.buttonRectList["addLine"].isInsideRect( x, y ) && this.addLineVertex == false )
        {
            this.addLineVertex = true;
            this.startLineDataRegistration = false;
            this.tempPointer.setVisible( true );
        }
        return true; 
    }
    else if( this.addLineVertex && ( this.tempLine == null ) )
    {
        let pos = calcHitPoint( x, y );
        this.tempPointer.setPosition( pos );   
        return true;         
    }       
    else if( this.addLineVertex && this.tempLine )
    {
        let startPos = this.lineVertices[ this.lineVertices.length - 1 ];
        let pos = calcHitPoint( x, y );
        let endPos = [ pos[0], pos[2] ];
        this.tempLine.setPosition( startPos, endPos );
        this.tempPointer.setPosition( pos );   
        return true;         
    }   


    // polygon data.
    if( this.startPolygonDataRegistration )
    {
        if( !this.buttonRectList["addPolygon"].isInsideRect( x, y ) && this.addPolygonVertex == false )
        {
            this.addPolygonVertex = true;
            this.startPolygonDataRegistration = false;
            this.tempPointer.setVisible( true );
        }
        return true; 
    }
    else if( this.addPolygonVertex && ( this.tempPolygonSides == null ) )
    {
        let pos = calcHitPoint( x, y );
        this.tempPointer.setPosition( pos );   
        return true;           
    }       
    else if( this.addPolygonVertex && this.tempPolygonSides )
    {
        let startPos = this.polygonVertices[ this.polygonVertices.length - 1 ];
        let pos = calcHitPoint( x, y );
        let endPos = [ pos[0], pos[2] ];
        this.tempPolygonSides.setPosition( startPos, endPos );
        this.tempPointer.setPosition( pos );   
        return true;         
    }   

    this.resetButtonState();
    if( this.buttonRectList["addBarGraph"].isInsideRect( x, y ) )
    {
        g_webGLView.getGLObject("buttonAddBarGraph").setState(1);
        g_webGLView.getGLObject("popupTextAddBarGraph").setVisible( true );
    }
    else if( this.buttonRectList["addPoint"].isInsideRect( x, y ) )
    {
        g_webGLView.getGLObject("buttonAddPoint").setState(1);
        g_webGLView.getGLObject("popupTextAddPoint").setVisible( true );
    }
    else if( this.buttonRectList["addArc"].isInsideRect( x, y ) )
    {
        g_webGLView.getGLObject("buttonAddArc").setState(1);
        g_webGLView.getGLObject("popupTextAddArc").setVisible( true );
    }
    else if( this.buttonRectList["addLine"].isInsideRect( x, y ) )
    {
        g_webGLView.getGLObject("buttonAddLine").setState(1);
        g_webGLView.getGLObject("popupTextAddLine").setVisible( true );
    }
    else if( this.buttonRectList["addPolygon"].isInsideRect( x, y ) )
    {
        g_webGLView.getGLObject("buttonAddPolygon").setState(1);
        g_webGLView.getGLObject("popupTextAddPolygon").setVisible( true );
    }    

    return false;   
}

dataRegistrationManager.prototype.mouseup = function ( x, y )
{
}

dataRegistrationManager.prototype.mouseout = function ( x, y )
{
}

dataRegistrationManager.prototype.mousewheel = function ()
{
    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];
    this.tempPointer.setScale(scale);
    this.tempArcStart.setScale(scale);
    this.tempArcEnd.setScale(scale);
    return false;
}

dataRegistrationManager.prototype.assignObjName = function (type)
{
    let name = "";
    if( type == "BarGraph" )
    {
        ++this.barGraphDataCount;
        name = "BarGraph" + this.barGraphDataCount;
    }   
    else if( type == "Point" )
    {
        ++this.pointDataCount;
        name = "Point" + this.pointDataCount;
    }   
    else if( type == "Arc" )
    {
        ++this.arcDataCount;
        name = "Arc" + this.arcDataCount;
    }
    else if( type == "Line" )
    {
        ++this.lineDataCount;
        name = "Line" + this.lineDataCount;
    }   
    else if( type == "Polygon" )
    {
        ++this.polygonDataCount;
        name = "Polygon" + this.polygonDataCount;
    }

    return name;
}

dataRegistrationManager.prototype.resetButtonState = function ()
{
    g_webGLView.getGLObject("buttonAddBarGraph").setState(0);
    g_webGLView.getGLObject("buttonAddPoint").setState(0);        
    g_webGLView.getGLObject("buttonAddArc").setState(0); 
    g_webGLView.getGLObject("buttonAddLine").setState(0);    
    g_webGLView.getGLObject("buttonAddPolygon").setState(0);    
    
    g_webGLView.getGLObject("popupTextAddBarGraph").setVisible( false );
    g_webGLView.getGLObject("popupTextAddPoint").setVisible( false );    
    g_webGLView.getGLObject("popupTextAddArc").setVisible( false );   
    g_webGLView.getGLObject("popupTextAddLine").setVisible( false );   
    g_webGLView.getGLObject("popupTextAddPolygon").setVisible( false );   
}