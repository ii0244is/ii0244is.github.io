

let TermInput = function()
{
    this.params = {};
    this.onchange = null;

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.backgroundColor = "#fff";
    this.dom.style.color = "#111";

    this.dom.style.width = "calc( 100% - 30px )";    
    this.dom.style.padding = "15px 15px 15px 15px";
    this.dom.style.margin  = "10px 0px 10px 0px"; 
    this.dom.style.borderRadius = "10px"  
    
    let fromLabel = document.createElement("div");
    fromLabel.style.width = "50px";
    fromLabel.textContent = "From";
    fromLabel.style.margin = "2px 0px 2px 0px";
    this.fromCheckbox = new CheckboxInput();
    this.fromCheckbox.onchange = this.changeValue.bind(this);    
    let fromLabelArea = document.createElement("div");
    fromLabelArea.style.display = "flex";
    fromLabelArea.style.flexDirection = "row";
    fromLabelArea.style.alignItems = "center";
    fromLabelArea.appendChild( fromLabel );
    fromLabelArea.appendChild( this.fromCheckbox.getDom() );
    this.fromDateInput = new DateInputSlider(); 
    this.fromDateInput.onchange = this.changeValue.bind(this);    

    let space = document.createElement("div");
    space.style.width = "100%";
    space.style.height = "10px";

    let toLabel = document.createElement("div");
    toLabel.style.width = "50px";
    toLabel.textContent = "To";
    toLabel.style.margin = "0px 0px 2px 0px";
    this.toCheckbox = new CheckboxInput();
    this.toCheckbox.onchange = this.changeValue.bind(this);
    let toLabelArea = document.createElement("div");
    toLabelArea.style.display = "flex";
    toLabelArea.style.flexDirection = "row";
    toLabelArea.style.alignItems = "center";
    toLabelArea.appendChild( toLabel );
    toLabelArea.appendChild( this.toCheckbox.getDom() );
    this.toDateInput = new DateInputSlider();
    this.toDateInput.onchange = this.changeValue.bind(this);

    this.dom.appendChild(fromLabelArea);
    this.dom.appendChild(this.fromDateInput.getDom());
    this.dom.appendChild(space);
    this.dom.appendChild(toLabelArea);
    this.dom.appendChild(this.toDateInput.getDom());

    this.changeValue()
}

TermInput.prototype.resize = function()
{
    this.fromDateInput.resize();
    this.toDateInput.resize();    
}

TermInput.prototype.getDom = function()
{
    return this.dom;
}

TermInput.prototype.setValue = function( value )
{
    this.fromCheckbox.setValue( value.enableFrom );
    this.fromDateInput.setValue( value.from );
    this.toCheckbox.setValue( value.enableTo );
    this.toDateInput.setValue( value.to );   

    this.updateState();
}

TermInput.prototype.getValue = function()
{
    let value = {}
    value.enableFrom = this.fromCheckbox.getValue()
    value.from = this.fromDateInput.getValue();
    value.enableTo = this.toCheckbox.getValue()
    value.to = this.toDateInput.getValue();
    return value;
}

TermInput.prototype.changeValue = function()
{
    this.updateState();

    if( this.onchange ){
        this.onchange( this.getValue() );
    }
}

TermInput.prototype.updateState = function()
{
    if( this.fromCheckbox.getValue() ){
        this.fromDateInput.getDom().style.display = "flex";
        this.fromDateInput.resize();
    }else{
        this.fromDateInput.getDom().style.display = "none";
    }
    if( this.toCheckbox.getValue() ){
        this.toDateInput.getDom().style.display = "flex";
        this.toDateInput.resize();
    }else{
        this.toDateInput.getDom().style.display = "none";
    }
}