

let popupParamSetting = function()
{
    // パラメータ
    this.isShown = false;

    // DOM 生成
    this.createGui();

    // DOM イベント設定
    this.setUpEvent();
}

popupParamSetting.prototype.show = function( posX, posY )
{
    document.body.appendChild( this.dom );
    this.setPosition( posX, posY );
    this.isShown = true;
}

popupParamSetting.prototype.hide = function()
{
    if( this.isShown )
    {    
        document.body.removeChild( this.dom );
        this.isShown = false;
    }
}

popupParamSetting.prototype.setPosition = function( x, y )
{
    let rect = this.dom.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    let posX = x + 30;
    let posY = y + 60;
    if( width + posX > g_webGLView.getWidth() ){
        posX = x - ( 20 + width );
    }

    if( height + posY > g_webGLView.getHeight() ){

        let diff = height + posY - g_webGLView.getHeight()
        posY = y + 80 - diff;
    }
    this.dom.style.left = posX;
    this.dom.style.top = posY;    
}

popupParamSetting.prototype.setSize = function( width, height )
{
    this.dom.style.width = width + "px";
    // this.dom.style.height = height + "px";
}

popupParamSetting.prototype.setParam = function( data )
{
    if( this.dom.lastChild ) this.dom.removeChild(this.dom.lastChild);

    if( data.type == "BarGraph" )
    {
        this.nameInputBarGraph.value = data.name;
        this.valueInputBarGraph.value = data.value;
        this.positionValueBarGraphX.textContent = " lon : " + data.position[0].toFixed(3);
        this.positionValueBarGraphY.textContent = " lat : " + data.position[2].toFixed(3);
        this.dom.appendChild(this.domBarGraphGui);
    }
    else if( data.type == "Point" )
    {
        this.nameInputPoint.value = data.name;
        this.valueInputPoint.value = data.value;
        this.positionValuePointX.textContent = " lon : " + data.position[0].toFixed(3);
        this.positionValuePointY.textContent = " lat : " + data.position[2].toFixed(3);
        this.dom.appendChild(this.domPointGui);
    }
    else if( data.type == "Arc" )
    {
        this.nameInputArc.value = data.name;
        this.valueInputArc.value = data.value;
        this.dom.appendChild(this.domArcGui);        
    }
    else if( data.type == "Line" )
    {
        this.nameInputLine.value = data.name;
        this.valueInputLine.value = data.value;
        this.dom.appendChild(this.domLineGui);        
    } 
    else if( data.type == "Polygon" )
    {
        this.nameInputPolygon.value = data.name;
        this.valueInputPolygon.value = data.value;
        this.dom.appendChild(this.domPolygonGui);        
    }       
}

popupParamSetting.prototype.setChangeCallBack = function( callback )
{
    this.callback = callback;
}


/////////////////////////////////////////////////////////////
// ローカル関数（この先の関数はユーザーは使っちゃダメ）
/////////////////////////////////////////////////////////////

popupParamSetting.prototype.createGui = function()
{
    // DOM 生成
    this.dom = document.createElement("div");
    this.dom.classList.add("popupParamSetting");
    this.createBarGraphGui();
    this.createPointGui();
    this.createArcGui();    
    this.createLineGui();
    this.createPolygonGui();    
}

popupParamSetting.prototype.createBarGraphGui = function()
{
    this.domBarGraphGui = document.createElement("div");
    //this.domBarGraphGui.classList.add("popupParamSetting");

    this.nameSetAreaBarGraph = document.createElement("div");
    this.nameSetAreaBarGraph.classList.add("popupGuiCompnentArea");
    this.nameLabelBarGraph = document.createElement("div");
    this.nameLabelBarGraph.classList.add("popupGuiCompnent");
    this.nameLabelBarGraph.textContent = "Name";
    this.nameInputBarGraph = document.createElement("input");
    this.nameInputBarGraph.classList.add("popupGuiCompnent");
    this.nameInputBarGraph.type = "text";
    this.nameSetAreaBarGraph.appendChild(this.nameLabelBarGraph);
    this.nameSetAreaBarGraph.appendChild(this.nameInputBarGraph);
    this.domBarGraphGui.appendChild(this.nameSetAreaBarGraph);
    
    this.valueSetAreaBarGraph = document.createElement("div");
    this.valueSetAreaBarGraph.classList.add("popupGuiCompnentArea");
    this.valueLabelBarGraph = document.createElement("div");
    this.valueLabelBarGraph.classList.add("popupGuiCompnent");
    this.valueLabelBarGraph.textContent = "Value";    
    this.valueInputBarGraph = document.createElement("input");
    this.valueInputBarGraph.classList.add("popupGuiCompnent");    
    this.valueInputBarGraph.type = "text";
    this.valueSetAreaBarGraph.appendChild(this.valueLabelBarGraph);
    this.valueSetAreaBarGraph.appendChild(this.valueInputBarGraph);
    this.domBarGraphGui.appendChild(this.valueSetAreaBarGraph);   
    
    this.positionSetAreaBarGraph = document.createElement("div");    
    this.positionSetAreaBarGraph.classList.add("popupGuiCompnentArea");
    this.positionLabelBarGraph = document.createElement("div");
    this.positionLabelBarGraph.classList.add("popupGuiCompnent");
    this.positionLabelBarGraph.textContent = "Position";
    this.positionValueBarGraphX = document.createElement("div");
    this.positionValueBarGraphX.classList.add("popupGuiCompnent");
    this.positionValueBarGraphX.textContent = "x : 0.0";
    this.positionValueBarGraphY = document.createElement("div");
    this.positionValueBarGraphY.classList.add("popupGuiCompnent");
    this.positionValueBarGraphY.textContent = "y : 0.0";
    this.moveButtonBarGraph = document.createElement("button");
    this.moveButtonBarGraph.classList.add("popupGuiCompnent");    
    this.moveButtonBarGraph.textContent = "Move";  
    this.positionSetAreaBarGraph.appendChild(this.positionLabelBarGraph);
    //this.positionSetAreaBarGraph.appendChild(this.positionValueBarGraphX);
    //this.positionSetAreaBarGraph.appendChild(this.positionValueBarGraphY);
    this.positionSetAreaBarGraph.appendChild(this.moveButtonBarGraph);    
    this.domBarGraphGui.appendChild(this.positionSetAreaBarGraph);
}

popupParamSetting.prototype.createPointGui = function()
{
    this.domPointGui = document.createElement("div");
    //this.domPointGui.classList.add("popupParamSetting");

    this.nameSetAreaPoint = document.createElement("div");
    this.nameSetAreaPoint.classList.add("popupGuiCompnentArea");
    this.nameLabelPoint = document.createElement("div");
    this.nameLabelPoint.classList.add("popupGuiCompnent");
    this.nameLabelPoint.textContent = "Name";
    this.nameInputPoint = document.createElement("input");
    this.nameInputPoint.classList.add("popupGuiCompnent");
    this.nameInputPoint.type = "text";
    this.nameSetAreaPoint.appendChild(this.nameLabelPoint);
    this.nameSetAreaPoint.appendChild(this.nameInputPoint);
    this.domPointGui.appendChild(this.nameSetAreaPoint);
    
    this.valueSetAreaPoint = document.createElement("div");
    this.valueSetAreaPoint.classList.add("popupGuiCompnentArea");
    this.valueLabelPoint = document.createElement("div");
    this.valueLabelPoint.classList.add("popupGuiCompnent");
    this.valueLabelPoint.textContent = "Value";    
    this.valueInputPoint = document.createElement("input");
    this.valueInputPoint.classList.add("popupGuiCompnent");    
    this.valueInputPoint.type = "text";
    this.valueSetAreaPoint.appendChild(this.valueLabelPoint);
    this.valueSetAreaPoint.appendChild(this.valueInputPoint);
    this.domPointGui.appendChild(this.valueSetAreaPoint);  

    this.positionSetAreaPoint = document.createElement("div");    
    this.positionSetAreaPoint.classList.add("popupGuiCompnentArea");
    this.positionLabelPoint = document.createElement("div");
    this.positionLabelPoint.classList.add("popupGuiCompnent");
    this.positionLabelPoint.textContent = "Position";
    this.positionValuePointX = document.createElement("div");
    this.positionValuePointX.classList.add("popupGuiCompnent");
    this.positionValuePointX.textContent = "x : 0.0";
    this.positionValuePointY = document.createElement("div");
    this.positionValuePointY.classList.add("popupGuiCompnent");
    this.positionValuePointY.textContent = "y : 0.0";
    this.moveButtonPoint = document.createElement("button");
    this.moveButtonPoint.classList.add("popupGuiCompnent");    
    this.moveButtonPoint.textContent = "Move";  
    this.positionSetAreaPoint.appendChild(this.positionLabelPoint);
    //this.positionSetAreaPoint.appendChild(this.positionValuePointX);
    //this.positionSetAreaPoint.appendChild(this.positionValuePointY);
    this.positionSetAreaPoint.appendChild(this.moveButtonPoint);    
    this.domPointGui.appendChild(this.positionSetAreaPoint);    
}

popupParamSetting.prototype.createArcGui = function()
{
    this.domArcGui = document.createElement("div");
    //this.domArcGui.classList.add("popupParamSetting");

    this.nameSetAreaArc = document.createElement("div");
    this.nameSetAreaArc.classList.add("popupGuiCompnentArea");
    this.nameLabelArc = document.createElement("div");
    this.nameLabelArc.classList.add("popupGuiCompnent");
    this.nameLabelArc.textContent = "Name";
    this.nameInputArc = document.createElement("input");
    this.nameInputArc.classList.add("popupGuiCompnent");
    this.nameInputArc.type = "text";
    this.nameSetAreaArc.appendChild(this.nameLabelArc);
    this.nameSetAreaArc.appendChild(this.nameInputArc);
    this.domArcGui.appendChild(this.nameSetAreaArc);
    
    this.valueSetAreaArc = document.createElement("div");
    this.valueSetAreaArc.classList.add("popupGuiCompnentArea");
    this.valueLabelArc = document.createElement("div");
    this.valueLabelArc.classList.add("popupGuiCompnent");
    this.valueLabelArc.textContent = "Value";    
    this.valueInputArc = document.createElement("input");
    this.valueInputArc.classList.add("popupGuiCompnent");    
    this.valueInputArc.type = "text";
    this.valueSetAreaArc.appendChild(this.valueLabelArc);
    this.valueSetAreaArc.appendChild(this.valueInputArc);
    this.domArcGui.appendChild(this.valueSetAreaArc);   
    
    this.positionSetAreaArcStart = document.createElement("div");    
    this.positionSetAreaArcStart.classList.add("popupGuiCompnentArea");
    this.positionLabelArcStart = document.createElement("div");
    this.positionLabelArcStart.classList.add("popupGuiCompnent");
    this.positionLabelArcStart.textContent = "Start Position";
    this.moveButtonArcStart = document.createElement("button");
    this.moveButtonArcStart.classList.add("popupGuiCompnent");    
    this.moveButtonArcStart.textContent = "Move";  
    this.positionSetAreaArcStart.appendChild(this.positionLabelArcStart);
    this.positionSetAreaArcStart.appendChild(this.moveButtonArcStart);    
    this.domArcGui.appendChild(this.positionSetAreaArcStart);

    this.positionSetAreaArcEnd = document.createElement("div");    
    this.positionSetAreaArcEnd.classList.add("popupGuiCompnentArea");
    this.positionLabelArcEnd = document.createElement("div");
    this.positionLabelArcEnd.classList.add("popupGuiCompnent");
    this.positionLabelArcEnd.textContent = "End Position";
    this.moveButtonArcEnd = document.createElement("button");
    this.moveButtonArcEnd.classList.add("popupGuiCompnent");    
    this.moveButtonArcEnd.textContent = "Move";  
    this.positionSetAreaArcEnd.appendChild(this.positionLabelArcEnd);
    this.positionSetAreaArcEnd.appendChild(this.moveButtonArcEnd);    
    this.domArcGui.appendChild(this.positionSetAreaArcEnd);
}

popupParamSetting.prototype.createLineGui = function()
{
    this.domLineGui = document.createElement("div");

    this.nameSetAreaLine = document.createElement("div");
    this.nameSetAreaLine.classList.add("popupGuiCompnentArea");
    this.nameLabelLine = document.createElement("div");
    this.nameLabelLine.classList.add("popupGuiCompnent");
    this.nameLabelLine.textContent = "Name";
    this.nameInputLine = document.createElement("input");
    this.nameInputLine.classList.add("popupGuiCompnent");
    this.nameInputLine.type = "text";
    this.nameSetAreaLine.appendChild(this.nameLabelLine);
    this.nameSetAreaLine.appendChild(this.nameInputLine);
    this.domLineGui.appendChild(this.nameSetAreaLine);
    
    this.valueSetAreaLine = document.createElement("div");
    this.valueSetAreaLine.classList.add("popupGuiCompnentArea");
    this.valueLabelLine = document.createElement("div");
    this.valueLabelLine.classList.add("popupGuiCompnent");
    this.valueLabelLine.textContent = "Value";    
    this.valueInputLine = document.createElement("input");
    this.valueInputLine.classList.add("popupGuiCompnent");    
    this.valueInputLine.type = "text";
    this.valueSetAreaLine.appendChild(this.valueLabelLine);
    this.valueSetAreaLine.appendChild(this.valueInputLine);
    this.domLineGui.appendChild(this.valueSetAreaLine);  
}

popupParamSetting.prototype.createPolygonGui = function()
{
    this.domPolygonGui = document.createElement("div");

    this.nameSetAreaPolygon = document.createElement("div");
    this.nameSetAreaPolygon.classList.add("popupGuiCompnentArea");
    this.nameLabelPolygon = document.createElement("div");
    this.nameLabelPolygon.classList.add("popupGuiCompnent");
    this.nameLabelPolygon.textContent = "Name";
    this.nameInputPolygon = document.createElement("input");
    this.nameInputPolygon.classList.add("popupGuiCompnent");
    this.nameInputPolygon.type = "text";
    this.nameSetAreaPolygon.appendChild(this.nameLabelPolygon);
    this.nameSetAreaPolygon.appendChild(this.nameInputPolygon);
    this.domPolygonGui.appendChild(this.nameSetAreaPolygon);
    
    this.valueSetAreaPolygon = document.createElement("div");
    this.valueSetAreaPolygon.classList.add("popupGuiCompnentArea");
    this.valueLabelPolygon = document.createElement("div");
    this.valueLabelPolygon.classList.add("popupGuiCompnent");
    this.valueLabelPolygon.textContent = "Value";    
    this.valueInputPolygon = document.createElement("input");
    this.valueInputPolygon.classList.add("popupGuiCompnent");    
    this.valueInputPolygon.type = "text";
    this.valueSetAreaPolygon.appendChild(this.valueLabelPolygon);
    this.valueSetAreaPolygon.appendChild(this.valueInputPolygon);
    this.domPolygonGui.appendChild(this.valueSetAreaPolygon);  
}

popupParamSetting.prototype.setUpEvent = function()
{
    this.nameInputBarGraph.onchange = function(event){
        if( this.callback )
        {
            this.callback( "name", this.nameInputBarGraph.value )
        }
    }.bind(this);

    this.valueInputBarGraph.onchange = function(event){
        if( this.callback )
        {
            this.callback( "value", this.valueInputBarGraph.value )
        }
    }.bind(this);

    this.moveButtonBarGraph.onclick = function(event){
        if( this.callback )
        {
            this.callback( "move", null )
        }
    }.bind(this);    
    
    this.nameInputPoint.onchange = function(event){
        if( this.callback )
        {
            this.callback( "name", this.nameInputPoint.value )
        }
    }.bind(this);

    this.valueInputPoint.onchange = function(event){
        if( this.callback )
        {
            this.callback( "value", this.valueInputPoint.value )
        }
    }.bind(this);

    this.moveButtonPoint.onclick = function(event){
        if( this.callback )
        {
            this.callback( "move", null )
        }
    }.bind(this);     

    this.nameInputArc.onchange = function(event){
        if( this.callback )
        {
            this.callback( "name", this.nameInputArc.value )
        }
    }.bind(this);

    this.valueInputArc.onchange = function(event){
        if( this.callback )
        {
            this.callback( "value", this.valueInputArc.value )
        }
    }.bind(this);    

    this.moveButtonArcStart.onclick = function(event){
        if( this.callback )
        {
            this.callback( "moveArcStart", null )
        }
    }.bind(this);     

    this.moveButtonArcEnd.onclick = function(event){
        if( this.callback )
        {
            this.callback( "moveArcEnd", null )
        }
    }.bind(this);         

    this.nameInputLine.onchange = function(event){
        if( this.callback )
        {
            this.callback( "name", this.nameInputLine.value )
        }
    }.bind(this);

    this.valueInputLine.onchange = function(event){
        if( this.callback )
        {
            this.callback( "value", this.valueInputLine.value )
        }
    }.bind(this);    

    this.nameInputPolygon.onchange = function(event){
        if( this.callback )
        {
            this.callback( "name", this.nameInputPolygon.value )
        }
    }.bind(this);

    this.valueInputPolygon.onchange = function(event){
        if( this.callback )
        {
            this.callback( "value", this.valueInputPolygon.value )
        }
    }.bind(this);        

}
