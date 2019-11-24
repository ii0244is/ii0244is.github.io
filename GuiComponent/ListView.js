
let ListView = function()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid"; 

    this.items = [];
    this.rects = [];
    this.scrollPos = 0;
    this.state = "";
    this.onchange = null;
    this.animationTime = 0;
    this.animationEvent;
    this.pointerIdx = -1;

    this.scrollBarWidth = 16;
    this.itemHeight = 40;
    this.textSize = 20;
    this.marginY = 8;
    this.marginX = 8;    

    this.bgColor = "rgb(40,40,40)";
    this.scrollBarColor = "rgb(180,180,180)";
    this.itemColor = "rgb(80,80,80)";
    this.selectedItemColor = "rgb(240,240,20)";
    this.textColor = "rgb(220,220,220)";
    this.selectedTextColor = "rgb(0,0,0)";

    this.setupEvents();
}

ListView.prototype.resize = function()
{
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.scrollList( 0 );
    this.draw();
}

ListView.prototype.getDom = function()
{
    return this.canvas;
}

ListView.prototype.setItems = function( items )
{
    this.items = [];
    for( let i in items ){
        let item = {
            name : items[i],
            currentPos : 0,
            dstPos : 0,
        }
        this.items.push(item);
    }
}

ListView.prototype.getItems = function()
{
    let items = [];
    for( let i in this.items ){
        items.push( this.items[i].name )
    }
    return items;
}

ListView.prototype.getSelectedItem = function()
{
    return this.selectedItem;
}

///////////////////////////////////////////////////
// private function
///////////////////////////////////////////////////

ListView.prototype.setupEvents = function()
{
    this.canvas.onresize = function(){
        let width = this.canvas.clientWidth;
        let height = this.canvas.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.draw();
    }.bind(this)

    this.canvas.onmousedown = function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;

        let name = this.hitTest( x, y );
        if( name !== "" ){
            if( name === "scrollBar" ){
                this.state = "scroll";
            }else{
                this.selectedItem = name;
                this.movingItem = name;
                this.state = "move";
                if( this.onSelect ){
                    this.onSelect( this.selectedItem );
                }
            }
        }

        this.mousePosX = x;
        this.mousePosY = y;
        switch (event.button)
        {
            case 0: this.mouseLeftDrag   = true; break;
            case 1: this.mouseMiddleDrag = true; break;
            case 2: this.mouseRightDrag  = true; break;
        }
    }.bind(this);

    this.canvas.onmousemove = function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
    
        if( this.state === "move" ){
            this.drawAnimation( false );
        }else if( this.state === "scroll" ){
            let diffY = y - this.mousePosY;
            this.scrollList( diffY );
            this.draw();
        }

        this.mousePosX = x;
        this.mousePosY = y;
    }.bind(this);

    this.canvas.onmouseup = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;

        if( this.state === "move" ){
            this.changeOrder();
            clearTimeout( this.animationEvent );
            this.state = "";
            this.scrollList( 0 );
            this.draw();    
            if( this.onChangeOrder ){
                this.onChangeOrder();
            }
        }else if( this.state === "scroll" ){
            this.state = "";
            this.draw();
        }
    }.bind(this);    

    this.canvas.onmouseout = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;

        if( this.state === "move" ){
            this.changeOrder();
            clearTimeout( this.animationEvent );
            this.state = "";
            this.scrollList( 0 );     
            this.draw();    
            if( this.onChangeOrder ){
                this.onChangeOrder();
            }            
        }else if( this.state === "scroll" ){
            this.state = "";
            this.draw();
        }
    }.bind(this);      

    this.canvas.onmousewheel = function (event)
    {
        event.preventDefault();
        let diffY = event.deltaY * 0.2;
        this.scrollList( diffY );
        this.draw();
    }.bind(this);

    this.canvas.ontouchstart = function (event)
    {
        event.preventDefault();
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        this.mousePosX = x;
        this.mousePosY = y;
        this.touchmove = true;
    }.bind(this);

    this.canvas.ontouchmove = function (event)
    {
        event.preventDefault();
        if (this.touchmove)
        {
            this.mousePosX = x;
            this.mousePosY = y;            
        }
    }.bind(this);

    this.canvas.ontouchend = function (event)
    {
        event.preventDefault();
        this.touchmove = false;
    }.bind(this);        
}

ListView.prototype.draw = function()
{
    this.rects = [];
    this.drawBackground();
    this.drawScrollBar();
    this.drawItems();
}

ListView.prototype.drawBackground = function()
{
    let width  = this.canvas.width;
    let height = this.canvas.height;
    let ctx = this.canvas.getContext("2d");

    ctx.fillStyle = this.bgColor;
    ctx.fillRect( 0, 0, width, height );
}

ListView.prototype.drawScrollBar = function()
{
    let width  = this.canvas.width;
    let height = this.canvas.height - 2 * this.marginY;
    let ctx = this.canvas.getContext("2d");

    let numItems = this.items.length;
    let heightItems = ( this.itemHeight + this.marginY ) * numItems + this.marginY;

    if( height > heightItems ){
        return;
    }

    let scrollBarHeight = height / heightItems * height;
    let scrollBarPos = this.scrollPos / heightItems * height + this.marginY;
    
    let x = width - this.scrollBarWidth;
    let y = scrollBarPos;
    let w = this.scrollBarWidth - this.marginX;
    let h = scrollBarHeight;    
    ctx.fillStyle = this.scrollBarColor;
    ctx.fillRect( x, y, w, h );
    this.rects.push( { name:"scrollBar", x, y, w, h } ); 
}

ListView.prototype.drawItems = function()
{
    let width  = this.canvas.width;
    let ctx = this.canvas.getContext("2d");
    
    for( let i = 0; i < this.items.length; ++i ){
        let x = this.marginX;
        let y = this.marginY + i * ( this.itemHeight + this.marginY );
        y -= this.scrollPos;
        let w = width - this.marginX * 2 - this.scrollBarWidth;
        let h = this.itemHeight;
        this.drawItem( ctx, this.items[i], x, y, w, h );
    }
}

ListView.prototype.drawItem = function( ctx, item, x, y, w, h )
{
    let name = item.name;
    ctx.font = this.textSize + "px serif";
    ctx.textBaseline = "middle";

    if( this.selectedItem === name ){
        ctx.fillStyle = this.selectedItemColor;
        ctx.fillRect( x, y, w, h );
        ctx.fillStyle = this.selectedTextColor;
        ctx.fillText( name, x + this.marginX, y + h / 2 );
    }else{
        ctx.fillStyle = this.itemColor;
        ctx.fillRect( x, y, w, h );
        ctx.fillStyle = this.textColor;
        ctx.fillText( name, x + this.marginX, y + h / 2 );
    }

    item.currentPos = y;
    this.rects.push( { name, x, y, w, h } );
}

ListView.prototype.drawAnimation = function( isTimerEvent )
{
    let pointerIdx = this.calcPointerIdx();
    if( this.pointerIdx !== pointerIdx ){
        this.pointerIdx = pointerIdx;
        clearTimeout( this.animationEvent );
        this.setItemDstPosition();
        this.animationTime = 0;
    }

    if( isTimerEvent || this.animationTime === 0 || this.animationTime >= 100 ){
        this.drawBackground();
        this.drawScrollBar();
        this.drawItemAnimation();
        this.drawMovingItem();
        if( this.animationTime < 100 ){
            this.animationEvent = setTimeout( this.drawAnimation.bind(this), 10, true );
            this.animationTime += 2;    
        }        
    }

    if( this.mousePosY < 50 ){
        this.scrollList( -2 );
    }else if( this.canvas.height - 50 < this.mousePosY ){
        this.scrollList(  2 );
    }    
}

ListView.prototype.setItemDstPosition = function()
{
    let counter = 0;
    let interval = this.itemHeight + this.marginY;
    let startIdx =  Math.floor( this.scrollPos / interval );

    for( let i = 0; i < this.items.length; ){

        let skip = false;

        if( this.items[i].name === this.movingItem ){
            ++i;
            skip = true; 
        }

        if( counter === this.calcPointerIdx() ){
            ++counter;
            skip = true; 
        }

        if( skip ){
            continue;
        }     

        let y = this.marginY + counter * ( this.itemHeight + this.marginY );
        y -= this.scrollPos;
        this.items[i].dstPos = y;

        ++counter;
        ++i;        
    }
}

ListView.prototype.drawItemAnimation = function()
{
    let width  = this.canvas.width;
    let ctx = this.canvas.getContext("2d");

    function lerp( v1, v2, r ){
        return v1 + ( v2 - v1 ) * r;
    }    

    let rate = this.animationTime / 100;
    for( let i = 0; i < this.items.length; ++i ){
        
        if( this.items[i].name === this.movingItem ){
            continue;
        }

        let newPos = lerp( this.items[i].currentPos, this.items[i].dstPos, rate );
        this.items[i].currentPos = newPos;

        let x = this.marginX;
        let y = newPos;
        let w = width - this.marginX * 2 - this.scrollBarWidth;
        let h = this.itemHeight;
        this.drawItem( ctx, this.items[i], x, y, w, h );
    }    
}

ListView.prototype.drawMovingItem = function()
{
    let width  = this.canvas.width;
    let ctx = this.canvas.getContext("2d");

    for( let i = 0; i < this.items.length; ++i ){        
        if( this.items[i].name === this.movingItem ){
            let x = this.marginX;
            let y = this.mousePosY + this.hitPos;
            let w = width - this.marginX * 2 - this.scrollBarWidth;
            let h = this.itemHeight;
            this.drawItem( ctx, this.items[i], x, y, w, h );    
            break;        
        }
    }    
}

ListView.prototype.scrollList = function( diff )
{
    let numItems = this.items.length;
    let heightItems = ( this.itemHeight + this.marginY ) * numItems + this.marginY;

    let height = this.canvas.height - 2 * this.marginY;; 
    if( height > heightItems ){
        this.scrollPos = 0;
        return;
    }

    let scrollBarHeight = height / heightItems * height;
    let scrollBarPos = this.scrollPos / heightItems * height;   
    let newScrollBarPos = scrollBarPos + diff;
    let maxScrollBarPos = height - scrollBarHeight;
    if( newScrollBarPos < 0 ){
        newScrollBarPos = 0;
    }else if( maxScrollBarPos < newScrollBarPos ){
        newScrollBarPos = maxScrollBarPos;
    }
    let newPos = newScrollBarPos / height * heightItems; 
    this.scrollPos = newPos;
}

ListView.prototype.hitTest = function( x, y )
{
    let name = "";
    for( let i in this.rects ){
        let r = this.rects[i];
        if( r.x < x && x < r.x + r.w && r.y < y && y < r.y + r.h ){
            name = r.name;
            this.hitPos = r.y - y;
        }
    }
    return name;
}

ListView.prototype.calcPointerIdx = function()
{
    let y = this.mousePosY;
    let interval = this.itemHeight + this.marginY;
    let startIdx =  Math.floor( this.scrollPos / interval );
    let remain = this.scrollPos - interval * startIdx;

    let pointerIdx = 0;
    if( remain < this.marginY ){
        let offsetY = this.marginY - remain;
        pointerIdx = Math.floor( ( y - offsetY ) / interval );
    }else{
        let firstItemHeight = interval - remain;
        if( y < ( firstItemHeight + this.marginY / 2 ) ){
            pointerIdx = 0;
        }else{
            pointerIdx = Math.floor( ( y - ( firstItemHeight + this.marginY / 2 ) ) / interval ) + 1;
        }        
    }

    return startIdx + pointerIdx;
}

ListView.prototype.changeOrder = function()
{
    let selectedIdx = -1;
    for( let i in this.items ){
        if( this.items[i].name === this.movingItem ){
            selectedIdx = i;
        }
    }
    let targetItem = this.items[selectedIdx];
    this.items.splice( selectedIdx, 1 );
    let targetPos = this.calcPointerIdx();
    this.items.splice( targetPos, 0, targetItem );
}