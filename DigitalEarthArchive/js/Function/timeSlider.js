
let timeSlider = function( parentDom, width, height )
{
    // set DOM 
    this.parentDom     = parentDom;
    this.canvas        = document.createElement("canvas");
    this.context       = this.canvas.getContext("2d");
    this.canvas.width  = width;
    this.canvas.height = height;
    this.parentDom.appendChild(this.canvas);
    
    this.initialize();
    this.setUpMouseEvent();
    this.draw();
}

timeSlider.prototype.setSize = function( width, height )
{
    this.canvas.width  = width;
    this.canvas.height = height;    
}

timeSlider.prototype.getCurrentDate = function()
{
    let currentDate = {};
    currentDate.year  = this.currentTime.getFullYear();
    currentDate.month = this.currentTime.getMonth();
    currentDate.date  = this.currentTime.getDate();
    return currentDate;
}

timeSlider.prototype.addDate = function( year, month, day )
{
    this.currentTime.setFullYear( this.currentTime.getFullYear() + year );
    this.currentTime.setMonth( this.currentTime.getMonth() + month );
    this.currentTime.setDate( this.currentTime.getDate() + day );
    this.draw();
}

timeSlider.prototype.setCurrentDate = function( year, month, day, hour, min, sec )
{
    this.currentTime.setFullYear( year );
    this.currentTime.setMonth( month );
    this.currentTime.setDate( day );
    this.draw();
}

timeSlider.prototype.getTimeSliderScale = function()
{
    return this.secPerPixel;
}

timeSlider.prototype.setTimeSliderScale = function( secPerPixel )
{
    this.secPerPixel = secPerPixel;
    this.draw();
}

timeSlider.prototype.setPeriod = function( period )
{
    this.period = period;
    let tempPeriod = this.calcPeriod( this.currentTime, this.secPerPixel );

    if( this.sliderBeginDate < tempPeriod.start && tempPeriod.end < this.sliderEndDate )
    {
        this.startTime   = tempPeriod.start;
        this.endTime     = tempPeriod.end;
        this.draw();        
    }    
}

timeSlider.prototype.getPeriod = function()
{
    let period = {};
    period.startTime = this.startTime;
    period.endTime = this.endTime;
    return period;
}

timeSlider.prototype.setBeginAndEndDate = function( begin, end )
{
    this.sliderBeginDate.setFullYear( begin.year );
    this.sliderBeginDate.setMonth( begin.month );
    this.sliderBeginDate.setDate( begin.day );
    this.sliderEndDate.setFullYear( end.year );
    this.sliderEndDate.setMonth( end.month );
    this.sliderEndDate.setDate( end.day );

    if( this.currentTime < this.sliderBeginDate || this.sliderEndDate < this.currentTime )
    {
        this.currentTime.setFullYear( begin.year );
        this.currentTime.setMonth( begin.month );
        this.currentTime.setDate( begin.day );
    }

    this.draw();    
}


////////////////////////////////////////////////////////////////
//  local function
////////////////////////////////////////////////////////////////

timeSlider.prototype.initialize = function()
{
    // color
    this.BACKGROUND_COLOR   = "rgba(200,200,200,1.0)";
    this.SLIDER_BAR_COLOR   = "rgba(20,20,20,1.0)";
    this.SLIDER_FRAME_COLOR = "rgba(180,180,180,1.0)";
    this.CURRENT_TIME_COLOR = "rgba(255,0,0,1.0)";    
    this.DISPLAY_PERIOD_COLOR = "rgba(255,0,0,0.3)";
    this.SCALE_COLOR        = "rgba(20,20,20,1.0)";    
    this.TEXT_COLOR         = "rgba(20,20,20,1.0)";

    // slider position
    this.SLIDER_HEIGHT = 0.05;
    this.SLIDER_POS    = 0.88;
    this.CURRENT_TIME_POS = 0.25;
    
    // constant parameter
    this.MINIMUM_SCALELINE_INTERVAL = 43;

    // date
    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;    
    let month = 30 * day; 
    let year  = 365 * day; 
    this.currentTime = new Date(2000, 0, 1);
    this.secPerPixel = month;
    this.period = year * 20;
    this.sliderBeginDate = new Date(1900, 0, 1);
    this.sliderEndDate = new Date(2100, 0, 1);
    let displayPeriod = this.calcPeriod( this.currentTime, this.secPerPixel );
    this.startTime = displayPeriod.start;
    this.endTime = displayPeriod.end;

    // font
    this.textFontScale = "12px 'palatino linotype'";
    this.textFontTime  = "18px 'palatino linotype'";
}

timeSlider.prototype.setUpMouseEvent = function()
{
    this.mouseLeftDrag   = false;
    this.mouseMiddleDrag = false;
    this.mouseRightDrag  = false;
    this.mousePosX = 0;
    this.mousePosY = 0;

    this.canvas.addEventListener("contextmenu", function (event)
    {
        event.preventDefault();
    }, false);

    this.canvas.addEventListener( 'mousedown', function(event)
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
    }.bind(this) );

    this.canvas.addEventListener("mouseup", function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this) );

    this.canvas.addEventListener("mouseout", function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this) );

    this.canvas.addEventListener("mousemove", function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;

        if (this.mouseLeftDrag)
        { 
            this.onMouseLeftDrag(x, y);            
        }
        if (this.mouseRightDrag)
        {
            this.onMouseRightDrag(x, y);            
        }

        this.mousePosX = x;
        this.mousePosY = y;
    }.bind(this) );

    this.canvas.addEventListener('mousewheel', function (event)
    {
        event.preventDefault();
        this.onMouseWheel(event.wheelDelta);
    }.bind(this) );

    this.canvas.addEventListener("touchstart", function (event)
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
    }.bind(this) );
    
    this.canvas.addEventListener("touchmove", function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        
        event.preventDefault();
        if (this.touchmove)
        {
            this.onMouseLeftDrag(x, y);
        }
        this.mousePosX = x;
        this.mousePosY = y;
    }.bind(this) );

    this.canvas.addEventListener("touchend", function (evt)
    {
        event.preventDefault();
        this.touchmove = false;
    }.bind(this) );    
}

timeSlider.prototype.onMouseLeftDrag = function(x, y)
{
    let diffX = this.mousePosX - x;
    let diffTime = diffX * this.secPerPixel;

    let min   = 60;
    let hour  = 60 * min;
    let day   = 24 * hour;
    let month = 30 * day;
    let year  = 365 * day;

    let timeUnit = this.getTimeUnit( Math.abs( diffTime ) );
    let unit = timeUnit.unit;

    tempTime = new Date( this.currentTime.getFullYear(), this.currentTime.getMonth(), this.currentTime.getDate(),
                         this.currentTime.getHours(), this.currentTime.getMinutes(), this.currentTime.getSeconds() );
    let time = Math.abs( diffTime )
    let remainder = 0;
    let diffYear  = Math.floor( time / year );
    remainder     = time % year;
    let diffMonth = Math.floor( remainder / month );
    remainder     = remainder % month;
    let diffDate  = Math.floor( remainder / day );   
    remainder     = remainder % day;   
    let diffHour  = Math.floor( remainder / hour );
    // remainder     = remainder % hour;    
    // let diffMin   = Math.floor( remainder / min );
    // let diffsec   = Math.floor( remainder % sec );

    if( diffTime < 0 )
    {
        diffYear  = -diffYear;
        diffMonth = -diffMonth;
        diffDate  = -diffDate;  
        diffHour  = -diffHour;   
    }
    tempTime.setFullYear( tempTime.getFullYear() + diffYear );
    tempTime.setMonth( tempTime.getMonth() + diffMonth );
    tempTime.setDate( tempTime.getDate() + diffDate );
    tempTime.setHours( tempTime.getHours() + diffHour );
    // tempTime.setMinutes( tempTime.getMinutes() + diffMin );
    // tempTime.setSeconds( tempTime.getSeconds() + diffSec );

    if( this.sliderBeginDate < tempTime && tempTime < this.sliderEndDate )
    {
        this.currentTime = tempTime;
        this.draw();        
    }
}

timeSlider.prototype.onMouseRightDrag = function(x, y)
{
}

timeSlider.prototype.onMouseWheel = function( delta )
{
    let rate = this.secPerPixel * 0.0005;
    let tempScale = this.secPerPixel - delta * rate;
    let prevSecPerPixel = this.secPerPixel;
    
    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;
    let month = 30 * day;
    let year  = 365 * day;

    if( day * 0.1 > tempScale ) return;

    this.secPerPixel = tempScale;
    this.draw();     
}

timeSlider.prototype.getTimeUnit = function( time )
{
    let timeUnit = {};

    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;
    let month = 30 * day;
    let year  = 365 * day;

    timeUnits = [
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

    for( let i = 0; i < timeUnits.length; ++i )
    {
        if( time > timeUnits[i].sec )
        {
            if( i == 0 ){
                timeUnit = timeUnits[i];
            }
            else{
                timeUnit = timeUnits[i-1];
            }
            break;
        }
    }        

    return timeUnit;
}

timeSlider.prototype.draw = function()
{
    let displayPeriod = this.calcPeriod( this.currentTime, this.secPerPixel );
    this.startTime = displayPeriod.start;
    this.endTime = displayPeriod.end;

    this.drawBackGround();

    this.drawTimeSliderBar();

    this.drawScale(); 

    this.drawDate();
}

timeSlider.prototype.drawBackGround = function()
{
    let ctx = this.context;
    ctx.fillStyle = this.BACKGROUND_COLOR;
    ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
}

timeSlider.prototype.drawTimeSliderBar = function()
{
    let ctx = this.context;
    let x      = 0;
    let y      = this.canvas.height * this.SLIDER_POS;
    let width  = this.canvas.width;
    let height = this.canvas.height * this.SLIDER_HEIGHT;    
    ctx.fillStyle = this.SLIDER_BAR_COLOR;    
    ctx.fillRect( x, y, width, height );
    ctx.strokeStyle = this.SLIDER__FRAME_COLOR;
    ctx.strokeRect( x, y, width, height );    
}

timeSlider.prototype.drawScale = function()
{
    let ctx = this.context;
    ctx.font = this.textFontScale;

    let maxNumScaleLines = Math.floor( this.canvas.width / this.MINIMUM_SCALELINE_INTERVAL );
    let displayPeriod = this.canvas.width * this.secPerPixel;
    let timePerLine = displayPeriod / maxNumScaleLines;
    let timeUnit = this.getTimeUnit( timePerLine );
    let numScaleLines = Math.floor( displayPeriod / timeUnit.sec );
    let interval = this.canvas.width / ( displayPeriod / timeUnit.sec );    

    let length = timeUnit.unitLength;
    let unit   = timeUnit.unit;    
    let currentYear   = this.currentTime.getFullYear();
    let currentMonth  = this.currentTime.getMonth() + 1;
    let currentDate   = this.currentTime.getDate();
    let currentHour   = this.currentTime.getHours();
    
    let backLineOffset = 0;
    let forwardLineOffset = 0;
    let startNumber = 0;    
    if( unit == "year" ) {
        let numDays = this.getNumDays( currentYear, currentMonth );
        backLineOffsetYear  = ( currentYear % length ) / length;
        backLineOffsetMonth = ( currentMonth - 1 ) / 12 / length;
        backLineOffsetDay   = currentDate / numDays / 12 / length;        
        backLineOffset = ( backLineOffsetYear + backLineOffsetMonth + backLineOffsetDay ) * interval;
        forwardLineOffset = interval - backLineOffset;
        startNumber = currentYear - currentYear % length;
    } else if( unit == "month" ) {
        let numDays = this.getNumDays( currentYear, currentMonth );
        backLineOffsetMonth = ( ( currentMonth - 1 ) % length ) / length;
        backLineOffsetDay = ( currentDate - 1 ) / numDays / length;
        backLineOffsetHour = currentHour / 24 / numDays / length;
        backLineOffset = ( backLineOffsetMonth + backLineOffsetDay + backLineOffsetHour ) * interval;
        forwardLineOffset = interval - backLineOffset;
        startNumber = Math.floor( ( currentMonth - 1 ) / length ) * length + 1;      
    }

    function drawLine( startX, startY, stopX, stopY ){
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo( startX, startY );
        ctx.lineTo( stopX, stopY );
        ctx.stroke();
    }

    function calcFontSize( x, maxSizePos, unit ){
        let maxFontSize = 24;
        if( unit == "month" ){
            maxFontSize = 32;
        }
        let size = maxFontSize / ( Math.abs( maxSizePos - x ) * 0.01 + 1 );
        if (size < 12) size = 12;
        return Math.floor( size );
    }

    function drawScale( text, x, y, maxSizePos, unit ){
        let font = "'palatino linotype'";
        ctx.font = calcFontSize( x, maxSizePos, unit ) + "px " + font;  
        ctx.fillText( text, x, y );
    }

    // draw scale
    let currentTimePos = this.canvas.width * this.CURRENT_TIME_POS;
    let linePosStartY = ( this.SLIDER_POS - 0.07 ) * this.canvas.height;
    let linePosStopY  = this.SLIDER_POS * this.canvas.height;        
    let linePosX = currentTimePos - backLineOffset;
    let year = currentYear;
    let i = 0;
    let textPosY
    while(1)
    {
        if( linePosX < 0 ) break;
        drawLine( linePosX, linePosStartY, linePosX, linePosStopY );

        let number = startNumber - i * length;
        if( unit == "month" ) {
            number = ( number + 12 * 10 ) % 12;
            if( number == 1 ){
                let fontSize =  calcFontSize( linePosX, currentTimePos, unit )
                textPosY = ( this.SLIDER_POS - fontSize / 130 - 0.1 ) * this.canvas.height;            
                ctx.font = this.textFontScale;
                ctx.fillText( year, linePosX, textPosY );
                --year;                
            }
            else if( number == 0 ){
                number = 12;                
            }
        }
        textPosY = ( this.SLIDER_POS - 0.1 ) * this.canvas.height;
        drawScale( number, linePosX, textPosY, currentTimePos, unit );        

        linePosX -= interval;       
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
                let fontSize =  calcFontSize( linePosX, currentTimePos, unit )
                textPosY = ( this.SLIDER_POS - fontSize / 130 - 0.1 ) * this.canvas.height;  
                ctx.font = this.textFontScale;
                ctx.fillText( year, linePosX, textPosY );
            }
            else if( number == 0 ){
                number = 12;                
            }
        }        
        textPosY = ( this.SLIDER_POS - 0.1 ) * this.canvas.height;
        drawScale( number, linePosX, textPosY, currentTimePos, unit );

        linePosX += interval;  
        ++i;       
    }    
}

timeSlider.prototype.drawDate = function()
{
    let ctx = this.context;
    ctx.font = this.textFontTime;

    let currentYear   = this.currentTime.getFullYear();
    let currentMonth  = this.currentTime.getMonth() + 1;
    let currentDate   = this.currentTime.getDate();

    ctx.fillStyle = this.CURRENT_TIME_COLOR;
    let rectWidth = 2;
    let rectLeft  = this.canvas.width * this.CURRENT_TIME_POS - rectWidth / 2;    
    ctx.fillRect( rectLeft, 0, rectWidth, this.canvas.height );

    ctx.fillStyle = this.DISPLAY_PERIOD_COLOR;
    rectWidth = this.period / this.secPerPixel;
    rectLeft  = this.canvas.width * this.CURRENT_TIME_POS;    
    ctx.fillRect( rectLeft, 0, rectWidth, this.canvas.height );

    ctx.fillStyle = this.CURRENT_TIME_COLOR;
    rectWidth = 2;
    rectLeft  = this.canvas.width * this.CURRENT_TIME_POS + this.period / this.secPerPixel;    
    ctx.fillRect( rectLeft, 0, rectWidth, this.canvas.height );

    ctx.fillStyle = "rgba( 20, 20, 20, 1.0 )";	
    ctx.fillText(  currentYear , 15, 30 );
    ctx.fillText(  currentMonth + "/" + currentDate, 15, 55 );
}

timeSlider.prototype.getNumDays = function( year, month )
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

timeSlider.prototype.calcPeriod = function( currentTime, secPerPixel )
{
    let min   = 60;
    let hour  = 60 * min;
    let day   = 24 * hour;
    let month = 30 * day;
    let year  = 365 * day;

    let currentYear  = currentTime.getFullYear();
    let currentMonth = currentTime.getMonth() + 1;
    let currentDay   = currentTime.getDate();    
    
    let endDate = new Date( 2000, 0, 1 );
    let diffYear = Math.floor( this.period / year );
    let remainder = this.period % year;
    let diffMonth = Math.floor( remainder / month );
    remainder = this.period % month;
    let diffDay = Math.floor( remainder / day );
    endDate.setFullYear( currentYear + diffYear );
    endDate.setMonth( currentMonth + diffMonth - 1 );    
    endDate.setDate( currentDay + diffDay ); 

    return { "start":currentTime, "end":endDate };
}