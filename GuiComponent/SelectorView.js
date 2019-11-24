
let SelectorView = function ()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid"; 

    function getDefaultListParam () {
        return {
            area :{
                x : 0,
                y : 0,
                w : 0,
                h : 0,
            },
            scrollPosition : 0,
            state : "normal", // normal, scroll, move
            data : [],
            rects : {},
            pointerIdx : -1,
            selectedIdx : -1,
            selectedPosX : 0,
            selectedPosY : 0,
            isSrc : false,
        }
    }

    this.selectedDataList = getDefaultListParam();
    this.unselectedDataList = getDefaultListParam();

    this.iconSize = 50;
    this.scrollBarWidth = 6;
    this.state = "normal";
    this.margin = 20;
    this.minListMargin = 90;    
    this.iconMargin = 15;
    this.bgColor = "rgb(30, 30, 30)";
    this.listBgColor = "rgb(80, 80, 80)";
    this.scrollBarColor = "rgb(180, 180, 180)";

    this.isDrag = false;
    this.mousePosX = 0;
    this.mousePosY = 0;
    this.numCols = 0;
    this.animationTime = 0;
    this.animationEvent;

    this.setupEvents();
}

SelectorView.prototype.resize = function()
{
    this.canvas.width  = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.draw();
}

SelectorView.prototype.getDom = function()
{
    return this.canvas;
}

SelectorView.prototype.setUnselectedItems = function( items )
{
    for( let i in items ){
        let icon = {};
        icon.key = items[i].key; 
        icon.img = document.createElement("canvas");
        icon.img.width  = this.iconSize;
        icon.img.height = this.iconSize;
        let sw = items[i].img.width;
        let sh = items[i].img.height;
        let dw = this.iconSize;
        let dh = this.iconSize;
        let ctx = icon.img.getContext("2d"); 
        ctx.drawImage( items[i].img, 0, 0, sw, sh, 0, 0, dw, dh );
        this.unselectedDataList.data.push( icon );        
    }
}

SelectorView.prototype.getUnselectedItems = function()
{
    let items = [];
    for( let i in this.unselectedDataList.data ){
        let key = this.unselectedDataList.data[i].key;
        items.push(key);
    }
    return items;
}

SelectorView.prototype.setSelectedItems = function( items )
{
    for( let i in items ){
        let icon = {};
        icon.key = items[i].key; 
        icon.img = document.createElement("canvas");
        icon.img.width  = this.iconSize;
        icon.img.height = this.iconSize;
        let sw = items[i].img.width;
        let sh = items[i].img.height;
        let dw = this.iconSize;
        let dh = this.iconSize;
        let ctx = icon.img.getContext("2d"); 
        ctx.drawImage( items[i].img, 0, 0, sw, sh, 0, 0, dw, dh );
        this.selectedDataList.data.push( icon );        
    }    
}

SelectorView.prototype.getSelectedItems = function()
{
    let items = [];
    for( let i in this.selectedDataList.data ){
        let key = this.selectedDataList.data[i].key;
        items.push(key);
    }
    return items;
}

///////////////////////////////////////////////////
// private function
///////////////////////////////////////////////////

SelectorView.prototype.setupEvents = function()
{    
    this.canvas.onmousedown = (e) =>{
        this.isDrag = true;
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;        
        this.mousePosX = x;
        this.mousePosY = y;

        if( this.state === "moveFinish" ){
            clearTimeout( this.animationEvent );
        } 

        let result = this.hitTest( this.selectedDataList )
        if( result.isHit ){
            if( result.hitObj === "ScrollBarArea" ){
                this.selectedDataList.state = "scroll";
            }else if( result.hitObj === "Back" ){
                this.selectedDataList.state = "multiSelect";
                this.selectedDataList.selectedPosX = result.selectedPosX;
                this.selectedDataList.selectedPosY = result.selectedPosY;
                this.deselectAllItem( this.selectedDataList );
            }else{
                this.moveStart( this.selectedDataList, this.unselectedDataList, Number( result.hitObj ), result.selectedPosX, result.selectedPosY )                   
            }
        }

        result = this.hitTest( this.unselectedDataList )
        if( result.isHit ){
            if( result.hitObj === "ScrollBarArea" ){
                this.unselectedDataList.state = "scroll";
            }else if( result.hitObj === "Back" ){
                this.unselectedDataList.state = "multiSelect";
                this.unselectedDataList.selectedPosX = result.selectedPosX;
                this.unselectedDataList.selectedPosY = result.selectedPosY;                 
                this.deselectAllItem( this.unselectedDataList );
            }else{
                this.moveStart( this.unselectedDataList, this.selectedDataList, Number( result.hitObj ), result.selectedPosX, result.selectedPosY )                      
            }
        }

        this.draw();
    }

    this.canvas.onmousemove = (e) =>{
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;

        if( this.isDrag ){
            if( this.unselectedDataList.state === "scroll" ){
                let diffY = y - this.mousePosY;
                this.scrollList( this.unselectedDataList, diffY );
                this.draw();
            }else if( this.selectedDataList.state === "scroll" ){
                let diffY = y - this.mousePosY;
                this.scrollList( this.selectedDataList, diffY );
                this.draw();
            }else if( this.unselectedDataList.state === "move" || this.selectedDataList.state === "move" ){
                this.drawMoveAnimation( false );
            }else if( this.unselectedDataList.state === "multiSelect" ){
                this.deselectAllItem( this.selectedDataList );
                this.multiSelect( this.unselectedDataList );
                this.draw();
            }else if( this.selectedDataList.state === "multiSelect" ){
                this.deselectAllItem( this.unselectedDataList );
                this.multiSelect( this.selectedDataList );
                this.draw();
            }
        }

        this.mousePosX = x;
        this.mousePosY = y;
    }

    this.canvas.onmouseup = (e) =>{
        this.isDrag = false;
        // isMove
        if( this.state === "move" )
        {
            if( this.isInRect( this.mousePosX, this.mousePosY, this.selectedDataList.area ) ){
                if( this.selectedDataList.isSrc ){
                    this.changeOrder( this.selectedDataList );
                }else{
                    this.moveItem( this.unselectedDataList, this.selectedDataList );
                }              
            }

            if( this.isInRect( this.mousePosX, this.mousePosY, this.unselectedDataList.area ) ){
                if( this.unselectedDataList.isSrc ){
                    this.changeOrder( this.unselectedDataList );
                }else{
                    this.moveItem( this.selectedDataList, this.unselectedDataList );
                }
            }

            this.scrollList( this.selectedDataList, 0 );
            this.scrollList( this.unselectedDataList, 0 );
            this.drawMoveFinishAnimation( false );
            if( this.onchange ){
                this.onchange();
            }
        }else{
            clearTimeout( this.animationEvent );
            this.selectedDataList.state = "normal";
            this.selectedDataList.isSrc = false;
            this.unselectedDataList.state = "normal";
            this.unselectedDataList.isSrc = false;        
            this.state = "normal";
            this.draw();  
        }
    }

    this.canvas.onmousewheel = (e) =>{
        e.preventDefault();
        let diffY = e.deltaY * 0.3;
        
        if( this.isInRect( this.mousePosX, this.mousePosY, this.selectedDataList.area ) ){
            this.scrollList( this.selectedDataList, diffY );
        }else if( this.isInRect( this.mousePosX, this.mousePosY, this.unselectedDataList.area ) ){
            this.scrollList( this.unselectedDataList, diffY );
        }

        this.draw();      
    }    
}

///////////////////////////////////////////////////////////////////////
//
//  DRAW
//
///////////////////////////////////////////////////////////////////////


SelectorView.prototype.draw = function()
{
    let ctx = this.canvas.getContext("2d");

    this.drawBackground();
    this.calcListPosition();

    this.drawList( ctx, this.selectedDataList );
    this.drawList( ctx, this.unselectedDataList );
    
    if( this.selectedDataList.state === "multiSelect" ){
        this.drawMultiSelectArea( ctx, this.selectedDataList )
    }else if( this.unselectedDataList.state === "multiSelect" ){
        this.drawMultiSelectArea( ctx, this.unselectedDataList )
    }      
}

SelectorView.prototype.calcListPosition = function()
{
    let width = this.canvas.width;
    let height = this.canvas.height;

    let listWidth = ( width - ( 2 * this.margin + this.minListMargin ) ) / 2;
    this.numCols = Math.floor( ( listWidth - this.iconMargin ) / ( this.iconMargin + this.iconSize ) )
    listWidth = this.numCols * ( this.iconMargin + this.iconSize ) + this.iconMargin;

    this.selectedDataList.area.x = this.margin;
    this.selectedDataList.area.y = this.margin;  
    this.selectedDataList.area.w = listWidth;  
    if( this.isScrollBarNeeded( this.selectedDataList ) ){
        this.selectedDataList.area.w = listWidth + this.scrollBarWidth;  
    }
    this.selectedDataList.area.h = height - 2 * this.margin;    

    if( this.isScrollBarNeeded( this.unselectedDataList ) ){
        listWidth = listWidth + this.scrollBarWidth;  
    }    
    this.unselectedDataList.area.x = width - this.margin - listWidth;
    this.unselectedDataList.area.y = this.margin;  
    this.unselectedDataList.area.w = listWidth;  
    this.unselectedDataList.area.h = height - 2 * this.margin;  
}

SelectorView.prototype.isScrollBarNeeded = function( list )
{
    let height = list.area.h - 2 * this.iconMargin;
    let iconRows = Math.ceil( list.data.length / this.numCols );
    let heightIconRows = ( this.iconSize + this.iconMargin ) * iconRows + this.iconMargin;
    return ( height < heightIconRows );
}

SelectorView.prototype.drawBackground = function()
{
    let ctx = this.canvas.getContext("2d");
    let width = this.canvas.width;
    let height = this.canvas.height;
    ctx.fillStyle = this.bgColor;
    ctx.fillRect( 0, 0, width, height );
}

SelectorView.prototype.drawList = function( ctx, list )
{
    list.rects = {};

    this.drawListBackground( ctx, list );

    if( this.isScrollBarNeeded( list ) ){
        this.drawScrollBar( ctx, list );
    }       

    this.calcIconPosition( list );

    this.drawIcons( ctx, list );

    this.drawArrows();
}

SelectorView.prototype.drawListBackground = function( ctx, list )
{
    let posX   = list.area.x;
    let posY   = list.area.y;
    let width  = list.area.w;
    let height = list.area.h;
    ctx.fillStyle = this.listBgColor;
    ctx.fillRect( posX, posY, width, height );
}

SelectorView.prototype.drawScrollBar = function( ctx, list )
{
    let posX   = list.area.x;
    let posY   = list.area.y;
    let width  = list.area.w;
    let height = list.area.h - 2 * this.iconMargin;

    let iconRows = Math.ceil( list.data.length / this.numCols );
    let heightIconRows = ( this.iconSize + this.iconMargin ) * iconRows + this.iconMargin;

    let scrollBarHeight = height / heightIconRows * height;
    let scrollBarPos = list.scrollPosition / heightIconRows * height + this.iconMargin;   
    let x = posX + width - this.iconMargin / 2 - this.scrollBarWidth;
    let y = posY + scrollBarPos;
    let w = this.scrollBarWidth;
    let h = scrollBarHeight;

    ctx.fillStyle = this.scrollBarColor;
    ctx.fillRect( x, y, w, h );             
    list.rects["ScrollBarArea"] = { x, y, w, h }
}

SelectorView.prototype.calcIconPosition = function( list )
{
    for( let i = 0; i < list.data.length; ++i ){
        let col = Math.floor( i % this.numCols );
        let row = Math.floor( i / this.numCols );     
        list.data[i].currentPosX = this.iconMargin + ( this.iconSize + this.iconMargin ) * col;     
        list.data[i].currentPosY = this.iconMargin + ( this.iconSize + this.iconMargin ) * row;  
        list.data[i].dstPosX = list.data[i].currentPosX;     
        list.data[i].dstPosY = list.data[i].currentPosY;   
    } 
}

SelectorView.prototype.drawIcons = function( ctx, list )
{
    let posX   = list.area.x;
    let posY   = list.area.y;
    let height = list.area.h;

    // ウィンドウからはみ出したアイコンを避けながら描画
    for( let i = 0; i < list.data.length; ++i ){
        
        if( ( list.data[i].currentPosY + this.iconSize ) < list.scrollPosition ){
            continue;
        }
        if( ( list.scrollPosition + height ) < list.data[i].currentPosY ){
            continue;
        }

        let sx = 0, sy = 0;
        let dx = list.data[i].currentPosX;
        let dy = list.data[i].currentPosY - list.scrollPosition;
        let sw = this.iconSize, sh = this.iconSize, dw = this.iconSize, dh = this.iconSize;      
        
        // 先頭の行の補正
        if( dy < 0 ){
            sy = -dy
            sh = this.iconSize - sy;
            dy = 0;
            dh = sh;
        }

        // 最後の行の補正
        if( height < ( dy + dh ) ){
            sh = this.iconSize - ( ( dy + dh ) - height );
            dh = sh;
        }

        // 描画
        let img = list.data[i].img;
        dx += posX;
        dy += posY;
        ctx.drawImage( img, sx, sy, sw, sh, dx, dy, dw, dh );
        if( list.data[i].selected ){
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgb(255,255,0)";
            ctx.strokeRect( dx, dy, dw, dh );
        }
        list.rects[ i ] = { x : dx, y : dy, w : dw, h : dh };        
    }
}

SelectorView.prototype.drawMultiSelectArea = function( ctx, list )
{
    let x = list.area.x + list.selectedPosX;
    let y = list.area.y + list.selectedPosY;
    let w = this.mousePosX - x;
    let h = this.mousePosY - y;

    ctx.fillStyle = "rgba(120,120,255,0.5)";
    ctx.fillRect( x, y, w, h );   

    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgb(0,120,255)";
    ctx.strokeRect( x, y, w, h );     
}


SelectorView.prototype.drawMoveAnimation = function( isTimerEvent )
{
    let ctx = this.canvas.getContext("2d");

    let leftIdx = this.getPointerIdx( this.selectedDataList, this.mousePosX, this.mousePosY );
    let rightIdx = this.getPointerIdx( this.unselectedDataList, this.mousePosX, this.mousePosY );

    if( this.selectedDataList.pointerIdx !== leftIdx ){
        this.selectedDataList.pointerIdx = leftIdx;
        clearTimeout( this.animationEvent );
        this.calcIconDstPosition( this.selectedDataList );
        this.animationTime = 0;        
    }

    if( this.unselectedDataList.pointerIdx !== rightIdx ){
        this.unselectedDataList.pointerIdx = rightIdx;
        clearTimeout( this.animationEvent );
        this.calcIconDstPosition( this.unselectedDataList );
        this.animationTime = 0;
    }

    if( isTimerEvent || this.animationTime === 0 || this.animationTime >= 100 ){
        this.drawBackground();
        this.calcListPosition();
        this.drawListAnimation( ctx, this.selectedDataList );
        this.drawListAnimation( ctx, this.unselectedDataList );
        this.drawArrows();

        if( this.selectedDataList.isSrc ){
            this.drawSelectedItem( ctx, this.selectedDataList );
        }else{
            this.drawSelectedItem( ctx, this.unselectedDataList );
        }    
        
        if( this.animationTime < 100 ){
            this.animationEvent = setTimeout( this.drawMoveAnimation.bind(this), 10, true );
            this.animationTime += 2;    
        }
    }

    if( this.selectedDataList.area.x < this.mousePosX && this.mousePosX < this.selectedDataList.area.x + this.selectedDataList.area.h ){
        if( this.mousePosY < this.selectedDataList.area.y + 50 ){
            this.scrollList( this.selectedDataList, -2 );
        }else if( this.selectedDataList.area.y + this.selectedDataList.area.h - 50 < this.mousePosY ){
            this.scrollList( this.selectedDataList, 2 );
        }    
    }
    
    if( this.unselectedDataList.area.x < this.mousePosX && this.mousePosX < this.unselectedDataList.area.x + this.unselectedDataList.area.h ){
        if( this.mousePosY < this.unselectedDataList.area.y + 50 ){
            this.scrollList( this.unselectedDataList, -2 );
        }else if( this.unselectedDataList.area.y + this.unselectedDataList.area.h - 50 < this.mousePosY ){
            this.scrollList( this.unselectedDataList, 2 );
        }    
    }
}

SelectorView.prototype.calcIconDstPosition = function( list )
{
    let pointerIdx = this.getPointerIdx( list, this.mousePosX, this.mousePosY );
    let pointerCol = Math.floor( pointerIdx % this.numCols );
    let pointerRow = Math.floor( pointerIdx / this.numCols );

    let counter = 0;
    for( let i = 0; i < list.data.length; )
    {
        let col = Math.floor( counter % this.numCols );
        let row = Math.floor( counter / this.numCols );        
        let skip = false;

        // 選択されているアイコンは描かない
        if( list.data[ i ].selected && list.state === "move" ){
            ++i;             
            skip = true;  
        }

        // ポインターがいる場所には何も描かない
        if( pointerCol === col && pointerRow === row && list.state === "move" ){
            ++counter;
            skip = true; 
        }

        // skip が有効だったら描かない
        if( skip ){
            continue;
        }        

        list.data[i].dstPosX = this.iconMargin + ( this.iconSize + this.iconMargin ) * col;     
        list.data[i].dstPosY = this.iconMargin + ( this.iconSize + this.iconMargin ) * row;   
        ++counter;
        ++i;
    } 
}

SelectorView.prototype.drawListAnimation = function( ctx, list )
{
    list.rects = {};

    this.drawListBackground( ctx, list );

    if( this.isScrollBarNeeded( list ) ){
        this.drawScrollBar( ctx, list );
    }

    this.drawIconAnimation( ctx, list );
}

SelectorView.prototype.drawIconAnimation = function( ctx, list )
{
    let posX   = list.area.x;
    let posY   = list.area.y;
    let height = list.area.h;

    function lerp( v1, v2, r ){
        return v1 + ( v2 - v1 ) * r;
    }

    let rate = this.animationTime / 100;
    for( let i = 0; i < list.data.length; ++i ){
        
        if( list.data[i].selected && list.state === "move" ){
            continue;
        }   

        let newPosX = lerp( list.data[i].currentPosX, list.data[i].dstPosX, rate );
        let newPosY = lerp( list.data[i].currentPosY, list.data[i].dstPosY, rate );
        list.data[i].currentPosX = newPosX;
        list.data[i].currentPosY = newPosY;

        if( ( newPosY + this.iconSize ) < list.scrollPosition ){
            continue;
        }
        if( ( list.scrollPosition + height ) < newPosY ){
            continue;
        }

        let sx = 0, sy = 0;
        let dx = newPosX;
        let dy = newPosY - list.scrollPosition;
        let sw = this.iconSize, sh = this.iconSize, dw = this.iconSize, dh = this.iconSize;      
        
        // 先頭の行の補正
        if( dy < 0 ){
            sy = -dy
            sh = this.iconSize - sy;
            dy = 0;
            dh = sh;
        }

        // 最後の行の補正
        if( height < ( dy + dh ) ){
            sh = this.iconSize - ( ( dy + dh ) - height );
            dh = sh;
        }

        // 描画
        let img = list.data[i].img;
        dx += posX;
        dy += posY;
        ctx.drawImage( img, sx, sy, sw, sh, dx, dy, dw, dh );
        if( list.data[i].selected ){
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgb(255,255,0)";
            ctx.strokeRect( dx, dy, dw, dh );
        }
        list.rects[ i ] = { x : dx, y : dy, w : dw, h : dh };        
    }
}

SelectorView.prototype.drawSelectedItem = function( ctx, list )
{
    let posX = list.area.x;
    let posY = list.area.y;
    let dstX = this.mousePosX - list.selectedPosX;
    let dstY = this.mousePosY - list.selectedPosY;

    function lerp( v1, v2, r ){
        return v1 + ( v2 - v1 ) * r;
    }

    let count = 0;
    for( let i = 0; i < list.data.length; ++i ){
        if( list.data[i].selected && i !== list.selectedIdx ){
            ++count;
        }
    }

    for( let i = 0; i < list.data.length; ++i ){
        if( !list.data[i].selected || i === list.selectedIdx ){
            continue;
        }
        let rate = 0.2 + ( this.animationTime / 100 - count * 0.02 ) * 0.8;
        if( rate < 0.1 ){
            // console.log( rate )
            rate = 0.1;
        }
        let cx = posX + list.data[i].currentPosX;
        let cy = posY + list.data[i].currentPosY - list.scrollPosition;
        let dx = lerp( cx, dstX, rate );
        let dy = lerp( cy, dstY, rate );
        let img = list.data[ i ].img;
        ctx.drawImage( img, 0, 0, this.iconSize, this.iconSize, dx, dy, this.iconSize, this.iconSize );
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(255,255,0)";
        ctx.strokeRect( dx, dy, this.iconSize, this.iconSize );                  
        list.data[i].currentPosX = dx - posX;
        list.data[i].currentPosY = dy - posY + list.scrollPosition;
        --count;      
    }

    if( list.isSrc && list.state === "move" && list.selectedIdx != -1 ){
        let img = list.data[ list.selectedIdx ].img;
        dx = dstX;
        dy = dstY;
        ctx.drawImage( img, 0, 0, this.iconSize, this.iconSize, dx, dy, this.iconSize, this.iconSize );
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgb(255,255,0)";
        ctx.strokeRect( dx, dy, this.iconSize, this.iconSize );        

        list.data[ list.selectedIdx ].currentPosX = dx - posX;
        list.data[ list.selectedIdx ].currentPosY = dy - posY + list.scrollPosition;        
    }    
}

SelectorView.prototype.drawMoveFinishAnimation = function( isTimerEvent )
{
    let ctx = this.canvas.getContext("2d");    

    if( !isTimerEvent ){
        clearTimeout( this.animationEvent );

        let list = this.unselectedDataList;
        if( this.isInRect( this.mousePosX, this.mousePosY, this.selectedDataList.area ) ){
            list = this.selectedDataList;
        }else if( this.isInRect( this.mousePosX, this.mousePosY, this.unselectedDataList.area ) ){
            list = this.unselectedDataList;
        }else{
            if( this.selectedDataList.isSrc ){
                list = this.selectedDataList;
            }
        }

        if( this.selectedDataList.isSrc ){
            list.selectedPosX = this.selectedDataList.selectedPosX;
            list.selectedPosY = this.selectedDataList.selectedPosY;
        }else{
            list.selectedPosX = this.unselectedDataList.selectedPosX;
            list.selectedPosY = this.unselectedDataList.selectedPosY;
        }        

        for( let i = 0; i < list.data.length; ++i ){
            let col = Math.floor( i % this.numCols );
            let row = Math.floor( i / this.numCols );    
            if( list.data[i].selected ){
                list.data[i].currentPosX = this.mousePosX - list.area.x - list.selectedPosX; 
                list.data[i].currentPosY = this.mousePosY - list.area.y - list.selectedPosY + list.scrollPosition; 
            }
            list.data[i].dstPosX = this.iconMargin + ( this.iconSize + this.iconMargin ) * col;      
            list.data[i].dstPosY = this.iconMargin + ( this.iconSize + this.iconMargin ) * row;    
        }

        this.state = "moveFinish";
        list.state = "moveFinish";
        this.animationTime = 0;  
    }

    if( isTimerEvent || this.animationTime === 0 || this.animationTime >= 100 ){
        this.drawBackground();
        this.calcListPosition();
        this.drawListAnimation( ctx, this.selectedDataList );
        this.drawListAnimation( ctx, this.unselectedDataList );
        this.drawArrows();

        if( this.animationTime < 100 ){
            this.animationEvent = setTimeout( this.drawMoveFinishAnimation.bind(this), 10, true );
            this.animationTime += 2;    
        }else{
            this.selectedDataList.state = "normal";
            this.selectedDataList.isSrc = false;
            this.unselectedDataList.state = "normal";
            this.unselectedDataList.isSrc = false;        
            this.state = "normal";
            this.draw();              
        }
    }
}

SelectorView.prototype.drawArrows = function()
{
    let ctx = this.canvas.getContext("2d");
    let width = this.canvas.width;
    let height = this.canvas.height;

    function drawTriangle( ctx, x1, y1, x2, y2, x3, y3, color ){
		ctx.beginPath();
		ctx.moveTo(x1, y1); 
		ctx.lineTo(x2, y2);
		ctx.lineTo(x3, y3); 
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();        
    }

    let arrowSize = this.minListMargin * 0.15;
    let x1 = width / 2 - arrowSize;
    let x2 = width / 2 + arrowSize; 
    let x3 = width / 2 + arrowSize;    
    let y1 = height * 3 / 10;
    let y2 = height * 3 / 10 + arrowSize; 
    let y3 = height * 3 / 10 - arrowSize;      
    drawTriangle( ctx, x1, y1, x2, y2, x3, y3, "rgb(200,200,200)" );

    x1 = width / 2 + arrowSize;
    x2 = width / 2 - arrowSize; 
    x3 = width / 2 - arrowSize;    
    y1 = height * 7 / 10;
    y2 = height * 7 / 10 + arrowSize; 
    y3 = height * 7 / 10 - arrowSize;      
    drawTriangle( ctx, x1, y1, x2, y2, x3, y3, "rgb(50,50,50)" );    
}

///////////////////////////////////////////////////////////////////////
//
//  MOVE
//
///////////////////////////////////////////////////////////////////////

SelectorView.prototype.multiSelect = function( list )
{
    let selectArea = {};
    selectArea.x = list.area.x + list.selectedPosX;
    selectArea.y = list.area.y + list.selectedPosY;
    selectArea.w = Math.abs( this.mousePosX - selectArea.x );
    selectArea.h = Math.abs( this.mousePosY - selectArea.y );
    if( selectArea.x > this.mousePosX ){
        selectArea.x = this.mousePosX
    }
    if( selectArea.y > this.mousePosY ){
        selectArea.y = this.mousePosY
    }

    function intersectRect( r1, r2 ){
        let r1x = r1.x +  r1.w / 2;
        let r1y = r1.y +  r1.h / 2;
        let r2x = r2.x +  r2.w / 2;
        let r2y = r2.y +  r2.h / 2;
        return ( Math.abs( r1x - r2x ) < ( r1.w + r2.w ) / 2 ) && 
            ( Math.abs( r1y - r2y ) < ( r1.h + r2.h ) / 2 ); 
    }

    for( let i in list.rects ){
        let rect = list.rects[i];
        let idx = Number(i);
        if( idx < list.data.length ){
            list.data[idx].selected = intersectRect( rect, selectArea );
        }
    }
}

SelectorView.prototype.moveStart = function( srcList, dstList, idx, selectedPosX, selectedPosY )
{
    // 他方のリストの選択を外す
    this.deselectAllItem( dstList );
     
    if( !srcList.data[idx].selected ){
        // 新たに選択する場合はすでに選択していたものを解除
        this.deselectAllItem( srcList );
    }

    // 選択を変更する
    this.selectItem( srcList, idx, selectedPosX, selectedPosY );

    // 移動開始
    this.state = "move";
    dstList.state = "move";
    dstList.isSrc = false;                      
    srcList.state = "move";
    srcList.isSrc = true;   
}

SelectorView.prototype.changeOrder = function( list )
{
    let dst = this.getPointerIdx( list, this.mousePosX, this.mousePosY );
    if( list.selectedIdx < dst ){
        ++dst 
    }
    let moveItems = [];
    let forwardItems = [];
    let backwardItems = [];
    for( let i in list.data ){
        if( list.data[i].selected ){
            moveItems.push( list.data[i] );
        }else{
            if( Number(i) < dst ){
                forwardItems.push( list.data[i] );
            }else{
                backwardItems.push( list.data[i] );
            }
        }
    }
    list.data = forwardItems.concat( moveItems, backwardItems );
}

SelectorView.prototype.moveItem = function( srcList, dstList )
{
    let dst = this.getPointerIdx( dstList, this.mousePosX, this.mousePosY );

    // 移動するアイテムを配列につめる
    let moveItems = [];
    for( let i = 0; i < srcList.data.length; ++i ){
        if( srcList.data[i].selected ){
            moveItems.push( srcList.data[i] );
        }
    }                    

    // 移動先に追加
    if( dstList.data.length < dst ){
        for( let i in moveItems ){
            dstList.data.push( moveItems[i] );
        }
    }else{
        for( let i in moveItems ){
            let pos = dst + Number( i );
            dstList.data.splice( pos, 0, moveItems[i] );
        }                    
    }

    // ソースからは削除（後ろから回して番号がずれる問題を回避）
    for( let i = srcList.data.length - 1; i >= 0; --i ){
        if( srcList.data[i].selected ){
            srcList.data.splice( i, 1 );
        }
    }                    
}

SelectorView.prototype.scrollList = function( list, diff )
{
    if( !this.isScrollBarNeeded( list ) ){
        list.scrollPosition = 0;        
        return;
    }

    let height = list.area.h - 2 * this.iconMargin;
    let iconRows = Math.ceil( list.data.length / this.numCols );
    let heightIconRows = ( this.iconSize + this.iconMargin ) * iconRows + this.iconMargin;

    let scrollBarHeight = height / heightIconRows * height;
    let scrollBarPos = list.scrollPosition / heightIconRows * height;   
    let newScrollBarPos = scrollBarPos + diff;
    let maxScrollBarPos = height - scrollBarHeight;
    if( newScrollBarPos < 0 ){
        newScrollBarPos = 0;
    }else if( maxScrollBarPos < newScrollBarPos ){
        newScrollBarPos = maxScrollBarPos;
    }
    let newPos = newScrollBarPos / height * heightIconRows; 
    list.scrollPosition = newPos;        
}


///////////////////////////////////////////////////////////////////////
//
//  Hit Test
//
///////////////////////////////////////////////////////////////////////

SelectorView.prototype.isInRect = function( x, y, rect )
{
    if( rect.x < x && x < rect.x + rect.w && 
        rect.y < y && y < rect.y + rect.h ){
        return true;
    }
    return false;
}

SelectorView.prototype.hitTest = function( list )
{
    let isHit = false;
    let hitObj = "";
    let selectedPosX = 0;
    let selectedPosY = 0;
    if( this.isInRect( this.mousePosX, this.mousePosY, list.area ) ){
        isHit = true;
        for( let name in list.rects ){
            let rect = list.rects[name];
            if( this.isInRect( this.mousePosX, this.mousePosY, rect ) ){
                hitObj = name;
                selectedPosX = this.mousePosX - rect.x;
                selectedPosY = this.mousePosY - rect.y;
                break;
            }                   
        }
        if( hitObj === "" ){
            hitObj = "Back"
            selectedPosX = this.mousePosX - list.area.x;
            selectedPosY = this.mousePosY - list.area.y;
        }    
    }
    return { isHit, hitObj, selectedPosX, selectedPosY };
}

SelectorView.prototype.getPointerIdx = function( list, x, y )
{
    if( !this.isInRect( x, y, list.area ) ){
        return -1;
    }

    let posX   = list.area.x;
    let posY   = list.area.y;

    let startRow = Math.floor( list.scrollPosition / ( this.iconSize + this.iconMargin ) );
    let remain = list.scrollPosition - ( this.iconSize + this.iconMargin ) * startRow;

    let localX = x - posX;
    let localY = y - posY;    
    let pointerCol = Math.floor( ( localX - this.iconMargin / 2 ) / ( this.iconSize + this.iconMargin ) );
    let pointerRow = 0;
    if( remain < this.iconMargin ){
        let offsetY = this.iconMargin - remain;
        pointerRow = Math.floor( ( localY - offsetY ) / ( this.iconSize + this.iconMargin ) );
    }else{
        let firstRowIconHeight = this.iconMargin + this.iconSize - remain;
        if( localY < ( firstRowIconHeight + this.iconMargin / 2 ) ){
            pointerRow = 0;
        }else{
            pointerRow = Math.floor( ( localY - ( firstRowIconHeight + this.iconMargin / 2 ) ) / ( this.iconSize + this.iconMargin ) ) + 1;
        }
    }

    return ( startRow + pointerRow ) * this.numCols + pointerCol;
}

///////////////////////////////////////////////////////////////////////
//
//  Select 
//
///////////////////////////////////////////////////////////////////////

SelectorView.prototype.selectItem = function( list, idx, posX, posY )
{
    if( idx >= list.data.length ){
        return;
    }

    list.data[idx].selected = true;
    list.selectedIdx = idx;
    list.selectedPosX = posX;
    list.selectedPosY = posY;    
}

SelectorView.prototype.deselectItem = function( list, idx )
{
    if( idx >= list.data.length ){
        return;
    }
    list.selectedIdx = -1;
    list.data[idx].selected = false;
}

SelectorView.prototype.deselectAllItem = function( list )
{
    list.selectedIdx = -1;
    for( let i in list.data ){
        list.data[i].selected = false;
    }
}
