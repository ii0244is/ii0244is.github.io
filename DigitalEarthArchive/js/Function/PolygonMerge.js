
PolygonMerge = function()
{
    this.isEditing = false;

    this.namePolygon1 = "";
    this.timePolygon1 = {
        startTime : {},
        endTime : {},
    }
    this.namePolygon2 = "";    
    this.timePolygon2 = {
        startTime : {},
        endTime : {},
    }

    this.tempLines = [];
    this.tempVertices = [];
    this.vertexIdCounter = 0;  
    this.lineIdCounter = 0;  
}

PolygonMerge.prototype.start = function( name )
{
    // データ取得
    this.namePolygon1 = name;
    let data = g_dataList[this.namePolygon1];  
    console.log( data );

    // ポリゴンでなければ何もしない。
    if( data.type === "Polygon" ){
        this.isEditing = true;
    }else{
        this.isEditing = false;
        return;        
    }

    // 非表示にする
    this.hidePolygon( data, this.timePolygon1 );

    // 編集モード
    changeState( "moveData" );
    g_settingArea.changeSettingView( "VertexMerge" );

    // 頂点＆ライン生成
    let color = data.color;
    let vertexArray = data.vertices;    
    this.updateTmepVerticesAndLines( vertexArray, color );

    // g_settingArea.setVertexInfo( 0, lon, lat );
}

PolygonMerge.prototype.cancel = function()
{
    if( this.namePolygon1 in g_dataList ){
        let data1 = g_dataList[this.namePolygon1]; 
        this.showPolygon( data1, this.timePolygon1 );
    }

    if( this.namePolygon2 in g_dataList ){
        let data2 = g_dataList[this.namePolygon2]; 
        this.showPolygon( data2, this.timePolygon2 );        
    }

    this.deleteTmepVerticesAndLines();

    this.namePolygon1 = "";
    this.namePolygon2 = "";    
    this.isEditing = false;   
    changeState( "normal" );    
    g_settingArea.changeSettingView( "DataEditor" );
}

PolygonMerge.prototype.merge = function()
{
    if( this.tempVertices.length < 3 ){
        return;
    }

    // データ取得
    let data = g_dataList[this.namePolygon1];  
    this.showPolygon( data, this.timePolygon1 );

    // オブジェクト削除
    deleteObject(this.namePolygon1);
    deleteObject(this.namePolygon2);

    // 頂点取得
    data.vertices = [];
    let minX = 10000, maxX = -10000;
    let minZ = 10000, maxZ = -10000;    
    for( let i in this.tempVertices ){
        let lon = this.tempVertices[i].pos[0];
        let lat = -this.tempVertices[i].pos[2];
        data.vertices.push( [ lon, lat ] );
        if( lon < minX ) minX = lon;
        if( lat < minZ ) minZ = lat;
        if( maxX < lon ) maxX = lon;
        if( maxZ < lat ) maxZ = lat;
    }
    data.position[0] = (minX + maxX) / 2;
    data.position[1] = (minZ + maxZ) / 2;

    // オブジェクト追加
    addObject( this.namePolygon1, data );

    // リセット
    this.deleteTmepVerticesAndLines();
    this.namePolygon1 = "";
    this.namePolygon2 = "";    
    this.isEditing = false;   
    changeState( "normal" );    
    g_settingArea.changeSettingView( "DataEditor" );
}

PolygonMerge.prototype.mousedown = function( x, y, name )
{
    if( !this.isEditing ) return false;

    if( !name ){
        return true;
    }

    if( !(name in g_dataList) ){
        return true;
    }

    if( this.namePolygon2 in g_dataList ){
        let data = g_dataList[this.namePolygon2]; 
        this.showPolygon( data, this.timePolygon2 );        
    }

    this.namePolygon2 = name;
    let data2 = g_dataList[this.namePolygon2]; 
    if( data2.type !== "Polygon" ){
        return true;
    }
    this.hidePolygon( data2, this.timePolygon2 );

    this.createMergedVertexArray( this.namePolygon1, this.namePolygon2 );

    return true;
}

PolygonMerge.prototype.mousemove = function( x, y )
{
    return false;
}

PolygonMerge.prototype.mouseup = function()
{
    return false;
}

PolygonMerge.prototype.mousewheel = function()
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

PolygonMerge.prototype.showPolygon = function( data, time )
{
    for( let key in time.startTime ){
        data.startTime[key] = time.startTime[key];
    }
    for( let key in time.endTime ){
        data.endTime[key] = time.endTime[key];
    }
}

PolygonMerge.prototype.hidePolygon = function( data, time )
{
    // 表示期間を保存
    time.startTime.year   = data.startTime.year;
    time.startTime.month  = data.startTime.month;
    time.startTime.day    = data.startTime.day;
    time.startTime.enable = data.startTime.enable;
    time.endTime.year     = data.endTime.year;
    time.endTime.month    = data.endTime.month;
    time.endTime.day      = data.endTime.day;
    time.endTime.enable   = data.endTime.enable;   

    // 表示期間を操作して非表示にする
    data.startTime.year   = 1;
    data.startTime.month  = 1;
    data.startTime.day    = 2;
    data.startTime.enable = true;
    data.endTime.year     = 1;
    data.endTime.month    = 1;
    data.endTime.day      = 1;
    data.endTime.enable   = true; 
}

PolygonMerge.prototype.createMergedVertexArray = function( name1, name2 )
{
    function calcDistance( x1, y1, x2, y2 ){
        let diffX = Math.abs( x1 - x2 );
        let diffY = Math.abs( y1 - y2 );
        return Math.sqrt( diffX * diffX + diffY * diffY );
    }    

    function isVertexArrayCW( vertices ){
        let s = 0;
        for( let i = 0; i < vertices.length; ++i ){
            let x1 = vertices[i][0];
            let y1 = vertices[i][1];
            let x2, y2;
            if( i == vertices.length - 1 ){
                x2 = vertices[0][0];
                y2 = vertices[0][1];
            }else{
                x2 = vertices[i+1][0];
                y2 = vertices[i+1][1];
            }
            s += ( x1 + x2 ) * ( y2 - y1 );
        }
        if( s > 0 ){
            return true;
        }else{
            return false;
        }
    }

    let data1 = g_dataList[name1];  
    let vertexArray1 = data1.vertices;   
    let data2 = g_dataList[name2];  
    let vertexArray2 = data2.vertices;

    let idx1 = 0;
    let idx2 = 0;
    let minDistance = 10000000000000;
    for( let i in vertexArray1 ){
        for( let j in vertexArray2 ){
            let pos1 = vertexArray1[i];
            let pos2 = vertexArray2[j];
            let x1 = pos1[0];
            let y1 = -pos1[1];     
            let x2 = pos2[0];
            let y2 = -pos2[1];   
            let distance = calcDistance( x1, y1, x2, y2 );
            if( minDistance > distance ){
                minDistance = distance;
                idx1 = Number(i);
                idx2 = Number(j);
            }
        }    
    }
    // console.log( minDistance, idx1, idx2 );

    let newVertexArray = [];
    let isPolygon1CW = isVertexArrayCW( vertexArray1 );
    for( let i = 0; i < vertexArray1.length; ++i ){
        newVertexArray.push( vertexArray1[idx1] );
        if( isPolygon1CW ){
            ++idx1;
            if( idx1 >= vertexArray1.length ){
                idx1 = 0;
            }
        }else{
            --idx1;
            if( idx1 < 0 ){
                idx1 = vertexArray1.length - 1;
            }
        }
    }

    let isPolygon2CW = isVertexArrayCW( vertexArray2 );
    if( isPolygon2CW ){
        ++idx2;
        if( idx2 >= vertexArray2.length ){
            idx2 = 0;
        }
    }else{
        --idx2;
        if( idx2 < 0 ){
            idx2 = vertexArray2.length - 1;
        }
    }

    for( let i = 0; i < vertexArray2.length; ++i ){
        newVertexArray.push( vertexArray2[idx2] );
        if( isPolygon2CW ){
            ++idx2;
            if( idx2 >= vertexArray2.length ){
                idx2 = 0;
            }
        }else{
            --idx2;
            if( idx2 < 0 ){
                idx2 = vertexArray2.length - 1;
            }
        }
    }    

    let color = data1.color;
    this.updateTmepVerticesAndLines( newVertexArray, color );
}

PolygonMerge.prototype.deleteTmepVerticesAndLines = function()
{
    for( let i in this.tempVertices ){
        let vertexName = this.tempVertices[i].name;
        g_webGLView.deleteGLObject( vertexName );
    }

    for( let i in this.tempLines ){
        let lineName = this.tempLines[i].name;
        g_webGLView.deleteGLObject( lineName );
    }

    this.tempLines = [];
    this.tempVertices = [];
    this.vertexIdCounter = 0;  
    this.lineIdCounter = 0;   
}

PolygonMerge.prototype.updateTmepVerticesAndLines = function( vertexArray, color )
{
    // 削除
    this.deleteTmepVerticesAndLines();

    // スケール
    let s = g_webGLView.cameraPosR * 0.03;
    let scale = [ s, s, s ];   

    // 頂点を生成
    for( let i in vertexArray ){
        let pos = vertexArray[i];
        let vertex = new glObjectPlane(g_webGLView);
        vertex.setPosition( [ pos[0], 0.0, -pos[1] ] );
        vertex.setScale( scale ); 
        vertex.setColor( color[0], color[1], color[2], 1.0 );
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

    // 線を生成
    let numLines = vertexArray.length;    
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
        line.setColor( color[0], color[1], color[2], 1.0 );
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
}