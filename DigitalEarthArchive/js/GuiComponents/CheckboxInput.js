
let CheckboxInput = function()
{
    this.dom = document.createElement("input");
    this.dom.type = "checkbox";

    this.onchange = null;
    this.dom.onchange = function(){
        if( this.onchange ){
            this.onchange( this.getValue() )
        }
    }.bind(this)        
}

CheckboxInput.prototype.resize = function()
{
}

CheckboxInput.prototype.setValue = function( value )
{
    this.dom.checked = value;
}

CheckboxInput.prototype.getValue = function()
{
    return this.dom.checked;
}

CheckboxInput.prototype.getDom = function()
{
    return this.dom
}