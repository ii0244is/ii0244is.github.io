
let NumberInputSlider = function()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%"
    this.canvas.style.height = "50px"
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid";    
    this.canvas.style.cursor = "pointer";
    this.fontStyle = "Arial Black";

    this.SCALE_CHANGE_RATE = 0.0008;
    this.SCALE_BAR_HEIGHT  = 0.1;
    this.SCALE_BAR_POS_Y   = 0.75;

    this.value             = 0;
    this.diffValuePerPixel = 0.2;
    this.rate = this.diffValuePerPixel * this.SCALE_CHANGE_RATE;
    
    this.BgColorR = 30;
    this.BgColorG = 30;
    this.BgColorB = 30;
    this.BgColorA = 1.0;

    this.TextColorR = 250;
    this.TextColorG = 250;
    this.TextColorB = 250;
    this.TextColorA = 1.0;    

    this.min   = -100000000;
    this.max   = 100000000;
    this.digit = 0;
    
    this.onchange = null;

    this.setupEvents();
    this.resize();
    this.draw();
}

NumberInputSlider.prototype.resize = function()
{
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
}

NumberInputSlider.prototype.setHeight = function( height )
{
    this.canvas.style.height = height + "px";
    this.canvas.height = height;
    this.draw();    
}

NumberInputSlider.prototype.setValueRange = function( min, max, digit )
{
    this.min   = min;
    this.max   = max;
    this.digit = digit;
}

NumberInputSlider.prototype.setScale = function( scale )
{
    this.diffValuePerPixel = scale;
}

NumberInputSlider.prototype.setTextColor = function( r, g, b, a )
{
    this.TextColorR = r;
    this.TextColorG = g;
    this.TextColorB = b;
    this.TextColorA = a;
    this.draw();
}

NumberInputSlider.prototype.setBackgroundColor = function( r, g, b, a )
{
    this.BgColorR = r;
    this.BgColorG = g;
    this.BgColorB = b;
    this.BgColorA = a;
    this.draw();
}

NumberInputSlider.prototype.setValue = function( value )
{
    let temp = value;
    if( value < this.min ){
        temp = this.min;
    }
    if( value > this.max ){
        temp = this.max;
    }
    let width = this.canvas.clientWidth;
    this.value = temp;
    this.rate = this.diffValuePerPixel * this.SCALE_CHANGE_RATE;
    this.draw();
}

NumberInputSlider.prototype.getValue = function()
{
    let val = 0;
    if( this.digit <= 0 ){
        val = this.value.toFixed( -this.digit )
    }else{
        val = this.value % ( this.digit * 10 ) * ( this.digit * 10 )
    }
    return val;
}

NumberInputSlider.prototype.getDom = function()
{
    return this.canvas;
}

////////////////////////////////////////////////////////////////////
// private function
////////////////////////////////////////////////////////////////////

NumberInputSlider.prototype.setupEvents = function()
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
    
        if( this.mouseLeftDrag )
        {
            let diffX = this.mousePosX - x;
            let diffVal = this.diffValuePerPixel * diffX;
            let temp = this.value + diffVal;
            if( temp < this.min ){
                temp = this.min;
            }else if( temp > this.max ){
                temp = this.max;
            }else{
                this.value = temp;
            }
            this.draw();
            if( this.onchange ){
                this.onchange( this.getValue() );
            }
        }

        this.mousePosX = x;
        this.mousePosY = y;
    }.bind(this);

    this.canvas.onmouseup = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this);    

    this.canvas.onmouseout = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this);      

    this.canvas.onmousewheel = function (event)
    {
        event.preventDefault();
        this.diffValuePerPixel = this.diffValuePerPixel - event.wheelDelta * this.rate;
        this.rate = this.diffValuePerPixel * this.SCALE_CHANGE_RATE;
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
            let x = event.offsetX || event.layerX;
            let y = event.offsetY || event.layerY;
            if( !x ){
                x = event.touches[0].clientX;
                y = event.touches[0].clientY;
            }

            let diffX = this.mousePosX - x;
            let diffVal = this.diffValuePerPixel * diffX;
            let temp = this.value + diffVal;
            if( temp < this.min ){
                temp = this.min;
            }else if( temp > this.max ){
                temp = this.max;
            }else{
                this.value = temp;
            }
            this.draw();
            if( this.onchange ){
                this.onchange( this.getValue() );
            }  
            
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

NumberInputSlider.prototype.draw = function()
{
    let ctx = this.canvas.getContext("2d");
    let width = this.canvas.width;
    let height = this.canvas.height;
    let valueLeftSide = this.value - this.diffValuePerPixel * width / 2;

    // clear canvas
    ctx.fillStyle = "rgba(" + this.BgColorR + "," + this.BgColorG + "," + this.BgColorB +"," + this.BgColorA + ")";
    ctx.fillRect(0, 0, width, height);

    // draw bar
    let barPosY = height * this.SCALE_BAR_POS_Y;
    let barHeight = height * this.SCALE_BAR_HEIGHT;
    ctx.fillStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";
    ctx.fillRect(0, barPosY, width, barHeight );

    // calc line interval
    function calcScaleLineInterval( diffValuePerPixel ) 
    {
        let diffValuePerLine = 10;
        let roundDown = 0;
        let ref = diffValuePerPixel * 200;

        let unitList = [
            { diffValuePerLine : 10000   , roundDown : 0 },
            { diffValuePerLine : 50000   , roundDown : 0 },
            { diffValuePerLine : 1000    , roundDown : 0 },
            { diffValuePerLine : 500     , roundDown : 0 },
            { diffValuePerLine : 100     , roundDown : 0 },
            { diffValuePerLine : 50      , roundDown : 0 }, 
            { diffValuePerLine : 10      , roundDown : 0 },
            { diffValuePerLine : 5       , roundDown : 0 },
            { diffValuePerLine : 1       , roundDown : 0 },        
            { diffValuePerLine : 0.5     , roundDown : 1 },        
            { diffValuePerLine : 0.1     , roundDown : 1 },        
            { diffValuePerLine : 0.05    , roundDown : 2 },        
            { diffValuePerLine : 0.01    , roundDown : 2 },        
            { diffValuePerLine : 0.005   , roundDown : 3 },     
            { diffValuePerLine : 0.001   , roundDown : 3 },    
            { diffValuePerLine : 0.0005  , roundDown : 4 },     
            { diffValuePerLine : 0.0001  , roundDown : 4 },         
            { diffValuePerLine : 0.00005 , roundDown : 5 },     
            { diffValuePerLine : 0.00001 , roundDown : 5 },    
            { diffValuePerLine : 0.000005, roundDown : 6 },     
            { diffValuePerLine : 0.000001, roundDown : 6 },           
        ];

        for( let i in unitList ){
            diffValuePerLine = unitList[i].diffValuePerLine;
            roundDown = unitList[i].roundDown;
            if( diffValuePerLine < ref ){
                break;
            }
        }   
        
        let result = {}
        result.lineInterval = diffValuePerLine / diffValuePerPixel;
        result.diffValuePerLine = diffValuePerLine;
        result.roundDown = roundDown;
        return result;
    }    
    let result = calcScaleLineInterval(this.diffValuePerPixel);
    let diffValuePerLine = result.diffValuePerLine;
    let lineInterval     = result.lineInterval;    
    let roundDown        = result.roundDown;

    // calc offset
    let offsetValue = 0;
    if( valueLeftSide >= 0 ){
        offsetValue = diffValuePerLine - valueLeftSide % diffValuePerLine; 
    }else{
        offsetValue = Math.abs( valueLeftSide % diffValuePerLine );    
    }  
    let valueFirstLine = ( Math.floor( valueLeftSide / diffValuePerLine ) + 1 ) * diffValuePerLine;
    let posFirstLine = offsetValue / diffValuePerLine * lineInterval;

    // draw scale
    let count = 0;
    let linePosX = 0;
    let linePosY = height * this.SCALE_BAR_POS_Y;
    while( linePosX < width )
    {
        linePosX = posFirstLine + count * lineInterval;
        ctx.strokeStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";

        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(linePosX, linePosY - 10);
        ctx.lineTo(linePosX, linePosY);
        ctx.stroke();  
        let value = valueFirstLine + count * diffValuePerLine;
        ctx.font = "12px " + this.fontStyle;
        ctx.fillStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";
        let textWidth = ctx.measureText( value.toFixed(roundDown) ).width;
        ctx.fillText(value.toFixed(roundDown), linePosX - textWidth / 2, linePosY - 15); 

        ++count;
    }    

    // draw center line
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();      
}