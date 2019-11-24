
let TimeInputSlider = function(){
    this.canvas = document.createElement("canvas");
    // this.canvas.style.position = "absolute";
    // this.canvas.style.left   = "50px";
    // this.canvas.style.bottom = "50px";
    this.canvas.style.width  = "500px";
    this.canvas.style.height = "100px";
    this.canvas.style.borderRadius = "10px"
    this.canvas.style.border = "1px solid #666";
    this.canvas.style.borderStyle = "solid";    
    this.canvas.style.cursor = "pointer";

    this.mousePosX = 0;
    this.mousePosY = 0;
    this.drag = false;
    this.currentTime = 0;
    this.secPerPixel = 5;   
    
    this.CURRENT_LINE_POS  = 0.5;
    this.SCALE_TEXT_POS_Y  = 0.7;
    this.SCALE_LINE_POS_Y  = 0.72;
    this.SCALE_LINE_HEIGHT = 0.1;
    this.SLIDER_BAR_POS_Y  = 0.80;
    this.SLIDER_BAR_HEIGHT = 0.08;
    
    this.setupEvent();
}

TimeInputSlider.prototype.getDom = function(){
    return this.canvas;
}

TimeInputSlider.prototype.resize = function(){
    this.canvas.width  = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.draw();
}

TimeInputSlider.prototype.setPosition = function( x, y, w, h, align ){

    if( align.match("right") ){
        this.canvas.style.right = x;
        this.canvas.style.left = "";
    }else{
        this.canvas.style.left = x;
        this.canvas.style.right = "";
    }

    if( align.match("bottom") ){
        this.canvas.style.bottom = y;
        this.canvas.style.top = "";
    }else{
        this.canvas.style.top = y;
        this.canvas.style.bottom = "";
    }

    this.canvas.style.width  = w;
    this.canvas.style.height = h;
}

TimeInputSlider.prototype.setTime = function( h, m, s ){
    let time = this.convertHmsToTime( h, m, s );
    if( time < this.startTime ){
        time = this.startTime; 
    }else if( this.stopTime < time ){
        time = this.stopTime; 
    }  
    this.currentTime = time;
    this.draw();
}

TimeInputSlider.prototype.getTime = function(){
    return this.convertTimeToHms( this.currentTime );
}

TimeInputSlider.prototype.setTimeRange = function( start, stop ){
    this.startTime = start;
    this.stopTime = stop
}

TimeInputSlider.prototype.addTime = function( sec ){
    let time = this.currentTime + sec;
    if( time < 0 ){
        time = time + 60 * 60 * 24; 
    }else if( 60 * 60 * 24 < time ){
        time = time - 60 * 60 * 24; 
    }
    // if( time < this.startTime ){
    //     time = this.startTime; 
    // }else if( this.stopTime < time ){
    //     time = this.stopTime; 
    // }
    this.currentTime = time;
    this.draw();
}

/////////////////////////////////////////////////////////
// private
/////////////////////////////////////////////////////////

TimeInputSlider.prototype.setupEvent = function(){

    this.canvas.onmousedown = (e) => {
        let x = e.offsetX || e.layerX;
        let y = e.offsetY || e.layerY;
        this.mousePosX = x;
        this.mousePosY = y;        
        this.drag = true;
    }

    this.canvas.onmousemove = (e) => {
        if( this.drag ){
            let x = e.offsetX || e.layerX;
            let y = e.offsetY || e.layerY;
            let diffX = this.mousePosX - x;
            let diffTime = diffX * this.secPerPixel;
            this.addTime( diffTime );
            if( this.onchange ){
                this.onchange( this.getTime() );
            }
            this.mousePosX = x;
            this.mousePosY = y;   
        }
    }

    this.canvas.onmouseup = (e) => {
        this.drag = false;        
    }

    this.canvas.onmouseout = (e) => {
        this.drag = false;
    }

    this.canvas.onmousewheel = (e) => {
        e.preventDefault();
        let temp = this.secPerPixel * ( 1 - e.wheelDelta * 0.0005 );
        if( temp < 0.75 ){
            temp = 0.75;
        }
        if( temp > 100 ){
            temp = 100;
        }
        this.secPerPixel = temp;
        this.draw();
    }

    this.canvas.ontouchstart = (event) => {
        event.preventDefault();
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        this.mousePosX = x;
        this.mousePosY = y;
        this.drag = true;
    }

    this.canvas.ontouchmove = (event) => {
        event.preventDefault();
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        if( this.drag ){
            let diffX = this.mousePosX - x;
            let diffTime = diffX * this.secPerPixel;
            this.addTime( diffTime );
            if( this.onchange ){
                this.onchange( this.getTime() );
            }
            this.mousePosX = x;
            this.mousePosY = y;   
        }
    }
    
    this.canvas.ontouchend = (event) => {
        this.drag = false;
    }      
}

TimeInputSlider.prototype.draw = function(){
    let ctx = this.canvas.getContext("2d");
    let width = this.canvas.width;
    let height = this.canvas.height;

    ctx.fillStyle = "rgb( 30, 30, 30 )";
    ctx.fillRect( 0, 0, width, height );

    ctx.fillStyle = "rgb( 250, 250, 250 )";
    let barPosY = height * this.SLIDER_BAR_POS_Y;
    let barHeight = height * this.SLIDER_BAR_HEIGHT;    
    ctx.fillRect( 0, barPosY, width, barHeight );    

    let hour = Math.floor( this.currentTime / (60 * 60) ); 
    let remain = this.currentTime - hour * 60 * 60;
    let min  = Math.floor( remain / 60 );
    let sec  = Math.floor( remain % 60 );

    if( min < 10 ){
        min = "0" +min;
    }            
    if( sec < 10 ){
        sec = "0" + sec;
    }        
    let text = hour + " : " + min +" : " + sec;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgb( 250, 250, 250 )";
    ctx.font = "24px Arial Black";
    let timeTextPos = height * 0.3;    
    ctx.fillText( text, timeTextPos, timeTextPos );

    let startTime = this.currentTime - width * this.CURRENT_LINE_POS * this.secPerPixel;
    hour = Math.floor( startTime / (60 * 60) ); 
    remain = startTime - hour * 60 * 60;
    min  = Math.floor( remain / 60 );
    sec  = Math.floor( remain % 60 );    
    let timeUnit = this.calcTimeUnit();

    let time = 0;
    if( timeUnit.unit === "hour" ){
        time = hour;
    }else if( timeUnit.unit === "min" ){
        time = min;
    }else if( timeUnit.unit === "sec" ){
        time = sec;
    }
    let start = Math.floor( time / timeUnit.unitLength ) * timeUnit.unitLength;

    function drawLine( startX, startY, stopX, stopY ){
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo( startX, startY );
        ctx.lineTo( stopX, stopY );
        ctx.stroke();
    }

    let count = 0;
    while(1){
        let val = start + count * timeUnit.unitLength;

        if( timeUnit.unit === "hour" ){
            time = this.convertHmsToTime( val, 0, 0 );
        }else if( timeUnit.unit === "min" ){
            time = this.convertHmsToTime( hour, val, 0 );
        }else if( timeUnit.unit === "sec" ){
            time = this.convertHmsToTime( hour, min, val );
        }

        let posX = this.converTimeToPix( time, startTime );
        if( posX > width ){
            break;
        }

        let hms = this.convertTimeToHms(time);
        let text = "";

        if( timeUnit.unit === "hour" ){
            text = Math.floor( ( 240 + hms.hour ) % 24 ) + ":00";
        }else if( timeUnit.unit === "min" ){
            let hourText = Math.floor( ( 240 + hms.hour ) % 24 );
            let minText = Math.floor( hms.min % 60 );
            if( hms.min < 10 ){
                minText = "0" + hms.min;
            }
            text = hourText + ":" + minText;
        }else if( timeUnit.unit === "sec" ){
            let minText = Math.floor( hms.min % 60 );
            if( hms.min < 10 ){
                minText = "0" + hms.min;
            }            
            let secText = Math.floor( hms.sec % 60 );
            if( hms.sec < 10 ){
                secText = "0" + hms.sec;
            }            
            text = minText + ":" + secText;
        }
        ctx.textBaseline = "bottom"
        ctx.font = "12px Arial Black";
        let textWidth = ctx.measureText( text ).width;
        ctx.fillText( text, posX - textWidth / 2, height * this.SCALE_TEXT_POS_Y );
        ctx.strokeStyle = "rgb(250, 250, 250)";
        let sy = height * this.SCALE_LINE_POS_Y;
        let dy = sy + height * this.SCALE_LINE_HEIGHT;
        drawLine( posX, sy, posX, dy )
        ++count;
    }

    posX = width * this.CURRENT_LINE_POS;
    ctx.strokeStyle = "rgb(255, 0, 0)";
    drawLine( posX, 0, posX, height )
}

TimeInputSlider.prototype.convertHmsToTime = function( hour, min, sec ){
    return  hour * 60 * 60 + min * 60 + sec;
}

TimeInputSlider.prototype.convertTimeToHms = function( time ){
    let hour = Math.floor( time / (60 * 60) ); 
    let remain = time - hour * 60 * 60;
    let min  = Math.floor( remain / 60 );
    let sec  = Math.floor( remain % 60 );
    return { hour, min, sec };
}

TimeInputSlider.prototype.converTimeToPix = function( time, startTime ){
    return ( time - startTime ) / this.secPerPixel;
}

TimeInputSlider.prototype.calcTimeUnit = function(){

    let min   = 60;
    let hour  = 60 * min;
    let day   = 24 * hour;    

    timeUnits = [
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

    let timeUnit = {};
    let lengthPerScale = 45;
    let secPerScale = this.secPerPixel * lengthPerScale;
    for( let i = 0; i < timeUnits.length; ++i )
    {
        if( secPerScale > timeUnits[i].sec )
        {
            if( i === 0 ){
                timeUnit = timeUnits[i];
            }else{
                timeUnit = timeUnits[i-1];
            }
            break;
        }
    }

    return timeUnit;
}