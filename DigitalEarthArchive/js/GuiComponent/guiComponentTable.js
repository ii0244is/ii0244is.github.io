
//////////////////////////////////////////////////////
// Table
//////////////////////////////////////////////////////

guiComponentTable = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.marginTop = "10px";
    this.dom.style.marginBottom = "10px";
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
}

guiComponentTable.prototype.addRow = function( name, dom )
{
    // create name cell
    let nameCell = document.createElement("div");
    nameCell.style.padding = "2px 5px 2px 5px";
    nameCell.style.backgroundColor = "#888";
    nameCell.style.color = "#fff";
    nameCell.textContent = name; 

    // create dom cell
    let domCell = document.createElement("div");
    domCell.style.padding = "5px 5px 5px 5px";
    domCell.appendChild(dom);

    // create row
    let row = document.createElement("div");
    row.style.width = "100%"; 
    row.style.border = "solid 1px #888";
    row.style.padding = "0px 0px 20px 0px";    
    row.style.borderWidth = "1px 0px 0px 0px";
    row.appendChild(nameCell);
    row.appendChild(domCell);

    this.dom.appendChild(row);
}

guiComponentTable.prototype.getDom = function()
{
    return this.dom;
}


//////////////////////////////////////////////////////
// input 1 value 
//////////////////////////////////////////////////////

guiComponent1ValueInput = function ( callback )
{
    this.mouseController = new guiComponentMouseController( 240, 30, function( diffX, diffY )
    {
        callback( diffX, diffY );
    }.bind(this) );
    this.valInput = document.createElement("input");
    this.valInput.type = "number";
    this.valInput.style.width = "80%";
    this.inputCell = document.createElement("div");
    this.inputCell.style.display = "flex";
    this.inputCell.style.flexDirection = "column";
    this.inputCell.style.justifyContent = "center";    
    this.inputCell.style.alignItems = "center";
    this.inputCell.style.width = "cala(100% - 240px)";    
    this.inputCell.appendChild( this.valInput );

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.appendChild( this.mouseController.getDom() );
    this.dom.appendChild( this.inputCell );
}

guiComponent1ValueInput.prototype.getValue1Dom = function ()
{
    return this.valInput;
}

guiComponent1ValueInput.prototype.getDom = function ()
{
    return this.dom;
}


//////////////////////////////////////////////////////
// input 2 value 
//////////////////////////////////////////////////////

guiComponent2ValueInput = function ( callback )
{
    this.mouseController = new guiComponentMouseController( 240, 120, function( diffX, diffY )
    {
        callback( diffX, diffY );
    }.bind(this) );
    this.val1Input = document.createElement("input");
    this.val1Input.type = "number";
    this.val1Input.style.width = "80%";
    this.val2Input = document.createElement("input");
    this.val2Input.type = "number";    
    this.val2Input.style.width = "80%"
    this.inputCell = document.createElement("div");
    this.inputCell.style.display = "flex";
    this.inputCell.style.flexDirection = "column";
    this.inputCell.style.justifyContent = "center";    
    this.inputCell.style.alignItems = "center";
    this.inputCell.style.width = "cala(100% - 240px)";    
    this.inputCell.appendChild( this.val1Input );
    this.inputCell.appendChild( this.val2Input );

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.appendChild( this.mouseController.getDom() );
    this.dom.appendChild( this.inputCell );
}

guiComponent2ValueInput.prototype.getValue1Dom = function ()
{
    return this.val1Input;
}

guiComponent2ValueInput.prototype.getValue2Dom = function ()
{
    return this.val2Input;
}

guiComponent2ValueInput.prototype.getDom = function ()
{
    return this.dom;
}


//////////////////////////////////////////////////////
// input color 
//////////////////////////////////////////////////////

guiComponentColorInput = function ( callback )
{
    // mouse controller
    this.colorCell = document.createElement("div");
    this.colorCell.style.width = "150px";  
    this.colorCell.style.marginRight = "10px"; 

    // mouse controller
    this.colorControllerCell = document.createElement("div");
    this.colorControllerCell.style.display = "flex";
    this.colorControllerCell.style.flexDirection = "column";
    this.colorControllerCell.style.justifyContent = "center";    
    this.colorControllerCell.style.alignItems = "center";
    this.colorControllerCell.style.width = "180px";    
    this.mouseControllerR = new guiComponentMouseController( 180, 30, function( diffX, diffY )
    {
        let r = Number(this.colerInputR.value);
        r += diffX;
        this.colerInputR.value = r;
        this.updateColorSample();
        callback( this.getColor() );
    }.bind(this) );
    this.mouseControllerR.getDom().style.padding = "0px 0px 2px 0px";
    this.mouseControllerG = new guiComponentMouseController( 180, 30, function( diffX, diffY )
    {
        let g = Number(this.colerInputG.value);
        g += diffX;
        this.colerInputG.value = g;
        this.updateColorSample();
        callback( this.getColor() );
    }.bind(this) );
    this.mouseControllerG.getDom().style.padding = "2px 0px 2px 0px";
    this.mouseControllerB = new guiComponentMouseController( 180, 30, function( diffX, diffY )
    {
        let b = Number(this.colerInputB.value);
        b += diffX;
        this.colerInputB.value = b;
        this.updateColorSample();        
        callback( this.getColor() );
    }.bind(this) );
    this.mouseControllerB.getDom().style.padding = "2px 0px 0px 0px";
    this.colorControllerCell.appendChild(this.mouseControllerR.getDom());
    this.colorControllerCell.appendChild(this.mouseControllerG.getDom());
    this.colorControllerCell.appendChild(this.mouseControllerB.getDom());

    // input
    this.colerInputR = document.createElement("input");
    this.colerInputR.type = "number";
    this.colerInputR.style.width = "80%";
    this.colerInputR.min = "0";
    this.colerInputR.max = "255";
    this.colerInputG = document.createElement("input");
    this.colerInputG.type = "number";
    this.colerInputG.style.width = "80%";
    this.colerInputG.min = "0";
    this.colerInputG.max = "255";
    this.colerInputB = document.createElement("input");
    this.colerInputB.type = "number";
    this.colerInputB.style.width = "80%";    
    this.colerInputB.min = "0";
    this.colerInputB.max = "255";
    this.inputCell = document.createElement("div");
    this.inputCell.style.display = "flex";
    this.inputCell.style.flexDirection = "column";
    this.inputCell.style.justifyContent = "center";    
    this.inputCell.style.alignItems = "center";
    this.inputCell.style.width = "cala(100% - 360px)";    
    this.inputCell.appendChild( this.colerInputR );
    this.inputCell.appendChild( this.colerInputG );
    this.inputCell.appendChild( this.colerInputB );
    function colorChangeCallback(){
        this.updateColorSample();
        callback();
    };
    this.colerInputR.onchange = colorChangeCallback.bind(this);
    this.colerInputG.onchange = colorChangeCallback.bind(this);
    this.colerInputB.onchange = colorChangeCallback.bind(this);
    
    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.appendChild( this.colorCell );
    this.dom.appendChild( this.colorControllerCell );
    this.dom.appendChild( this.inputCell );
}

guiComponentColorInput.prototype.setColor = function ( color )
{
    this.colerInputR.value = color[0] * 255;
    this.colerInputG.value = color[1] * 255;
    this.colerInputB.value = color[2] * 255;
    this.updateColorSample();
}

guiComponentColorInput.prototype.getColor = function ()
{
    let r = Number(this.colerInputR.value) / 255;
    let g = Number(this.colerInputG.value) / 255;
    let b = Number(this.colerInputB.value) / 255;
    return [ r, g, b ];
}

guiComponentColorInput.prototype.updateColorSample = function ()
{
    function limit( val, min, max ){
        if( val < min ){
            return min;
        }else if ( max < val ){
            return max;
        }
        return val;
    }
        
    let r = Number(this.colerInputR.value);
    let g = Number(this.colerInputG.value);
    let b = Number(this.colerInputB.value);
    r = limit( r, 0, 255 );
    g = limit( g, 0, 255 );
    b = limit( b, 0, 255 );
    this.colerInputR.value = r;
    this.colerInputG.value = g;
    this.colerInputB.value = b;

    let rUp  = Math.floor( r / 16 ).toString(16);
    let rLow = ( r % 16 ).toString(16);
    let gUp  = Math.floor( g / 16 ).toString(16);
    let gLow = ( g % 16 ).toString(16);
    let bUp  = Math.floor( b / 16 ).toString(16);
    let bLow = ( b % 16 ).toString(16);
    this.colorCell.style.backgroundColor = "#" + rUp + rLow + gUp + gLow + bUp + bLow;
}

guiComponentColorInput.prototype.getDom = function ()
{
    return this.dom;
}



//////////////////////////////////////////////////////
// date
//////////////////////////////////////////////////////

guiComponentDateInput = function ( callback )
{
    // start time input
    this.startTimeArea = document.createElement("div");
    this.startTimeArea.style.paddingBottom = "5px";  
    this.startTimeLabel = document.createElement("div");
    this.startTimeLabel.textContent = "Start";
    this.startTimeLabel.style.float = "left";    
    this.startTimeLabel.style.width = "60px";    
    this.startTime = document.createElement("input");
    this.startTime.type = "date";
    this.startTime.style.float = "left";    
    this.startTime.style.width = "calc( 100% - 60px )";  
    this.startTime.onchange = function(){
        callback();
    }
    this.startTimeArea.appendChild( this.startTimeLabel );
    this.startTimeArea.appendChild( this.startTime );

    // end time input
    this.endTimeArea = document.createElement("div");
    this.endTimeLabel = document.createElement("div");
    this.endTimeLabel.textContent = "End";
    this.endTimeLabel.style.float = "left";    
    this.endTimeLabel.style.width = "60px";    
    this.endTime = document.createElement("input");
    this.endTime.type = "date";
    this.endTime.style.float = "left";    
    this.endTime.style.width = "calc( 100% - 60px )";  
    this.endTime.onchange = function(){
        callback();
    }
    this.endTimeArea.appendChild( this.endTimeLabel );
    this.endTimeArea.appendChild( this.endTime );    

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.appendChild( this.startTimeArea );
    this.dom.appendChild( this.endTimeArea );
}

guiComponentDateInput.prototype.getStartDateDom = function ()
{
    return this.startTime;
}

guiComponentDateInput.prototype.getEndDateDom = function ()
{
    return this.endTime;
}

guiComponentDateInput.prototype.getDom = function ()
{
    return this.dom;
}



//////////////////////////////////////////////////////
// selector
//////////////////////////////////////////////////////

guiComponentSelector = function ( callback )
{
    this.Selector = document.createElement("select")
    this.Selector.multiple = true;
    this.Selector.style.height = "120px";
    this.Selector.style.width = "100%";
    this.callback = callback;
    this.Selector.onchange = callback;
}

guiComponentSelector.prototype.getDom = function ()
{
    return this.Selector;
}

guiComponentSelector.prototype.setSelectorItems = function ( list )
{
    while( this.Selector.hasChildNodes() ){
        this.Selector.removeChild( this.Selector.firstChild )
    }

    for( let i in list ){
        this.Selector.add( new Option( list[i], list[i] ) ); 
    }
}

guiComponentSelector.prototype.getSelectedItems = function ()
{
    let itemList = [];
    for( let i = 0; i < this.Selector.options.length; ++i ){
        if( this.Selector.options[i].selected == true ){
            itemList.push( this.Selector.options[i].value )
        }
    }
    return itemList;
}