
let DateInputSlider = function()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%"
    this.canvas.style.height = "80px"
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid";     
    this.canvas.style.cursor = "pointer";
    //this.fontStyle = "'Times New Roman'";
    this.fontStyle = "Italic bold";

    // slider position
    this.SCALE_CHANGE_RATE = 0.0008;
    this.SCALE_BAR_HEIGHT  = 0.08;
    this.SCALE_BAR_POS_Y   = 0.8;

    // constant parameter
    this.MINIMUM_SCALELINE_INTERVAL = 35;

    // date
    let min  = 60;
    let hour = 60 * min   
    let day  = 24 * hour;
    this.currentTime = new Date(2000, 0, 1);
    this.secPerPixel = 7 * day;
    
    // color
    this.BgColorR = 255;
    this.BgColorG = 255;
    this.BgColorB = 255;
    this.BgColorA = 1.0;
    this.TextColorR = 0;
    this.TextColorG = 0;
    this.TextColorB = 0;
    this.TextColorA = 1.0;    
    
    this.onchange = null;

    this.setupEvents();
    this.resize();
    this.draw();
}

DateInputSlider.prototype.resize = function()
{
    let width = this.canvas.clientWidth;
    let height = this.canvas.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
}

DateInputSlider.prototype.setHeight = function( height )
{
    this.canvas.style.height = height + "px";
    this.canvas.height = height;
    this.draw();    
}

DateInputSlider.prototype.setValueRange = function( min, max, digit )
{
    this.min   = min;
    this.max   = max;
    this.digit = digit;
}

DateInputSlider.prototype.setTextColor = function( r, g, b, a )
{
    this.TextColorR = r;
    this.TextColorG = g;
    this.TextColorB = b;
    this.TextColorA = a;
    this.draw();
}

DateInputSlider.prototype.setBackgroundColor = function( r, g, b, a )
{
    this.BgColorR = r;
    this.BgColorG = g;
    this.BgColorB = b;
    this.BgColorA = a;
    this.draw();
}

DateInputSlider.prototype.setValue = function( value )
{
    this.currentTime.setFullYear( value.year );
    this.currentTime.setMonth( value.month - 1 );
    this.currentTime.setDate( value.day );    
    this.draw();
}

DateInputSlider.prototype.getValue = function()
{
    let val = {};
    val.year  = this.currentTime.getFullYear();
    val.month = this.currentTime.getMonth() + 1;
    val.day   = this.currentTime.getDate();
    return val;
}

DateInputSlider.prototype.setTimeScale = function( val )
{
    this.secPerPixel = val;
}

DateInputSlider.prototype.getTimeScale = function()
{
    return this.secPerPixel;
}

DateInputSlider.prototype.getDom = function()
{
    return this.canvas;
}

////////////////////////////////////////////////////////////////////
// private function
////////////////////////////////////////////////////////////////////

DateInputSlider.prototype.setupEvents = function()
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
            this.changeDate( diffX );
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
        this.changeScale( event.wheelDelta );
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
            this.changeDate( diffX );
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

DateInputSlider.prototype.changeDate = function( diff ) 
{
    let year = this.currentTime.getFullYear(); 
    let month = this.currentTime.getMonth(); 
    let day = this.currentTime.getDate();
    let hour = this.currentTime.getHours();
    let min = this.currentTime.getMinutes(); 
    let sec = this.currentTime.getSeconds();
    let diffSec = diff * this.secPerPixel;
    this.currentTime = this.calcDate( year, month, day, hour, min, sec, diffSec );
    this.draw();      
}

DateInputSlider.prototype.changeScale = function( diff ) 
{
    let rate = this.secPerPixel * 0.0005;
    let tempScale = this.secPerPixel - diff * rate;    
    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;
    if( day * 0.1 > tempScale ) return;
    this.secPerPixel = tempScale;
    this.draw();         
}

DateInputSlider.prototype.calcDate = function( year, month, day, hour, min, sec, diffSec )
{
    let min_s   = 60;
    let hour_s  = 60 * min_s;
    let day_s   = 24 * hour_s;
    let month_s = 30 * day_s;
    let year_s  = 365 * day_s;

    date = new Date( year, month, day, hour, min, sec );
    let time = Math.abs( diffSec )
    let remainder = 0;
    let diffYear  = Math.floor( time / year_s );
    remainder     = time % year_s;
    let diffMonth = Math.floor( remainder / month_s );
    remainder     = remainder % month_s;
    let diffDate  = Math.floor( remainder / day_s );   
    remainder     = remainder % day_s;   
    let diffHour  = Math.floor( remainder / hour_s );
    // remainder     = remainder % hour;    
    // let diffMin   = Math.floor( remainder / min );
    // let diffsec   = Math.floor( remainder % sec );

    if( diffSec < 0 )
    {
        diffYear  = -diffYear;
        diffMonth = -diffMonth;
        diffDate  = -diffDate;  
        diffHour  = -diffHour;   
    }
    date.setFullYear( date.getFullYear() + diffYear );
    date.setMonth( date.getMonth() + diffMonth );
    date.setDate( date.getDate() + diffDate );
    date.setHours( date.getHours() + diffHour );

    return date;
}

DateInputSlider.prototype.calcTimeUnit = function( sec ) 
{
    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;
    let month = 30 * day;
    let year  = 365 * day;

    let timeUnits = [
        { "sec":1000 * year, "unit":"year",  "unitLength":1000 },
        { "sec":500 * year,  "unit":"year",  "unitLength":500  },
        { "sec":100 * year,  "unit":"year",  "unitLength":100  },
        { "sec":50 * year,   "unit":"year",  "unitLength":50   },
        { "sec":10 * year,   "unit":"year",  "unitLength":10   },
        { "sec":5 * year,    "unit":"year",  "unitLength":5    },
        { "sec":1 * year,    "unit":"year",  "unitLength":1    },
        { "sec":6 * month,   "unit":"month", "unitLength":6    },
        { "sec":3 * month,   "unit":"month", "unitLength":3    },
        { "sec":1 * month,   "unit":"month", "unitLength":1    },
        { "sec":1 * day,     "unit":"day" ,  "unitLength":1    },
        { "sec":12 * hour,   "unit":"hour",  "unitLength":12   },
        { "sec":6 * hour,    "unit":"hour" , "unitLength":6    },
        { "sec":3 * hour,    "unit":"hour" , "unitLength":3    },
        { "sec":1 * hour,    "unit":"hour",  "unitLength":1    },
        { "sec":30 * min,    "unit":"min",   "unitLength":30   },
        { "sec":10 * min,    "unit":"min",   "unitLength":10   },
        { "sec":5 * min,     "unit":"min",   "unitLength":5    },
        { "sec":1 * min,     "unit":"min",   "unitLength":1    },
        { "sec":30,          "unit":"sec",   "unitLength":30   },
        { "sec":10,          "unit":"sec",   "unitLength":10   },
        { "sec":1,           "unit":"sec",   "unitLength":1    }, 
    ];

    let timeUnit = {}
    for( let i in timeUnits ){
        if( sec > timeUnits[i].sec ){
            if( i == 0 ){
                timeUnit = timeUnits[i];
            }else{
                timeUnit = timeUnits[i-1];
            }
            break;
        }
    }   

    return timeUnit;
}   

DateInputSlider.prototype.getNumDays = function( year, month )
{
    if( month == 1 || month == 3 || month == 5 || month == 7 || 
        month == 8 || month == 10 || month == 12 ){
        return 31;
    }else if( month == 2 ){
        if( year % 4 == 0 ){
            if( year % 200 == 0 ){
                return 28;
            }
            return 29;
        }else{
            return 28;
        }
    }
    return 30;
}

DateInputSlider.prototype.draw = function()
{
    let ctx = this.canvas.getContext("2d");
    let width = this.canvas.width;
    let height = this.canvas.height;
    if ( width < 1 ){
        return;
    }        

    // clear canvas
    ctx.fillStyle = "rgba(" + this.BgColorR + "," + this.BgColorG + "," + this.BgColorB +"," + this.BgColorA + ")";
    ctx.fillRect(0, 0, width, height);

    // draw bar
    let barPosY = height * this.SCALE_BAR_POS_Y;
    let barHeight = height * this.SCALE_BAR_HEIGHT;
    ctx.fillStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";
    ctx.fillRect(0, barPosY, width, barHeight );

    // calc line interval
    let maxNumScaleLines = Math.floor( width / this.MINIMUM_SCALELINE_INTERVAL );
    let secDisplayPeriod = width * this.secPerPixel;
    let secPerLine = secDisplayPeriod / maxNumScaleLines;    
    let timeUnit = this.calcTimeUnit( secPerLine );
    let lineInterval = width / ( secDisplayPeriod / timeUnit.sec );    

    // calc offset
    let length = timeUnit.unitLength;
    let unit   = timeUnit.unit;    
    let currentYear   = this.currentTime.getFullYear();
    let currentMonth  = this.currentTime.getMonth() + 1;
    let currentDate   = this.currentTime.getDate();
    let currentHour   = this.currentTime.getHours();
    let backLineOffset    = 0;
    let forwardLineOffset = 0;
    let startNumber       = 0;    
    if( unit == "year" ) {
        let numDays = this.getNumDays( currentYear, currentMonth );
        backLineOffsetYear  = ( currentYear % length ) / length;
        backLineOffsetMonth = ( currentMonth - 1 ) / 12 / length;
        backLineOffsetDay   = currentDate / numDays / 12 / length;        
        backLineOffset = ( backLineOffsetYear + backLineOffsetMonth + backLineOffsetDay ) * lineInterval;
        forwardLineOffset = lineInterval - backLineOffset;
        startNumber = currentYear - currentYear % length;
    } else if( unit == "month" ) {
        let numDays = this.getNumDays( currentYear, currentMonth );
        backLineOffsetMonth = ( ( currentMonth - 1 ) % length ) / length;
        backLineOffsetDay = ( currentDate - 1 ) / numDays / length;
        backLineOffsetHour = currentHour / 24 / numDays / length;
        backLineOffset = ( backLineOffsetMonth + backLineOffsetDay + backLineOffsetHour ) * lineInterval;
        forwardLineOffset = lineInterval - backLineOffset;
        startNumber = Math.floor( ( currentMonth - 1 ) / length ) * length + 1;      
    }

    /////////////////////////////////////////////////////////////////
    // draw scale
    /////////////////////////////////////////////////////////////////

    function drawLine( startX, startY, stopX, stopY ){
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo( startX, startY );
        ctx.lineTo( stopX, stopY );
        ctx.stroke();
    }

    let currentTimePos = this.canvas.width / 2;
    let linePosStartY = this.canvas.height * this.SCALE_BAR_POS_Y;
    let linePosStopY  = linePosStartY - 10;        
    let linePosX = currentTimePos - backLineOffset;
    let year = currentYear;
    let i = 0;
    let textPosY = linePosStopY - 3;
    ctx.strokeStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";
    while(1)
    {
        if( linePosX < 0 ) break;
        drawLine( linePosX, linePosStartY, linePosX, linePosStopY );

        let number = startNumber - i * length;
        if( unit == "month" ) {
            number = ( number + 12 * 10 ) % 12;
            if( number == 1 ){
                ctx.font = "8px " + this.fontStyle;
                let textWidth = ctx.measureText( year ).width;                
                ctx.fillText( year, linePosX - textWidth / 2 , textPosY - 12 );
                --year;                
            }else if( number == 0 ){
                number = 12;                
            }
        }
        ctx.font = "12px " + this.fontStyle;
        let textWidth = ctx.measureText( number ).width;
        ctx.fillText( number, linePosX - textWidth / 2, textPosY );     

        linePosX -= lineInterval;       
        ++i; 
    }
    linePosX = currentTimePos + forwardLineOffset;
    i = 1;
    year = currentYear;
    while(1)
    {
        if( this.canvas.width < linePosX ) break;
        drawLine( linePosX, linePosStartY, linePosX, linePosStopY );

        let number = startNumber + i * length;      
        if( unit == "month" ) {
            number = number % 12;
            if( number == 1 ){
                ++year;
                ctx.font = "8px " + this.fontStyle;
                let textWidth = ctx.measureText( year ).width;                
                ctx.fillText( year, linePosX - textWidth / 2 , textPosY - 12 );
            }
            else if( number == 0 ){
                number = 12;                
            }
        }        
        ctx.font = "12px " + this.fontStyle;
        let textWidth = ctx.measureText( number ).width;
        ctx.fillText( number, linePosX - textWidth / 2, textPosY );    

        linePosX += lineInterval;  
        ++i;       
    } 

    // draw center line
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();      

    // draw current time
    ctx.font = "16px " + this.fontStyle;
    ctx.fillStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";
    let currentTimeText = currentYear + " " + currentMonth + "/" + currentDate
    ctx.fillText( currentTimeText, 10, 23 );    
}