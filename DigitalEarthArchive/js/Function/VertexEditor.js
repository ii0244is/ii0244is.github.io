
VertexEditor = function()
{
    this.isEditing = false;
    this.vertices = [];
    this.data = {};
    this.dataName = "";
    this.dataType = "";

    this.selectedVertexIdx = -1;
    this.tempLines = [];
    this.lineIdCounter = 0;
    this.tempVertices = [];
    this.vertexIdCounter = 0;
}

VertexEditor.prototype.start = function( name )
{
    this.isEditing = true;
    let data = g_dataList[name];    
    let col = data.color;
    let vertexArray = data.vertices;
    console.log( name, data );

    // オブジェクト削除
    deleteObject( name );

    // 頂点編集モード
    changeState( "moveData" );
    g_settingArea.changeSettingView( "VertexEdit" );

    // スケール
    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];   

    // 頂点を生成
    for( let i in vertexArray ){
        let pos = vertexArray[i];
        let vertex = new glObjectPlane(g_webGLView);
        vertex.setPosition( [ pos[0], 0.0, -pos[1] ] );
        vertex.setScale( scale ); 
        vertex.setColor( col[0], col[1], col[2], 1.0 );
        vertex.setSelect( false );    
        vertex.setVisible( true );    
        vertex.attachShader("polygon");        
        let vertexName = "tempVertex" + this.vertexIdCounter;
        g_webGLView.addGLObject(vertexName, vertex);
        ++this.vertexIdCounter;

        this.tempVertices.push( {
            name : vertexName,
            pos  : [ pos[0], 0.0, -pos[1] ],
        } );
    }

    let numLines = vertexArray.length - 1;
    if( data.type === "Polygon" ){
        numLines = vertexArray.length;
    }

    // 線を生成
    for( let i = 0; i < numLines; ++i ){
        let startPos = vertexArray[i];
        let stopPos;
        if( i + 1 === vertexArray.length ){
            stopPos = vertexArray[0];
        }else{
            stopPos = vertexArray[i + 1];
        }
        let line = new glObjectStraightLine(g_webGLView);
        line.setPosition( [ startPos[0], -startPos[1] ], [ stopPos[0], -stopPos[1] ] );
        line.attachShader("singleColor");
        line.setColor( col[0], col[1], col[2], 1.0 );
        line.setVisible( true );
        let lineName = "tempVertexLine" + this.lineIdCounter;
        g_webGLView.addGLObject(lineName, line);
        ++this.lineIdCounter;

        this.tempLines.push( {
            name     : lineName,
            startPos : [ startPos[0], -startPos[1] ],
            stopPos  : [ stopPos[0], -stopPos[1] ],
        } );        
    }

    this.dataName = name;
    this.data = data;
    this.dataType = data.type;
    let lon = this.tempVertices[0].pos[0];
    let lat = -this.tempVertices[0].pos[2];
    g_settingArea.setVertexInfo( 0, lon, lat );
    this.selectedVertexIdx = 0;
}

VertexEditor.prototype.finish = function()
{
    for( let i in this.tempLines ){
        let lineName = this.tempLines[i].name;
        g_webGLView.deleteGLObject( lineName );
    }

    this.data.vertices = [];
    let minX = 10000, maxX = -10000;
    let minZ = 10000, maxZ = -10000;    
    for( let i in this.tempVertices ){
        let lon = this.tempVertices[i].pos[0];
        let lat = -this.tempVertices[i].pos[2];
        this.data.vertices.push( [ lon, lat ] );
        if( lon < minX ) minX = lon;
        if( lat < minZ ) minZ = lat;
        if( maxX < lon ) maxX = lon;
        if( maxZ < lat ) maxZ = lat;
        let vertName = this.tempVertices[i].name;
        g_webGLView.deleteGLObject( vertName );
    }
    this.data.position[0] = (minX + maxX) / 2;
    this.data.position[1] = (minZ + maxZ) / 2;

    this.tempLines = [];
    this.tempVertices = [];
    this.lineIdCounter = 0;
    this.vertexIdCounter = 0;    

    addObject( this.dataName, this.data );
    this.isEditing = false;
    changeState( "normal" );
}

VertexEditor.prototype.mousedown = function( x, y, name )
{
    if( !this.isEditing ) return false;

    let idx = -1;
    for( let i in this.tempVertices ){
        if( this.tempVertices[i].name === name ){
            idx = i;
            this.isMoving = true;
            break;
        }
    }

    if( idx >= 0 && this.selectedVertexIdx >= 0 ){
        let prevTargetName = this.tempVertices[ this.selectedVertexIdx ].name;
        let prevTarget = g_webGLView.getGLObject( prevTargetName );
        prevTarget.setSelect( false );
    }

    if( idx >= 0 ){
        this.selectedVertexIdx = Number( idx );
    }    

    if( this.selectedVertexIdx >= 0 ){
        let targetName = this.tempVertices[ this.selectedVertexIdx ].name;
        let pos = this.tempVertices[ this.selectedVertexIdx ].pos;
        let target = g_webGLView.getGLObject( targetName );
        target.setSelect( true );
        g_settingArea.setVertexInfo( this.selectedVertexIdx, pos[0], -pos[2] );
    }

    return true;
}

VertexEditor.prototype.mousemove = function( x, y )
{
    if( !this.isEditing ) return false;
    if( this.selectedVertexIdx === -1 ) return false;
    if( !this.isMoving ) return false;

    let vertexName = this.tempVertices[ this.selectedVertexIdx ].name;
    let vertex = g_webGLView.getGLObject( vertexName );
    let pos = calcHitPoint( x, y );
    vertex.setPosition( pos );
    this.tempVertices[ this.selectedVertexIdx ].pos[0] = pos[0];
    this.tempVertices[ this.selectedVertexIdx ].pos[2] = pos[2];

    g_settingArea.setVertexInfo( this.selectedVertexIdx, pos[0], -pos[2] );

    let line1 = null;
    let line2 = null;

    if( this.selectedVertexIdx === 0 ){
        if( this.data.type === "Polygon" ){
            line1 = this.tempLines[ this.tempVertices.length - 1 ];
            line2 = this.tempLines[ this.selectedVertexIdx ];    
        }else if( this.data.type === "Line" ){
            line2 = this.tempLines[ this.selectedVertexIdx ];
        }
    }else if( this.selectedVertexIdx === this.tempVertices.length ){
        if( this.data.type === "Polygon" ){
            line1 = this.tempLines[ this.selectedVertexIdx - 1 ];
            line2 = this.tempLines[ this.selectedVertexIdx ];
        }else if( this.data.type === "Line" ){
            line1 = this.tempLines[ this.selectedVertexIdx - 1 ];
        }
    }else{
        line1 = this.tempLines[ this.selectedVertexIdx - 1 ];
        line2 = this.tempLines[ this.selectedVertexIdx ];
    }

    if( line1 ){
        let line1Obj = g_webGLView.getGLObject( line1.name );
        line1.stopPos = [ pos[0], pos[2] ];
        line1Obj.setPosition( line1.startPos ,line1.stopPos );
    }

    if( line2 ){
        let line2Obj = g_webGLView.getGLObject( line2.name );
        line2.startPos = [ pos[0], pos[2] ];
        line2Obj.setPosition( line2.startPos ,line2.stopPos );
    }    

    return true;
}

VertexEditor.prototype.mouseup = function()
{
    if( !this.isEditing ) return false;
    this.isMoving = false;
}

VertexEditor.prototype.mousewheel = function()
{
    if( !this.isEditing ) return false;

    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];
    for( let i in this.tempVertices ){
        let name =  this.tempVertices[i].name;
        let obj = g_webGLView.getGLObject( name );
        obj.setScale(scale);
    }

    return true;
}

VertexEditor.prototype.insertVertex = function()
{
    // ラインの場合、最後尾には追加できない
    if( this.dataType === "Line" && 
        this.selectedVertexIdx === this.tempVertices.length - 1 ) {
        return;
    }

    let v1 = this.tempVertices[ this.selectedVertexIdx ];
    let v2 = 0;
    if( this.selectedVertexIdx === this.tempVertices.length - 1 ){
        v2 = this.tempVertices[ 0 ];
    }else{
        v2 = this.tempVertices[ this.selectedVertexIdx + 1 ];
    }

    // 頂点追加
    let newPosX = ( v1.pos[0] + v2.pos[0] ) / 2;
    let newPosZ = ( v1.pos[2] + v2.pos[2] ) / 2;

    let vertexName = "tempVertex" + this.vertexIdCounter;
    ++this.vertexIdCounter;
    let newVertex = {
        name : vertexName,
        pos  : [ newPosX, 0.0, newPosZ ],
    }
    this.tempVertices.splice( this.selectedVertexIdx + 1, 0, newVertex );

    // 頂点オブジェクト追加
    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];  
    let col = this.data.color;
    let vertex = new glObjectPlane(g_webGLView);
    vertex.setPosition( newVertex.pos );
    vertex.setScale( scale );
    vertex.setColor( col[0], col[1], col[2], 1.0 );
    vertex.setSelect( false );    
    vertex.setVisible( true );    
    vertex.attachShader("polygon");
    g_webGLView.addGLObject(vertexName, vertex);

    // ライン修正
    let line = this.tempLines[ this.selectedVertexIdx ];
    line.stopPos = [ newPosX, newPosZ ];

    // ラインオブジェクト修正
    let lineObj = g_webGLView.getGLObject( line.name );
    lineObj.setPosition( line.startPos, line.stopPos );

    // ライン追加
    let startPos = line.stopPos;
    let stopPos = [];
    if( this.dataType === "Polygon" ){
        if( this.selectedVertexIdx === this.tempLines.length - 1 ){
            stopPos = this.tempLines[ 0 ].startPos;
        }else{
            stopPos = this.tempLines[ this.selectedVertexIdx + 1 ].startPos;
        }
    }else if( this.dataType === "Line" ){
        if( this.selectedVertexIdx === this.tempLines.length - 1 ){
            stopPos = [ v2.pos[0], v2.pos[2] ];
        }else{
            stopPos = this.tempLines[ this.selectedVertexIdx + 1 ].startPos;
        }
    }
    let lineName = "tempVertexLine" + this.lineIdCounter;
    ++this.lineIdCounter;
    let newLine = {
        name     : lineName,
        startPos : [ startPos[0], startPos[1] ],
        stopPos  : [ stopPos[0], stopPos[1] ],
    }
    this.tempLines.splice( this.selectedVertexIdx + 1, 0, newLine );

    // ラインオブジェクト追加
    let newLineObj = new glObjectStraightLine(g_webGLView);
    newLineObj.setPosition( [ startPos[0], startPos[1] ], [ stopPos[0], stopPos[1] ] );
    newLineObj.attachShader("singleColor");
    newLineObj.setColor( col[0], col[1], col[2], 1.0 );
    newLineObj.setVisible( true );
    g_webGLView.addGLObject(lineName, newLineObj);    

    console.log( this.tempVertices, this.tempLines)
}

VertexEditor.prototype.deleteVertex = function()
{
    if( this.dataType === "Line" && this.tempVertices.length <= 2 ) {
        return;
    }

    if( this.dataType === "Polygon" && this.tempVertices.length <= 3 ) {
        return;
    }

    // 頂点削除
    let vertexName = this.tempVertices[ this.selectedVertexIdx ].name;
    g_webGLView.deleteGLObject( vertexName );
    this.tempVertices.splice( this.selectedVertexIdx, 1 );

    // ラインの修正
    if( this.dataType === "Line" && this.selectedVertexIdx === 0 ) {
        // ラインで最初の頂点の場合
        // 何もしない
    }else if( this.dataType === "Line" && this.selectedVertexIdx === this.tempLines.length ) {
        // ラインで最後の頂点の場合
        --this.selectedVertexIdx;
    }else if( this.dataType ===  "Polygon" && this.selectedVertexIdx === 0 ) {
        // ポリゴンで最初の頂点の場合
        let line = this.tempLines[ this.tempLines.length - 1 ];
        line.stopPos = this.tempLines[ this.selectedVertexIdx ].stopPos;
        let lineObj = g_webGLView.getGLObject( line.name );
        lineObj.setPosition( line.startPos, line.stopPos );
    }else{
        let line = this.tempLines[ this.selectedVertexIdx - 1 ];
        line.stopPos = this.tempLines[ this.selectedVertexIdx ].stopPos;
        let lineObj = g_webGLView.getGLObject( line.name );
        lineObj.setPosition( line.startPos, line.stopPos );
    }

    // ライン削除
    let lineName = this.tempLines[ this.selectedVertexIdx ].name;
    g_webGLView.deleteGLObject( lineName );
    this.tempLines.splice( this.selectedVertexIdx, 1 );

    // ポリゴンで最後の頂点の場合、選択を変更
    if( this.dataType === "Polygon" && this.selectedVertexIdx === this.tempLines.length ) {
        --this.selectedVertexIdx;
    }

    // 新しい頂点を選択
    let newVertexName = this.tempVertices[ this.selectedVertexIdx ].name;
    g_webGLView.getGLObject( newVertexName ).setSelect( true );
}