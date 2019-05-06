
let ColorInput = function()
{
    this.params = {};
    this.onchange = null;

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.style.backgroundColor = "#fff";
    this.dom.style.color = "#111";

    this.dom.style.width = "calc( 100% - 30px )";    
    this.dom.style.padding = "15px 15px 15px 15px";
    this.dom.style.margin  = "10px 0px 10px 0px"; 
    this.dom.style.borderRadius = "10px"  
    
    let changeValue = function(){
        let r = this.inputR.getValue();
        let g = this.inputG.getValue();
        let b = this.inputB.getValue();
        let color = "rgb(" + r + "," + g + "," + b + ")";
        this.colorSample.style.backgroundColor = color
        this.colorValue.innerHTML = "R : " + r + "<br>" + "G : " + g + "<br>" + "B : " + b
        if( this.onchange ){
            this.onchange( this.getValue() );
        }
    }.bind(this)

    this.colorSample = document.createElement("div"); 
    this.colorSample.style.width = "100px"
    this.colorSample.style.height = "100px"
    this.colorSample.style.margin = "0px 0px 10px 0px"
    this.colorSample.style.borderRadius = "10px"
    this.colorValue = document.createElement("div"); 

    this.inputR = new NumberInputSlider();
    this.inputR.setValueRange( 0, 255, 0 );
    this.inputR.setBackgroundColor( 255, 220, 220, 1 );
    this.inputR.setScale( 1.5 );
    this.inputR.onchange = changeValue.bind(this);
    this.inputG = new NumberInputSlider();
    this.inputG.setBackgroundColor( 220, 255, 220, 1 );
    this.inputG.setValueRange( 0, 255, 0 );
    this.inputG.setScale( 1.5 );
    this.inputG.onchange = changeValue.bind(this);
    this.inputG.getDom().style.margin = "10px 0px 10px 0px"
    this.inputB = new NumberInputSlider();
    this.inputB.setBackgroundColor( 220, 220, 255, 1 );
    this.inputB.setValueRange( 0, 255, 0 );
    this.inputB.setScale( 1.5 );
    this.inputB.onchange = changeValue.bind(this);

    let colorSampleArea = document.createElement("div"); 
    colorSampleArea.style.display = "flex";
    colorSampleArea.style.flexDirection = "column";
    colorSampleArea.style.alignContent = "space-between";
    colorSampleArea.style.padding = "0px 15px 0px 0px"
    colorSampleArea.appendChild( this.colorSample );
    colorSampleArea.appendChild( this.colorValue );

    let colorInputArea = document.createElement("div"); 
    colorInputArea.style.width = "100%"
    colorInputArea.style.display = "flex";
    colorInputArea.style.flexDirection = "column";
    colorInputArea.appendChild( this.inputR.getDom() );
    colorInputArea.appendChild( this.inputG.getDom() );
    colorInputArea.appendChild( this.inputB.getDom() );

    this.dom.appendChild( colorSampleArea );
    this.dom.appendChild( colorInputArea );    
    
    changeValue()
}

ColorInput.prototype.resize = function()
{
    this.inputR.resize();
    this.inputG.resize();
    this.inputB.resize();
}

ColorInput.prototype.getDom = function()
{
    return this.dom;
}

ColorInput.prototype.setValue = function( value )
{
    let r = value.r;
    let g = value.g;
    let b = value.b;
    let color = "rgb(" + r + "," + g + "," + b + ")";
    this.colorSample.style.backgroundColor = color
    this.colorValue.innerHTML = "R : " + r + "<br>" + "G : " + g + "<br>" + "B : " + b
    this.inputR.setValue( r );
    this.inputG.setValue( g );
    this.inputB.setValue( b );    
}

ColorInput.prototype.getValue = function()
{
    let value = {}
    value.r = this.inputR.getValue();
    value.g = this.inputG.getValue();
    value.b = this.inputB.getValue();    
    return value;
}

