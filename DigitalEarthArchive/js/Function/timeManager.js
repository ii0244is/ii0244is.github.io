
let timeManager = function ()
{
    this.targetTime = {};
    this.startTime = {};
    this.transitionTime = 500;    
    this.elapsedTime = 0;
    this.isTransitionFinished = true;    
}

timeManager.prototype.startTransition = function ( target, time )
{
    this.targetTime.year   = Number( target.substr(0, 4) );
    this.targetTime.month  = Number( target.substr(5, 2) );
    this.targetTime.day    = Number( target.substr(8, 2) );

    this.transitionTime = time;
    this.elapsedTime = 0;
    this.isTransitionFinished = false;

    let currentTime = g_timeSlider.getCurrentDate();    
    this.diffYear   = this.targetTime.year - currentTime.year;
    this.diffMonth  = this.targetTime.month - currentTime.month;
    this.diffDay    = this.targetTime.day - currentTime.day;

    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;    
    let month = 30 * day; 
    let year  = 12 * month;     
    this.startScale = g_timeSlider.getTimeSliderScale();
    if( Math.abs( this.diffYear ) > 1 ){
        this.targetScale = day * Math.abs( this.diffYear );
    } else if( Math.abs( this.diffMonth ) > 1 ){
        this.targetScale = hour * Math.abs( this.diffMonth );
    } else {
        this.targetScale = hour;        
    }
    this.a_s = -2.0;
    this.c_s = this.startScale;
    this.b_s = ( this.targetScale - this.c_s - this.a_s * this.transitionTime * this.transitionTime ) / this.transitionTime;
    
}

timeManager.prototype.updateTime = function ()
{
    if( this.isTransitionFinished ) return;

    this.elapsedTime += 15;
    let diffY = 0;
    let diffM = 0;
    let diffD = 0;

    if( Math.abs( this.diffYear ) > 1 ){
        let diff = this.diffYear * 15 / this.transitionTime;
        if( Math.abs( diff ) > 1 ){
            diffY = Math.floor( diff );
            diffM = Math.floor( ( diff - diffY ) * 12 );
        }else{
            diff = diff * 12;            
            if( Math.floor( diff ) > 1 ){
                diffM = Math.floor( diff );
                diffD = Math.floor( ( diff - diffM ) * 12 );
            }else{
                diffD = diff * 30;
            }                    
        }
    } else if( Math.abs( this.diffMonth ) > 1 ){
        let diff = this.diffMonth * 15 / this.transitionTime;
        if( Math.abs( diff ) > 1 ){
            diffM = Math.floor( diff );
            diffD = Math.floor( ( diff - diffM ) * 30 );
        }else{
            diffD = diff * 30;
        }
    } else {
        let diff = this.diffDay * 15 / this.transitionTime;
        if( Math.abs( diff ) > 1 ){
            diffD = Math.floor( diff );
        }else{
        }
    }
    
    let nextScale = this.a_s * this.elapsedTime * this.elapsedTime + this.b_s * this.elapsedTime + this.c_s;    
    if( this.elapsedTime >= this.transitionTime ){
        g_timeSlider.setCurrentDate( this.targetTime.year, this.targetTime.month-1, this.targetTime.day );
        this.isTransitionFinished = true;        
    } else {
        // let current =  g_timeSlider.getCurrentDate();
        // console.log( current.year, current.month, current.date );
        // console.log( nextScale );
        g_timeSlider.addDate( diffY, diffM, diffD );    
        g_timeSlider.setTimeSliderScale( nextScale );        
    }
}