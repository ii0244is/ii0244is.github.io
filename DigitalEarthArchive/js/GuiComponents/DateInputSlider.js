
let DateInputSlider = function()
{
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%"
    this.canvas.style.height = "80px"
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid";     
    this.canvas.style.cursor = "pointer";
    // this.fontStyle = "Arial Black";

    // slider position
    this.SCALE_CHANGE_RATE = 0.0008;
    this.SCALE_BAR_HEIGHT  = 0.08;
    this.SCALE_BAR_POS_Y   = 0.8;

    // constant parameter
    this.MINIMUM_SCALELINE_INTERVAL = 50;

    // date
    let min  = 60;
    let hour = 60 * min   
    let day  = 24 * hour;
    this.currentTime = {
        year  : 2000,
        month : 1,
        day   : 1,
        hour  : 0,
        min   : 0,
        sec   : 0,
    }
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
    this.currentTime.year  = value.year;
    this.currentTime.month = value.month;
    this.currentTime.day   = value.day ;    
    this.draw();
}

DateInputSlider.prototype.getValue = function()
{
    let val = {};
    val.year  = this.currentTime.year;
    val.month = this.currentTime.month;
    val.day   = this.currentTime.day;
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
    let year  = this.currentTime.year; 
    let month = this.currentTime.month;
    let day   = this.currentTime.day;
    let hour  = this.currentTime.hour;
    let min   = this.currentTime.min;
    let sec   = this.currentTime.sec;
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
    let secPerMin  = 60;
    let secPerHour = 60 * secPerMin;
    let secPerDay  = 24 * secPerHour;
    let days = Math.floor( Math.abs( diffSec ) / secPerDay );
    let seconds = Math.floor( Math.abs( diffSec ) % secPerDay );

    if( diffSec < 0 ){
        seconds = -seconds;
    }
    let time = calcTime( hour, min, sec, seconds );
    if( diffSec < 0 ){
        days = -days;        
    }
    if( time.d !== 0 ){
        days += time.d;      
    }
    let date = calcDate( year, month, day, days );

    return {
        year  : date.y,
        month : date.m,
        day   : date.d,
        hour  : time.h,
        min   : time.m,
        sec   : time.s,
    }
}

DateInputSlider.prototype.calcDiff = function( date1, date2 )
{
    let d1 = convertDateToDays( date1.year, date1.month, date1.day );
    let d2 = convertDateToDays( date2.year, date2.month, date2.day );    

    let diffSec = 0;
    let offsetHour = 0;
    let plus = true;
    if( d1 > d2 ){
        --d1; 
        diffSec = ( d1 - d2 ) * 24 * 60 * 60;
        offsetHour = 24;
    }else if( d1 < d2 ){
        --d2; 
        diffSec = ( d2 - d1 ) * 24 * 60 * 60;
        plus = false;
        offsetHour = 24;
    }else{
        if( date1.hour < date2.hour ){
            plus = false;
        }else if( date1.hour === date2.hour ){
            if( date1.min < date2.min ){
                plus = false;
            }else if( date1.min === date2.min ){
                if( date1.sec < date2.sec ){
                    plus = false;
                }
            }
        }
    }

    let ta, tb;

    if( plus ){
        ta = { h:date1.hour, m:date1.min, s:date1.sec };
        tb = { h:date2.hour, m:date2.min, s:date2.sec };
        ta.h += offsetHour;
    }else{
        ta = { h:date2.hour, m:date2.min, s:date2.sec };
        tb = { h:date1.hour, m:date1.min, s:date1.sec };
        ta.h += offsetHour;
    }

    function calcSec( h, m, s ){
        return h * 60 * 60 + m * 60 + s;
    }
    diffSec += calcSec( ta.h, ta.m, ta.s ) - calcSec( tb.h, tb.m, tb.s );
    
    if( !plus ){
        diffSec = -diffSec;
    }
    return diffSec;
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

    // calc unit
    let maxNumScaleLines = Math.floor( width / this.MINIMUM_SCALELINE_INTERVAL );
    let secDisplayPeriod = width * this.secPerPixel;
    let secPerLine = secDisplayPeriod / maxNumScaleLines;    
    let timeUnit = this.calcTimeUnit( secPerLine );

    let current = this.currentTime;
    let diff = Math.floor( width / 2 * this.secPerPixel );
    let timeLeftSide = this.calcDate( current.year, current.month, current.day, 
        current.hour, current.min, current.sec, -diff );
    
    let startTime = {};
    if( timeUnit.unit == "year" ) {
        let startYear = Math.floor( timeLeftSide.year / timeUnit.unitLength ) * timeUnit.unitLength;
        startTime.year = startYear;
        startTime.month = 1;
        startTime.day = 1;
    }else if( timeUnit.unit == "month" ) {
        let startMonth = Math.floor( timeLeftSide.month / timeUnit.unitLength + 1 ) * timeUnit.unitLength + 1;
        startTime.year = timeLeftSide.year - 1;
        startTime.month = startMonth;
        startTime.day = 1;
    }

    function drawLine( startX, startY, stopX, stopY ){
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo( startX, startY );
        ctx.lineTo( stopX, stopY );
        ctx.stroke();
    }

    let time = {};

    time.year = 1; time.month = 1; time.day = 1;
    time.hour = 0; time.min = 0; time.sec = 0;    
    let diffSec = this.calcDiff( time, timeLeftSide );
    let posX = diffSec / this.secPerPixel;   
    if( 0 < posX && posX < width ){
        ctx.strokeStyle = "rgb( 128, 128, 128 )";
        drawLine( posX, 0, posX, height );
    }

    time.year = startTime.year;
    time.month = startTime.month;
    time.day = startTime.day;
    time.hour = 0;
    time.min = 0;
    time.sec = 0;

    let count = 0;
    ctx.strokeStyle = "rgba(" + this.TextColorR + "," + this.TextColorG + "," + this.TextColorB +"," + this.TextColorA + ")";
    while( 1 ){

        if( timeUnit.unit == "year" ) {
            time.year = startTime.year + timeUnit.unitLength * count;
        }else if( timeUnit.unit == "month" ) {
            let month = startTime.month + timeUnit.unitLength * count;
            if( month % 12 === 0 ){
                let year = Math.floor( month / 12 );
                time.year = startTime.year + year - 1;
                time.month = 12;
            }else{
                let year = Math.floor( month / 12 );
                month = month - year * 12;
                time.year = startTime.year + year;
                time.month = month;
            }
        }

        if( time.year === 0 ){
            ++count;
            continue;
        }

        diffSec = this.calcDiff( time, timeLeftSide );
        posX = diffSec / this.secPerPixel;   
        drawLine( posX, height * 0.7, posX, height * 0.85 );

        ctx.font = "12px " + this.fontStyle;
        let text = "";
        if( timeUnit.unit == "year" ) {
            text = Math.abs( time.year );
        }else if( timeUnit.unit == "month" ) {
            text = time.month;
        }
        let textWidth = ctx.measureText( text ).width;                
        ctx.fillText( text, posX - textWidth / 2 , height * 0.65 );

        if( timeUnit.unit == "month" && time.month === 1 ){
            ctx.font = "10px " + this.fontStyle;
            text = Math.abs( time.year );
            textWidth = ctx.measureText( text ).width;                
            ctx.fillText( text, posX - textWidth / 2 , height * 0.48 );            
        }

        if( posX > width ){
            break;
        }

        ++count
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
    let currentTimeText = Math.abs( this.currentTime.year ) + " " + this.currentTime.month + "/" + this.currentTime.day;
    if( this.currentTime.year < 0 ){
        currentTimeText = "BC " + currentTimeText;
    }
    ctx.fillText( currentTimeText, 10, 23 );    
}

////////////////////////////////////////////////////////
// CalcTime
////////////////////////////////////////////////////////

function calcTime( h, m, s, diff )
{
    let secPerMin  = 60;
    let secPerHour = 60 * secPerMin;
    let secPerDay  = 24 * secPerHour;

    let day = Math.floor( Math.abs( diff ) / secPerDay );
    let sec = Math.abs( diff ) % secPerDay;

    let hour = Math.floor( sec / secPerHour );
    sec = sec % secPerHour;

    let min = Math.floor( sec / secPerMin );
    sec = sec % secPerMin;    

    let time = {};
    if( diff > 0 ){
        time.s = s + sec;
        if( time.s >= 60 ){
            time.s -= 60;
            ++min; 
        }
        time.m = m + min;
        if( time.m >= 60 ){
            time.m -= 60;
            ++hour;
        }
        time.h = h + hour;
        if( time.h >= 24 ){
            time.h -= 24;
            ++day;
        }
        time.d = day;
    }else{
        time.s = s - sec;
        if( time.s < 0 ){
            time.s += 60;
            ++min; 
        }
        time.m = m - min;
        if( time.m < 0 ){
            time.m += 60;
            ++hour;
        }
        time.h = h - hour;
        if( time.h < 0 ){
            time.h += 24;
            ++day;
        }
        time.d = -day;
    }

    return time;
}

////////////////////////////////////////////////////////
// CalcDate
////////////////////////////////////////////////////////

function calcDate( year, month, day, diffDays ){
    let d = convertDateToDays( year, month, day ) + diffDays;
    return convertDaysToDate( d );
}

//
// 年月日を西暦１年１月１日を０日とした時の日数に換算する。
//
function convertDateToDays( year, month, day ){
    let days = calcNumDaysByYear( year );  

    days += calcNumDaysByMonth( year, month ); 
    if( year <= -1 ){
        days += day - 1;
    }else{
        days += day - 1;
    }

    return days;
}

//
// 西暦１年の１月１日をゼロとした時に、
// 指定した年の１月１日が何日目かを求める。
//
function calcNumDaysByYear( year ){
    
    let y = year;
    let d = 0;

    if( year >= 1 ){
        // 西暦は１年から始まる。
        y = year - 1;
    }else if( year <= -1 ){
        y = -year;
    }

    // 単純に 365 日をかける。
    d = y * 365;
    
    // うるう年の数だけ日数を加える。
    d += Math.floor( y / 4 );

    // 100年に一度、４で割り切れるけどうるう年じゃない年がある。
    d -= Math.floor( y / 100 );

    // 400年に一度、ハイパー微調整でうるう年の年がある。
    d += Math.floor( y / 400 );

    if( year <= -1 ){
        d = -d;
    }

    return d;
}

//
// 指定した月の１日が指定した年の１月１日から数えて何日目かを計算する。
//
function calcNumDaysByMonth( year, month ){
    let days = 0;
    if( month === 1 ){
        return 0;
    }else if( month === 2 ){
        return 31; // 31
    }else if( month === 3 ){
        days = 59; // 31 + 28
    }else if( month === 4 ){
        days = 90; // 59 + 31
    }else if( month === 5 ){
        days = 120; // 90 + 30
    }else if( month === 6 ){
        days = 151; // 120 + 31
    }else if( month === 7 ){
        days = 181; // 151 + 30
    }else if( month === 8 ){
        days = 212; // 181 + 31
    }else if( month === 9 ){
        days = 243; // 212 + 31
    }else if( month === 10 ){
        days = 273; // 242 + 30
    }else if( month === 11 ){
        days = 304; // 273 + 31
    }else if( month === 12 ){
        days = 334; // 304 + 30
    }

    if( isLeapYear( year ) ){
        ++days;
    }

    return days;
}


//
// 西暦１年１月１日を０日とした時の日数を年月日に換算する。
//
function convertDaysToDate( days ){

    let v = calcYearByNumDays( days );
    let y = v.y;
    let d = v.d;
    v = calcMonthByNumDays( y, d );    
    m = v.m;
    d = v.d;

    return { y, m, d };
}

//
// 西暦１年１月１日を０日とした時の日数から年を計算する。
//
function calcYearByNumDays( days ){

    let days4Y = 365 * 4 + 1;
    let days100Y = days4Y * 25 - 1;
    let days400Y = days100Y * 4 + 1;

    let numDays = Math.abs( days );
    let num400Y = Math.floor( numDays / days400Y );
    let remainder400Y = numDays % days400Y

    let num100Y = Math.floor( remainder400Y / days100Y );
    let remainder100Y = remainder400Y % days100Y;
    if( num100Y >= 4 ){
        num100Y = 3;
        remainder100Y = remainder400Y - num100Y * days100Y;
    }

    let num4Y = Math.floor( remainder100Y / days4Y );
    remainder4Y = remainder100Y % days4Y;

    if( num4Y >= 25 ){
        num4Y = 24;
        remainder4Y = remainder100Y - num4Y * days4Y;
    }
    
    let numY = Math.floor( remainder4Y / 365 );
    let remainderY = remainder4Y % 365; 

    let y = 0;
    let d = 0;
    if( days >= 0 ){
        if( numY >= 4 ){
            y = num400Y * 400 + num100Y * 100 + num4Y * 4 + 4;
            d = remainder4Y - ( 3 * 365 );        
        }else{
            y = num400Y * 400 + num100Y * 100 + num4Y * 4 + numY + 1;
            d = remainderY;
        }  
    }else{
        if( numY >= 4 ){
            y = -( num400Y * 400 + num100Y * 100 + num4Y * 4 + 4 );
            d = 1;  
            return { y, d };
        }

        if( remainderY === 0 ){
            y = -( num400Y * 400 + num100Y * 100 + num4Y * 4 + numY );
            return { y, d };
        }

        y = -( num400Y * 400 + num100Y * 100 + num4Y * 4 + numY + 1 );
        if( isLeapYear( y ) ){
            d = ( 366 - remainderY );
        }else{
            d = ( 365 - remainderY );
        }    
    }

    return { y, d };
}

//
// １月１日からの経過日数を指定すると、その日が何月何日を返す。
//
function calcMonthByNumDays( year, days ){

    let m = 1;
    let d = 0;
    let leap = 0;
    if( isLeapYear( year ) ){
        leap = 1;
    }
    // console.log( year, days )

    if( days < 31 ){
        m = 1;
        d = days;
    }else if( days < ( 59 + leap ) ){
        m = 2;
        d = days - 31;
    }else if( days < ( 90 + leap ) ){
        m = 3;
        d = days - 59 - leap;
    }else if( days < ( 120 + leap ) ){
        m = 4;
        d = days - 90 - leap;
    }else if( days < ( 151 + leap ) ){
        m = 5;
        d = days - 120 - leap;
    }else if( days < ( 181 + leap ) ){
        m = 6;
        d = days - 151 - leap;
    }else if( days < ( 212 + leap ) ){
        m = 7;
        d = days - 181 - leap;
    }else if( days < ( 243 + leap ) ){
        m = 8;
        d = days - 212 - leap;
    }else if( days < ( 273 + leap ) ){
        m = 9;
        d = days - 243 - leap;
    }else if( days < ( 304 + leap ) ){
        m = 10;
        d = days - 273 - leap;
    }else if( days < ( 334 + leap ) ){
        m = 11;
        d = days - 304 - leap;
    }else if( days < ( 365 + leap ) ){
        m = 12;
        d = days - 334 - leap;
    }

    ++d;

    return { m, d }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

//
// 指定した年がうるう年かどうかを判定する。
//
function isLeapYear( year )
{
    if( year % 4 == 0 ){
        if( year % 100 == 0 ){
            if( year % 400 == 0 ){
                return true;
            }    
            return false;
        }
        return true;
    }else{
        return false;
    }
}

//
// 指定した月の日数を返す。
//
function getNumDays( year, month )
{
    if( month == 1 || month == 3 || month == 5 || month == 7 || 
        month == 8 || month == 10 || month == 12 ){
        return 31;
    }else if( month == 2 ){
        if( isLeapYear( year ) ){
            return 29;
        }else{
            return 28;
        }
    }
    return 30;
}