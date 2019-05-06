
let ParametersInput = function()
{
    this.params = {};
    this.onchange = null;

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.backgroundColor = "#fff";
    this.dom.style.color = "#111";

    this.dom.style.width = "calc( 100% - 30px )";    
    this.dom.style.padding = "10px 15px 10px 15px";
    this.dom.style.margin  = "10px 0px 10px 0px"; 
    this.dom.style.borderRadius = "10px"    
}

ParametersInput.prototype.resize = function()
{
    for( let name in this.params ){
        this.params[ name ].input.resize();
    }
}

ParametersInput.prototype.getDom = function()
{
    return this.dom;
}

ParametersInput.prototype.setValue = function( name, value )
{
    this.params[ name ].input.setValue( value );
    if( this.params[ name ].type == "number" ){
        this.params[ name ].label.textContent = name + " : " + value;
    }
}

ParametersInput.prototype.setValueRange = function( name, min, max, digit )
{
    this.params[ name ].input.setValueRange( min, max, digit );
}

ParametersInput.prototype.setScale = function( name, scale )
{
    this.params[ name ].input.setScale( scale );
}

ParametersInput.prototype.getValue = function()
{
    let values = {}
    for( let name in this.params ){
        values[ name ] = this.params[ name ].input.getValue();
    }
    return values;
}

ParametersInput.prototype.addParamInput = function( name, type )
{    
    let inputArea = document.createElement("div"); 
    let label;
    let input;

    if( type == "number" ){
        inputArea.style.display = "flex";
        inputArea.style.flexDirection = "column";
        inputArea.style.padding = "10px 0px 10px 0px";    
    
        label = document.createElement("div");
        label.textContent = name;
        label.style.padding = "2px 0px 2px 0px";

        input = new NumberInputSlider();
        input.onchange = function(value){
            label.textContent = name + " : " + value;
            if( this.onchange ){
                this.onchange( this.getValue() );
            }
        }.bind(this)
        label.textContent = name + " : " + input.getValue();


        inputArea.appendChild( label );
        inputArea.appendChild( input.getDom() );
    }else if( type == "checkbox" ){
        inputArea.style.display = "flex";
        inputArea.style.flexDirection = "row";
        inputArea.style.alignItems = "center";
        inputArea.style.padding = "10px 0px 10px 0px";    
    
        label = document.createElement("div");
        label.textContent = name;
        label.style.margin = "0px 20px 0px 0px";

        input = new CheckboxInput();
        input.onchange = function(value){
            if( this.onchange ){
                this.onchange( this.getValue() );
            }
        }.bind(this)

        inputArea.appendChild( label );
        inputArea.appendChild( input.getDom() );
    }else{
        return;
    }

    this.params[name] = { type:type, label:label, input:input };

    this.dom.appendChild( inputArea );
}
