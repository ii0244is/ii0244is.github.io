
let TimeTraveler = function ()
{
    this.targetTime = {};
    this.startTime = {};
    this.transitionTime = 500;    
    this.elapsedTime = 0;
    this.isTransitionFinished = true;    
}

TimeTraveler.prototype.startTransition = function ( target, time )
{
    this.transitionTime = time;
    this.elapsedTime = 0;
    this.isTransitionFinished = false;
    this.targetTime = target;

    let currentTime = g_timeFilter.getCurrentDate();    
    this.diffYear   = target.year  - currentTime.year;
    this.diffMonth  = target.month - currentTime.month;
    this.diffDay    = target.day   - currentTime.day;

    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;    
    let month = 30 * day; 
    let year  = 12 * month;     
    this.startScale = g_timeFilter.getTimeSliderScale();
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

TimeTraveler.prototype.updateTime = function ()
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
        let target = {}
        target.year  = this.targetTime.year;
        target.month = this.targetTime.month;
        target.day   = this.targetTime.day;
        g_timeFilter.setCurrentDate( target );
        this.isTransitionFinished = true;        
    } else {
        // let current =  g_timeFilter.getCurrentDate();
        // console.log( current.year, current.month, current.date );
        // console.log( nextScale );
        current = g_timeFilter.getCurrentDate();  
        next = addDate( current.year, current.month, current.day, diffY, diffM, diffD );
        g_timeFilter.setCurrentDate( next );    
        g_timeFilter.setTimeSliderScale( nextScale );        
    }
}