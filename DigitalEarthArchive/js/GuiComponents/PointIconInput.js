
let PointIconInput = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.backgroundColor = "#fff";
    this.dom.style.color = "#111";

    this.dom.style.width = "calc( 100% - 30px )";    
    this.dom.style.padding = "10px 15px 10px 15px";
    this.dom.style.margin  = "10px 0px 10px 0px"; 
    this.dom.style.borderRadius = "10px"    

    this.dom.appendChild( g_pointIcon.getIconSelectorDom() );
    g_pointIcon.setIconChangeCallback( function( value ){
        if( this.onchange ){
            this.onchange( value );
        }
    }.bind(this) )
}

PointIconInput.prototype.resize = function()
{
}

PointIconInput.prototype.setValue = function( value )
{
    g_pointIcon.setIcon( value );
}

PointIconInput.prototype.getValue = function()
{
    return g_pointIcon.getSelectedIcon;
}

PointIconInput.prototype.getDom = function()
{
    return this.dom
}