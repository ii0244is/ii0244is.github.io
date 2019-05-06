
let ConfigDefaultParam = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.padding = "0px 0px 0px 10px"; 

    let addParam = function( name, input, parentDom ){
        parentDom.style.display = "flex"; 
        parentDom.style.flexDirection = "column";         
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
        parentDom.appendChild(row);
    }.bind(this);

    this.selector = document.createElement("div");
    this.selector.style.display = "flex"; 
    this.selector.style.flexDirection = "row"; 
    this.selector.style.alignItems = "center";
    this.selector.style.margin = "10px 0px 10px 0px"; 
    this.iconList = {
        BarGraph : { type:"BarGraph", src: "image/addBarGraph.png" },
        Arc      : { type:"Arc",      src: "image/addArc.png"      },
        Point    : { type:"Point",    src: "image/addPoint.png"    },
        Line     : { type:"Line",     src: "image/addLine.png"     },
        Polygon  : { type:"Polygon",  src: "image/addPolygon.png"  },
    }
    for( let i in this.iconList ){
        let icon = document.createElement("img");
        icon.src = this.iconList[i].src;
        icon.classList.add("newDataButton");
        icon.style.width = "36px";
        icon.style.height = "36px";
        icon.style.borderRadius = "6px";
        icon.style.margin = "0px 8px 0px 0px";
        icon.style.border = "2px solid #444";
        icon.style.borderStyle = "solid"; 
        icon.onclick = function(){
            this.setDataType( this.iconList[i].type );
        }.bind(this)
        this.selector.appendChild( icon ); 
        this.iconList[i].icon = icon;      
    }
    addParam( "Type", this.selector, this.dom );

    this.barArea = document.createElement("div");
    this.barName = document.createElement("input");
    this.barName.style.padding = "8px 8px 8px 8px";
    this.barName.style.margin = "10px 0px 10px 0px";
    this.barName.style.borderRadius = "10px";
    this.barName.style.width = "calc(100% - 100px)";
    this.barName.style.border = "none";
    this.barParam = new ParametersInput();
    this.barParam.getDom().style.width = "calc( 100% - 130px )";
    this.barParam.addParamInput( "Width" , "number" );
    this.barParam.setValueRange( "Width", 0, 1000, -2 );
    this.barParam.setScale( "Width", 0.02 );
    this.barParam.addParamInput( "Height", "number" );
    this.barParam.setValueRange( "Height", 0, 1000, -2 );  
    this.barParam.setScale( "Height", 0.07 );
    this.barColor = new ColorInput();
    this.barColor.getDom().style.width = "calc( 100% - 130px )";
    addParam( "Name", this.barName, this.barArea );
    addParam( "Bar", this.barParam.getDom(), this.barArea );
    addParam( "Color", this.barColor.getDom(), this.barArea );

    this.arcArea = document.createElement("div");
    this.arcName = document.createElement("input");
    this.arcName.style.padding = "8px 8px 8px 8px";
    this.arcName.style.margin = "10px 0px 10px 0px";
    this.arcName.style.borderRadius = "10px";
    this.arcName.style.width = "calc(100% - 100px)";
    this.arcName.style.border = "none";
    this.arcParam = new ParametersInput();
    this.arcParam.getDom().style.width = "calc( 100% - 130px )";
    this.arcParam.addParamInput( "Width" , "number" );
    this.arcParam.setValueRange( "Width", 0, 1000, -2 );
    this.arcParam.setScale( "Width", 0.02 );
    this.arcParam.addParamInput( "Height", "number" );
    this.arcParam.setValueRange( "Height", 0, 1000, -2 );
    this.arcParam.setScale( "Height", 0.07 );
    this.arcColor = new ColorInput();
    this.arcColor.getDom().style.width = "calc( 100% - 130px )";
    addParam( "Name", this.arcName, this.arcArea );
    addParam( "Arc", this.arcParam.getDom(), this.arcArea );
    addParam( "Color", this.arcColor.getDom(), this.arcArea );

    this.pointArea = document.createElement("div");
    this.pointName = document.createElement("input");
    this.pointName.style.padding = "8px 8px 8px 8px";
    this.pointName.style.margin = "10px 0px 10px 0px";
    this.pointName.style.borderRadius = "10px";
    this.pointName.style.width = "calc(100% - 100px)";
    this.pointName.style.border = "none";  
    this.pointParam = new ParametersInput();
    this.pointParam.getDom().style.width = "calc( 100% - 130px )";
    this.pointParam.addParamInput( "Size" , "number" );
    this.pointParam.setValueRange( "Size", 0, 1000, -2 );
    this.pointParam.setScale( "Size", 0.02 );
    this.pointIcon = new PointIconInput();
    this.pointIcon.getDom().style.width = "calc( 100% - 130px )";
    addParam( "Name", this.pointName, this.pointArea );
    addParam( "Point", this.pointParam.getDom(), this.pointArea );
    // addParam( "Icon", this.pointIcon.getDom(), this.pointArea );

    this.lineArea = document.createElement("div");
    this.lineName = document.createElement("input");
    this.lineName.style.padding = "8px 8px 8px 8px";
    this.lineName.style.margin = "10px 0px 10px 0px";
    this.lineName.style.borderRadius = "10px";
    this.lineName.style.width = "calc(100% - 100px)";
    this.lineName.style.border = "none";    
    this.lineParam = new ParametersInput();
    this.lineParam.getDom().style.width = "calc( 100% - 130px )";
    this.lineParam.addParamInput( "Width" , "number" );
    this.lineParam.setValueRange( "Width", 0, 1000, -2 );
    this.lineParam.setScale( "Width", 0.02 );
    this.lineParam.addParamInput( "Arrow", "checkbox" );    
    this.lineColor = new ColorInput();
    this.lineColor.getDom().style.width = "calc( 100% - 130px )";
    addParam( "Name", this.lineName, this.lineArea );
    addParam( "Line", this.lineParam.getDom(), this.lineArea );
    addParam( "Color", this.lineColor.getDom(), this.lineArea );    

    this.polygonArea = document.createElement("div");
    this.polygonName = document.createElement("input");
    this.polygonName.style.padding = "8px 8px 8px 8px";
    this.polygonName.style.margin = "10px 0px 10px 0px";
    this.polygonName.style.borderRadius = "10px";
    this.polygonName.style.width = "calc(100% - 100px)";
    this.polygonName.style.border = "none"; 
    this.polygonColor = new ColorInput();
    this.polygonColor.getDom().style.width = "calc( 100% - 130px )";
    addParam( "Name", this.polygonName, this.polygonArea );
    addParam( "Color", this.polygonColor.getDom(), this.polygonArea );      

    this.dom.appendChild( this.barArea );
    this.dom.appendChild( this.arcArea );
    this.dom.appendChild( this.pointArea );
    this.dom.appendChild( this.lineArea );
    this.dom.appendChild( this.polygonArea );

    this.barName.onchange = function(){
        this.changeDefaultParam( "BarGraph" );
    }.bind(this);
    this.barParam.onchange = function(){
        this.changeDefaultParam( "BarGraph" );
    }.bind(this);
    this.barColor.onchange = function(){
        this.changeDefaultParam( "BarGraph" );
    }.bind(this);
    
    this.arcName.onchange = function(){
        this.changeDefaultParam( "Arc" );
    }.bind(this);
    this.arcParam.onchange = function(){
        this.changeDefaultParam( "Arc" );
    }.bind(this);
    this.arcColor.onchange = function(){
        this.changeDefaultParam( "Arc" );
    }.bind(this);
    
    this.pointName.onchange = function(){
        this.changeDefaultParam( "Point" );
    }.bind(this);
    this.pointParam.onchange = function(){
        this.changeDefaultParam( "Point" );
    }.bind(this);
    this.pointIcon.onchange = function(){
        this.changeDefaultParam( "Point" );
    }.bind(this);
    
    this.lineName.onchange = function(){
        this.changeDefaultParam( "Line" );
    }.bind(this);
    this.lineParam.onchange = function(){
        this.changeDefaultParam( "Line" );
    }.bind(this);
    this.lineColor.onchange = function(){
        this.changeDefaultParam( "Line" );
    }.bind(this);
    
    this.polygonName.onchange = function(){
        this.changeDefaultParam( "Polygon" );
    }.bind(this);
    this.polygonColor.onchange = function(){
        this.changeDefaultParam( "Polygon" );
    }.bind(this);

    this.setDataType( "BarGraph" );
}

ConfigDefaultParam.prototype.getDom = function()
{
    return this.dom;
}

ConfigDefaultParam.prototype.resize = function()
{
    this.barParam.resize();
    this.arcParam.resize();
    this.pointParam.resize();
    this.lineParam.resize();
    this.barColor.resize();
    this.arcColor.resize();
    this.lineColor.resize();    
    this.polygonColor.resize();
}

ConfigDefaultParam.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

ConfigDefaultParam.prototype.setDataType = function( type )
{
    for( let name in this.iconList ){
        if( type == name ){
            this.iconList[name].icon.style.opacity = 1.0;
        }else{
            this.iconList[name].icon.style.opacity = 0.4;
        }
    }

    this.barArea.style.display = "none";
    this.arcArea.style.display = "none";
    this.pointArea.style.display = "none";
    this.lineArea.style.display = "none";
    this.polygonArea.style.display = "none";

    if( type == "BarGraph" ){
        this.barArea.style.display = "flex";
    }else if( type == "Point" ){
        this.pointArea.style.display = "flex";
    }else if( type == "Arc" ){
        this.arcArea.style.display = "flex";
    }else if( type == "Line" ){
        this.lineArea.style.display = "flex";
    }else if( type == "Polygon" ){
        this.polygonArea.style.display = "flex";
    }

    this.resize();
}

ConfigDefaultParam.prototype.setDefaultParam = function( type, param )
{
    if( type == "BarGraph" ){
        this.barName.value = param.name;
        this.barParam.setValue( "Width", param.size );
        this.barParam.setValue( "Height", param.height );
        let r = param.color[0] * 255;
        let g = param.color[1] * 255;
        let b = param.color[2] * 255;        
        this.barColor.setValue( { r:r, g:g, b:b } );
    }else if( type == "Arc" ){
        this.arcName.value = param.name;
        this.arcParam.setValue( "Width", param.size );
        this.arcParam.setValue( "Height", param.height );
        let r = param.color[0] * 255;
        let g = param.color[1] * 255;
        let b = param.color[2] * 255;        
        this.arcColor.setValue( { r:r, g:g, b:b } );        
    }else if( type == "Point" ){
        this.pointName.value = param.name;
        this.pointParam.setValue( "Size", param.size );  
        // this.pointIcon.setValue( param.icon );  
    }else if( type == "Line" ){
        this.lineName.value = param.name;
        this.lineParam.setValue( "Width", param.width );
        this.lineParam.setValue( "Arrow", param.showArrow );
        let r = param.color[0] * 255;
        let g = param.color[1] * 255;
        let b = param.color[2] * 255;        
        this.lineColor.setValue( { r:r, g:g, b:b } );        
    }else if( type == "Polygon" ){
        this.polygonName.value = param.name;
        let r = param.color[0] * 255;
        let g = param.color[1] * 255;
        let b = param.color[2] * 255;        
        this.polygonColor.setValue( { r:r, g:g, b:b } );        
    }
}

ConfigDefaultParam.prototype.changeDefaultParam = function( type )
{
    let param = {};

    if( type == "BarGraph" )
    {
        let val = this.barParam.getValue();
        let col = this.barColor.getValue();
        param.name = this.barName.value;
        param.height = Number(val.Height);
        param.size   = Number(val.Width);
        param.color  = [ Number(col.r)/255, Number(col.g)/255, Number(col.b)/255 ];
    }   
    else if( type == "Arc" )
    {
        let val = this.arcParam.getValue();
        let col = this.arcColor.getValue();
        param.name   = this.arcName.value;
        param.size   = Number(val.Width);
        param.height = Number(val.Height);
        param.color  = [ Number(col.r)/255, Number(col.g)/255, Number(col.b)/255 ];
    }   
    else if( type == "Point" )
    {
        let val = this.pointParam.getValue();
        param.name = this.pointName.value;
        param.size = Number(val.Size);
        //param.icon;
    }
    else if( type == "Line" )
    {
        let val = this.lineParam.getValue();
        let col = this.lineColor.getValue();
        param.name      = this.lineName.value;
        param.width     = Number(val.Width);
        param.showArrow = val.Arrow;
        param.color     = [ Number(col.r)/255, Number(col.g)/255, Number(col.b)/255 ];
    }   
    else if( type == "Polygon" )
    {
        let col = this.polygonColor.getValue();
        param.name  = this.polygonName.value;
        param.color = [ Number(col.r)/255, Number(col.g)/255, Number(col.b)/255 ];
    }

    g_newDataManager.setDefalutParameter( type, param );
}