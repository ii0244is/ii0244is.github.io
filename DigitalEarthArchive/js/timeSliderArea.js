
let timeSliderArea = function ()
{
    // DOM 生成
    this.createGui();
}

timeSliderArea.prototype.getWidth = function ()
{
    let rect = this.dom.getBoundingClientRect();
    return rect.width;
}

timeSliderArea.prototype.getHeight = function ()
{
    let rect = this.dom.getBoundingClientRect();
    return rect.height;
}

timeSliderArea.prototype.setPosition = function( x, y )
{
    this.dom.style.left = x;
    this.dom.style.top = y; 
}

timeSliderArea.prototype.getPeriod = function ()
{
    return this.timeSliderObj.getPeriod();
}

timeSliderArea.prototype.setPeriod = function (period)
{
    return this.timeSliderObj.setPeriod(period);
}

timeSliderArea.prototype.getDisplayPeriod = function ()
{
    let period = {};
    period.value = this.periodInput.value;
    period.unit = this.periodUnit.value;
    return period;
}

timeSliderArea.prototype.setDisplayPeriod = function( value, unit )
{
    this.periodInput.value = value;
    for( let i = 0; this.periodUnit.length; ++i )
    {
        if( this.periodUnit.options[i].value == unit ){
            this.periodUnit.options.selectedIndex = i;
            this.periodUnit.selectedIndex = i;
            break;
        }
    }
    this.updatePeriod();
}

timeSliderArea.prototype.getCurrentDate = function()
{
    return this.timeSliderObj.getCurrentDate();
}

timeSliderArea.prototype.addDate = function( year, month, day )
{
    return this.timeSliderObj.addDate( year, month, day);
}

timeSliderArea.prototype.setCurrentDate = function( year, month, day, hour, min, sec )
{
    this.timeSliderObj.setCurrentDate( year, month, day, hour, min, sec )   
}

timeSliderArea.prototype.setBeginAndEndDate = function( begin, end )
{
    this.timeSliderObj.setBeginAndEndDate( begin, end )
}

timeSliderArea.prototype.getTimeSliderScale = function()
{
    return this.timeSliderObj.getTimeSliderScale();
}

timeSliderArea.prototype.setTimeSliderScale = function( secPerPixel )
{
    this.timeSliderObj.setTimeSliderScale( secPerPixel );
}

timeSliderArea.prototype.createGui = function()
{
    // DOM 生成
    this.dom = document.createElement("div");
    this.dom.classList.add("timeSliderArea");
    this.dom.onmousedown = function(){
        g_paramSet.setView("DataList");
        g_popup.hide();
    }.bind(this);

    // タイムスライダー生成
    let rect = this.dom.getBoundingClientRect();
    this.timeSliderObj = new timeSlider( this.dom, 380, 120 );
    this.timeSliderObj.canvas.classList.add("timeSliderStyle");
    
    // 表示期間設定
    this.periodInputArea = document.createElement("div");    
    this.periodInputArea.classList.add("periodInputAreaStyle");
    this.periodInput = document.createElement("input");
    this.periodInput.type = "number";
    this.periodInput.classList.add("periodInputStyle");
    this.periodInputArea.appendChild(this.periodInput)
    this.periodUnit = document.createElement("select");
    this.periodUnitYear = document.createElement("option");
    this.periodUnitYear.textContent = "years";
    this.periodUnitYear.value = "year";
    this.periodUnitDay = document.createElement("option");    
    this.periodUnitDay.textContent = "days";
    this.periodUnitDay.value = "day";
    this.periodUnit.appendChild( this.periodUnitDay );
    this.periodUnit.appendChild( this.periodUnitYear );
    this.periodInputArea.appendChild(this.periodUnit)
    this.dom.appendChild(this.periodInputArea);
    this.periodInput.onchange = this.updatePeriod.bind(this);
    this.periodUnit.onchange = this.updatePeriod.bind(this);

    // 表示
    this.setPosition( 0, 0 );
    this.setDisplayPeriod( 1, "year" );    
    document.body.appendChild( this.dom );
}

timeSliderArea.prototype.updatePeriod = function()
{
    let min   = 60;
    let hour  = 60 * min   
    let day   = 24 * hour;  
    let year  = 365 * day;  
    let period = Number(this.periodInput.value);
    if( this.periodUnit.value == "day"){
        this.timeSliderObj.setPeriod( period * day );            
    }else{
        this.timeSliderObj.setPeriod( period * year ); 
    }
}
