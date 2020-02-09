
let DataEditor = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.overflowY = "scroll";
    this.dom.style.padding = "0px 10px 0px 0px"; 

    this.paramInputs = {};
    this.currentDataName = "";

    let addParam = function( name, input ){
        let row = document.createElement("div");
        row.style.display = "flex"; 
        row.style.flexDirection = "row"; 
        row.style.alignItems = "center";
        row.style.margin = "0px 0px 0px 0px";        
        let label = document.createElement("div");
        label.textContent = name;
        label.style.width = "100px";
        label.style.margin = "0px 0px 0px 0px";
        row.appendChild(label);
        row.appendChild(input);
        this.dom.appendChild(row);
        this.paramInputs[name] = row;
    }.bind(this);

    this.type = document.createElement("div");
    this.type.textContent = "BarGraph";
    this.type.style.margin = "10px 0px 10px 0px";

    this.name = document.createElement("input");
    this.name.style.padding = "8px 8px 8px 8px";
    this.name.style.margin = "10px 0px 10px 0px";
    this.name.style.borderRadius = "10px";
    this.name.style.width = "calc(100% - 100px)";
    this.name.style.border = "none";

    this.note = document.createElement("textarea");
    this.note.style.padding = "8px 8px 8px 8px";
    this.note.style.margin = "10px 0px 10px 0px";
    this.note.style.borderRadius = "10px";
    this.note.style.width = "calc(100% - 100px)";
    this.note.style.border = "none";
    this.note.rows = 10;    

    this.position = new PositionInput();
    this.position.getDom().style.width = "calc( 100% - 130px )";

    this.arcStartPosition = new PositionInput();
    this.arcStartPosition.getDom().style.width = "calc( 100% - 130px )";

    this.arcStopPosition = new PositionInput();
    this.arcStopPosition.getDom().style.width = "calc( 100% - 130px )";

    this.vertexEditButton = document.createElement("div");
    this.vertexEditButton.textContent = "Edit";
    this.vertexEditButton.classList.add( "textButton" );
    this.vertexEditButton.style.padding = "5px 20px 5px 20px"
    this.vertexEditButton.style.margin = "10px 0px 10px 0px" 
    this.vertexEditButton.style.border = "1px solid #444";
    this.vertexEditButton.style.borderStyle = "solid";  

    this.barParam = new ParametersInput();
    this.barParam.getDom().style.width = "calc( 100% - 130px )";
    this.barParam.addParamInput( "Width" , "number" );
    this.barParam.setValueRange( "Width", 0, 1000, -2 );
    this.barParam.setScale( "Width", 0.02 );
    this.barParam.addParamInput( "Height", "number" );
    this.barParam.setValueRange( "Height", 0, 1000, -2 );
    this.barParam.setScale( "Height", 0.07 );

    this.arcParam = new ParametersInput();
    this.arcParam.getDom().style.width = "calc( 100% - 130px )";
    this.arcParam.addParamInput( "Width" , "number" );
    this.arcParam.setValueRange( "Width", 0, 1000, -2 );
    this.arcParam.setScale( "Width", 0.02 );
    this.arcParam.addParamInput( "Height", "number" );
    this.arcParam.setValueRange( "Height", 0, 1000, -2 );
    this.arcParam.setScale( "Height", 0.07 );
    
    this.pointIcon = new PointIconInput();
    this.pointIcon.getDom().style.width = "calc( 100% - 130px )";

    this.pointParam = new ParametersInput();
    this.pointParam.getDom().style.width = "calc( 100% - 130px )";
    this.pointParam.addParamInput( "Size" , "number" );
    this.pointParam.setValueRange( "Size", 0, 1000, -2 );
    this.pointParam.setScale( "Size", 0.02 );

    this.lineParam = new ParametersInput();
    this.lineParam.getDom().style.width = "calc( 100% - 130px )";
    this.lineParam.addParamInput( "Width" , "number" );
    this.lineParam.setValueRange( "Width", 0, 1000, -2 );
    this.lineParam.setScale( "Width", 0.02 );
    this.lineParam.addParamInput( "Arrow", "checkbox" );    

    this.color = new ColorInput();
    this.color.getDom().style.width = "calc( 100% - 130px )";

    this.term = new TermInput();
    this.term.getDom().style.width = "calc( 100% - 130px )";

    this.deleteButton = document.createElement("div");
    this.deleteButton.textContent = "Delete"
    this.deleteButton.classList.add( "textButton" );
    this.deleteButton.style.padding = "5px 20px 5px 20px"
    this.deleteButton.style.margin = "10px 0px 10px 0px" 
    this.deleteButton.style.border = "1px solid #444";
    this.deleteButton.style.borderStyle = "solid";  

    this.copyButton = document.createElement("div");
    this.copyButton.textContent = "Copy"
    this.copyButton.classList.add( "textButton" );
    this.copyButton.style.padding = "5px 20px 5px 20px"
    this.copyButton.style.margin = "10px 0px 10px 0px" 
    this.copyButton.style.border = "1px solid #444";
    this.copyButton.style.borderStyle = "solid";  

    addParam( "Type", this.type );
    addParam( "Name", this.name );
    addParam( "Note", this.note );
    addParam( "Position", this.position.getDom() );
    addParam( "Start", this.arcStartPosition.getDom() );
    addParam( "Stop", this.arcStopPosition.getDom() );
    addParam( "Vertex", this.vertexEditButton );
    addParam( "Bar", this.barParam.getDom() );
    addParam( "Arc", this.arcParam.getDom() );
    addParam( "Icon", this.pointIcon.getDom() );
    addParam( "Point", this.pointParam.getDom() );
    addParam( "Line", this.lineParam.getDom() );
    addParam( "Color", this.color.getDom() );
    addParam( "Term", this.term.getDom() );    
    addParam( "Delete", this.deleteButton );    
    addParam( "Copy", this.copyButton ); 

    this.name.onchange = function() {
        this.changeData( "name", this.name.value )
    }.bind(this);

    this.note.onchange = function() {
        this.changeData( "note", this.note.value )
    }.bind(this);

    this.position.onchange = function( value ) {
        this.changeData( "position", value )
    }.bind(this);

    this.arcStartPosition.onchange = function( value ) {
        this.changeData( "arcStart", value )
    }.bind(this);
    
    this.vertexEditButton.onclick = function() {
        g_vertexEditor.start( this.currentDataName )
    }.bind(this);

    this.arcStopPosition.onchange = function( value ) {
        this.changeData( "arcStop", value )
    }.bind(this);    
    
    this.barParam.onchange = function( value ) {
        this.changeData( "barGraph", value )
    }.bind(this);   
    
    this.arcParam.onchange = function( value ) {
        this.changeData( "arc", value )
    }.bind(this); 
    
    this.pointParam.onchange = function( value ) {
        this.changeData( "point", value )
    }.bind(this); 

    this.pointIcon.onchange = function( value ) {
        this.changeData( "pointIcon", value )
    }.bind(this); 
    
    this.lineParam.onchange = function( value ) {
        this.changeData( "line", value )
    }.bind(this); 
    
    this.color.onchange = function( value ) {
        this.changeData( "color", value )
    }.bind(this); 
    
    this.term.onchange = function( value ) {
        this.changeData( "term", value )
    }.bind(this);     

    this.deleteButton.onclick = function(){
        deleteObject( this.currentDataName );
    }.bind(this);

    this.copyButton.onclick = function(){
        copyObject( this.currentDataName );
    }.bind(this);    
}

DataEditor.prototype.getDom = function()
{
    return this.dom;
}

DataEditor.prototype.resize = function()
{
    this.position.resize();
    this.arcStartPosition.resize();
    this.arcStopPosition.resize();    
    this.barParam.resize();
    this.arcParam.resize();
    this.pointParam.resize();
    this.lineParam.resize();
    this.color.resize();
    this.term.resize();    
}

DataEditor.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

DataEditor.prototype.setData = function( name, data )
{
    this.currentDataName = name;

    this.paramInputs["Position"].style.display = "none";
    this.paramInputs["Start"].style.display    = "none";
    this.paramInputs["Stop"].style.display     = "none";
    this.paramInputs["Vertex"].style.display   = "none";
    this.paramInputs["Bar"].style.display      = "none";
    this.paramInputs["Arc"].style.display      = "none";
    this.paramInputs["Icon"].style.display     = "none";
    this.paramInputs["Point"].style.display    = "none";
    this.paramInputs["Line"].style.display     = "none";
    this.paramInputs["Color"].style.display    = "none";

    if( data.type == "BarGraph" ){
        this.paramInputs["Position"].style.display = "flex";
        this.paramInputs["Bar"].style.display      = "flex";
        this.paramInputs["Color"].style.display    = "flex";
    }else if( data.type == "Arc" ){
        this.paramInputs["Start"].style.display    = "flex";
        this.paramInputs["Stop"].style.display     = "flex";        
        this.paramInputs["Arc"].style.display      = "flex";
        this.paramInputs["Color"].style.display    = "flex";
    }else if( data.type == "Point" ){
        this.paramInputs["Position"].style.display = "flex";
        this.paramInputs["Icon"].style.display     = "flex";
        this.paramInputs["Point"].style.display    = "flex";
    }else if( data.type == "Line" ){
        this.paramInputs["Vertex"].style.display   = "flex";
        this.paramInputs["Line"].style.display     = "flex";
        this.paramInputs["Color"].style.display    = "flex";
    }else if( data.type == "Polygon" ){
        this.paramInputs["Vertex"].style.display   = "flex";
        this.paramInputs["Color"].style.display    = "flex";
    }

    this.type.textContent = data.type;
    this.name.value = data.name;
    this.note.value = data.note;

    if( data.type == "BarGraph" || data.type == "Point" ){
        let longitude = data.position[0];
        let latitude = data.position[1];
        this.position.setValue( "longitude", longitude );
        this.position.setValue( "latitude", latitude );
    }

    if( data.type == "BarGraph" ){
        this.barParam.setValue( "Width", data.size );
        this.barParam.setValue( "Height", data.height );
    }else if( data.type == "Arc" ){
        let longitude = data.startPosition[0];
        let latitude = data.startPosition[1];
        this.arcStartPosition.setValue( "longitude", longitude );
        this.arcStartPosition.setValue( "latitude", latitude );
        longitude = data.endPosition[0];
        latitude = data.endPosition[1];
        this.arcStopPosition.setValue( "longitude", longitude ); 
        this.arcStopPosition.setValue( "latitude", latitude ); 
        this.arcParam.setValue( "Width", data.size );
        this.arcParam.setValue( "Height", data.height );
    }else if( data.type == "Point" ){
        this.pointParam.setValue( "Size", data.size );  
        this.pointIcon.setValue( data.icon );  
    }else if( data.type == "Line" ){
        this.lineParam.setValue( "Width", data.width );
        this.lineParam.setValue( "Arrow", data.showArrow );
    }

    if( data.type == "BarGraph" || data.type == "Arc" ||
        data.type == "Line" ||  data.type == "Polygon" ){
        let r = data.color[0] * 255;
        let g = data.color[1] * 255;
        let b = data.color[2] * 255;
        this.color.setValue( { r:r, g:g, b:b } );     
    }
    
    let term = {};
    let st = data.startTime;
    let et = data.endTime;
    term.enableFrom = st.enable;
    term.from       = { year:st.year, month:st.month, day:st.day };
    term.enableTo   = et.enable;
    term.to         = { year:et.year, month:et.month, day:et.day };
    this.term.setValue(term);     
}

DataEditor.prototype.changeData = function( paramName, value )
{
    // console.log( value );
    let name = this.currentDataName;

    if( paramName == "name" ){
        g_dataList[name].name = value;
    }else if( paramName == "note" ){
        g_dataList[name].note = value;
    }else if( paramName == "position" ){
        g_dataList[name].position[0] = Number(value.longitude);
        g_dataList[name].position[1] = Number(value.latitude);
    }else if( paramName == "arcStart" ){
        g_dataList[name].startPosition[0] = Number(value.longitude);
        g_dataList[name].startPosition[1] = Number(value.latitude);
    }else if( paramName == "arcStop" ){
        g_dataList[name].endPosition[0] = Number(value.longitude);
        g_dataList[name].endPosition[1] = Number(value.latitude);
    }else if( paramName == "barGraph" ){
        g_dataList[name].size = Number(value.Width);
        g_dataList[name].height = Number(value.Height);
    }else if( paramName == "arc" ){
        g_dataList[name].size = Number(value.Width);
        g_dataList[name].height = Number(value.Height);
    }else if( paramName == "point" ){
        g_dataList[name].size = Number(value.Size);
    }else if( paramName == "pointIcon" ){
        g_dataList[name].icon = value;
    }else if( paramName == "line" ){
        g_dataList[name].width = Number(value.Width);
        g_dataList[name].showArrow = value.Arrow;
    }else if( paramName == "color" ){
        g_dataList[name].color[0] = Number(value.r) / 255;
        g_dataList[name].color[1] = Number(value.g) / 255;
        g_dataList[name].color[2] = Number(value.b) / 255;
    }else if( paramName == "term" ){
        g_dataList[name].startTime.enable = value.enableFrom;
        g_dataList[name].startTime.year   = Number(value.from.year);
        g_dataList[name].startTime.month  = Number(value.from.month);
        g_dataList[name].startTime.day    = Number(value.from.day);
        g_dataList[name].endTime.enable   = value.enableTo;
        g_dataList[name].endTime.year     = Number(value.to.year);
        g_dataList[name].endTime.month    = Number(value.to.month);
        g_dataList[name].endTime.day      = Number(value.to.day);
    }

    changeObjectParam( name )
}