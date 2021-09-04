let ConfigStyle = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.padding = "0px 0px 0px 10px";
    this.currentStyle = "lightgreen";

    let addParam = function( name, input, parentDom ){
        parentDom.style.display = "flex"; 
        parentDom.style.flexDirection = "column";         
        let row = document.createElement("div");
        row.style.display = "flex"; 
        row.style.flexDirection = "row"; 
        row.style.alignItems = "center";
        row.style.margin = "0px 0px 0px 0px";
        row.style.flexShrink = "0";
        let label = document.createElement("div");
        label.textContent = name;
        label.style.width = "100px";
        label.style.margin = "0px 0px 0px 0px";
        row.appendChild(label);
        row.appendChild(input);
        parentDom.appendChild(row);
    }.bind(this);

    this.colorSelector = document.createElement("div");
    this.colorSelector.style.display = "flex";
    this.colorSelector.style.flexDirection = "row";
    this.colorSelector.style.alignItems = "center";    
    this.colorList = {
        lightgreen : { r:10,  g:155, b:148 },
        blue       : { r:68,  g:114, b:196 },
        //pink       : { r:255, g:102, b:204 },
        pink       : { r:240, g:102, b:196 },
        black      : { r:59,  g:56,  b:56 },
    }
    for( let i in this.colorList ){
        let colSample = document.createElement("div");
        let col = this.colorList[i];
        let colorStyle = "rgb(" + col.r + "," + col.g + "," + col.b + ")";
        colSample.style.background = colorStyle;
        colSample.style.width = "36px";
        colSample.style.height = "36px";
        colSample.style.borderRadius = "6px";
        colSample.style.margin = "0px 8px 0px 0px";
        colSample.style.border = "2px solid #444";
        colSample.style.borderStyle = "solid"; 
        colSample.onclick = function(){
            this.changeColorStyle( i );
        }.bind(this)
        this.colorSelector.appendChild( colSample );
        this.colorList[i].icon = colSample;
    }

    addParam( "Color", this.colorSelector, this.dom );

    // this.changeColorStyle( "lightgreen" );
    this.colorList["lightgreen"].icon.style.border = "4px solid #ff8c00";
    this.colorList["lightgreen"].icon.style.borderStyle = "solid"; 
}

ConfigStyle.prototype.getDom = function()
{
    return this.dom;
}

ConfigStyle.prototype.resize = function()
{
}

ConfigStyle.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

ConfigStyle.prototype.changeColorStyle = function( style )
{
    this.currentStyle = style;
    for( let name in this.colorList ){
        if( style == name ){
            this.colorList[name].icon.style.border = "4px solid #ff8c00";
            this.colorList[name].icon.style.borderStyle = "solid"; 
        }else{
            this.colorList[name].icon.style.border = "1px solid #444";
            this.colorList[name].icon.style.borderStyle = "solid"; 
        }
    }
    changeColorStyle( this.colorList[style], style );
}

ConfigStyle.prototype.getColorStyle = function()
{
    return this.currentStyle;
}