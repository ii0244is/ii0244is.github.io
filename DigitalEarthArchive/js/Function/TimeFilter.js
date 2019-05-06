
let TimeFilter = function()
{
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.borderRadius = "10px"
    this.dom.style.opacity = "0.6";
    
    this.timeSlider = new DateInputSlider();
    this.dom.appendChild( this.timeSlider.getDom() );
}

TimeFilter.prototype.setSize = function( width, height )
{
    this.dom.style.width = width + "px";
    this.dom.style.height = height + "px";
    this.resize();
}

TimeFilter.prototype.setPosition = function( x, y )
{
    this.dom.style.left = x;
    this.dom.style.bottom = y;
}

TimeFilter.prototype.resize = function()
{
    this.timeSlider.resize();
}

TimeFilter.prototype.getDom = function()
{
    return this.dom;
}

TimeFilter.prototype.getCurrentDate = function()
{
    return this.timeSlider.getValue();
}

TimeFilter.prototype.setCurrentDate = function( date )
{
    this.timeSlider.setValue( date );
}

TimeFilter.prototype.getTimeSliderScale = function()
{
    return this.timeSlider.getTimeScale();
}

TimeFilter.prototype.setTimeSliderScale = function( val )
{
    this.timeSlider.setTimeScale( val )
}