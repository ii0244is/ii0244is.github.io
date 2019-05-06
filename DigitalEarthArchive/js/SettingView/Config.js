let Config = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.overflowY = "scroll"; 
    this.dom.style.padding = "0px 10px 0px 0px"; 

    this.configList = {
        "Style"   : { label:"Style" },
        "Default" : { label:"Default parameter" },
    }

    this.selectorArea = document.createElement("div");
    this.selectorArea.style.display = "flex"; 
    this.selectorArea.style.flexDirection = "row"; 
    this.selectorArea.style.alignItems = "center";
    this.selectorArea.style.justifyContent = "space-between";
    this.selectorArea.style.border = "1px solid #fff";
    this.selectorArea.style.borderStyle = "none none solid none";  
    this.selectorArea.style.padding = "0px 0px 5px 0px";     
    this.selectorArea.style.margin = "0px 0px 10px 10px";  
    this.label = document.createElement("div");
    this.label.textContent = "";
    this.label.style.fontSize = "20px";
    this.selector = document.createElement("select");
    this.selector.style.borderRadius = "5px";
    this.selector.style.margin = "5px 0px 5px 0px";
    this.selector.style.padding = "5px 10px 5px 10px";
    for( let i in this.configList ){
        let opt = document.createElement("option");
        opt.value = i;
        opt.textContent = this.configList[i].label;
        this.selector.appendChild(opt);
    }
    this.selector.onchange = function(){
        this.setConfigMode( this.selector.value )
    }.bind(this);
    this.selectorArea.appendChild(this.label);
    this.selectorArea.appendChild(this.selector);
    this.dom.appendChild( this.selectorArea );

    this.style = new ConfigStyle();
    this.dom.appendChild( this.style.getDom() );

    this.defaultParam = new ConfigDefaultParam();
    this.dom.appendChild( this.defaultParam.getDom() );

    this.setConfigMode( "Style" );
}

Config.prototype.getDom = function()
{
    return this.dom;
}

Config.prototype.resize = function()
{
    this.defaultParam.resize();
    this.style.resize();
}

Config.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

Config.prototype.setConfigMode = function( mode )
{
    this.label.textContent = this.configList[mode].label;

    this.style.show(false);
    this.defaultParam.show(false);

    if( mode == "Style" ){
        this.style.show(true);
    }else if( mode == "Default" ){
        this.defaultParam.show(true);
    }
}

Config.prototype.setDefaultParam = function( type, param ){
    this.defaultParam.setDefaultParam( type, param );
}

Config.prototype.setColorStyle = function( style ){
    this.style.changeColorStyle( style )
}

Config.prototype.getColorStyle = function(){
    return this.style.getColorStyle()
}