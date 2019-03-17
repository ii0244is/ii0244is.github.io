
paramSettingArea = function ( divID )
{
    this.dom = document.getElementById(divID);
    this.currentView = "";

    this.camera = new cameraSetting();
    this.file = new fileSetting();
    this.dataList = new dataList();
    this.dataParam = new dataParamView();    
    this.config = new configView();
    
    this.barSetting = new barGraphDataSetting();
    this.pointSetting = new pointDataSetting();    
    this.arcSetting = new arcDataSetting();
    this.lineSetting = new lineDataSetting();    
    this.polygonSetting = new polygonDataSetting();        

    this.dom.appendChild(this.dataList.getDom());
}

paramSettingArea.prototype.setSize = function( width, height )
{
    this.dom.style.width = width + "px";
    this.dom.style.height = height + "px";
    this.camera.setSize( width, height );
}

paramSettingArea.prototype.reset = function()
{
    if( this.dom.lastChild )
    {
        this.dom.removeChild(this.dom.lastChild);
    }
}

paramSettingArea.prototype.setView = function( viewName )
{
    if( this.currentView == viewName ) return;

    this.reset();

    if (viewName === "File")
    {
        this.dom.appendChild(this.file.getDom());
    }
    else if (viewName === "Camera")
    {
        this.dom.appendChild(this.camera.getDom());
    }
    else if (viewName === "DataList")
    {
        this.dataList.updateKeywordList();
        this.dom.appendChild(this.dataList.getDom());
    }
    else if (viewName === "Config")
    {
        this.dom.appendChild(this.config.getDom());
    }

    this.currentView = viewName;
}

paramSettingArea.prototype.setParam = function( name )
{
    this.reset();

    let dataType = g_dataList[name].type;
    if (dataType === "BarGraph")
    {
        this.dom.appendChild(this.barSetting.getDom());
        this.barSetting.setParam( name );
    }
    else if (dataType === "Point")
    {
        this.dom.appendChild(this.pointSetting.getDom());
        this.pointSetting.setParam( name );
    }
    else if (dataType === "Arc")
    {
        this.dom.appendChild(this.arcSetting.getDom());
        this.arcSetting.setParam( name );        
    }
    else if (dataType === "Line")
    {
        this.dom.appendChild(this.lineSetting.getDom());
        this.lineSetting.setParam( name );        
    }
    else if (dataType === "Polygon")
    {
        this.dom.appendChild(this.polygonSetting.getDom());
        this.polygonSetting.setParam( name );        
    }
    this.currentView = "";
     
    g_headerArea.setMode("");
}

paramSettingArea.prototype.setParamView = function( name )
{
    this.reset();

    this.dom.appendChild(this.dataParam.getDom());
    this.dataParam.setParam( name );
    this.currentView = "";

    g_headerArea.setMode("");
}

paramSettingArea.prototype.addDataList = function( name )
{
    this.dataList.addData( name );
}

paramSettingArea.prototype.deleteDataList = function( name )
{
    this.dataList.deleteData( name );
}

paramSettingArea.prototype.changeDataList = function( name )
{
    this.dataList.changeData( name );
}

paramSettingArea.prototype.setTitle = function( title )
{
    this.config.setTitle( title );
}

paramSettingArea.prototype.addKeywords = function( list )
{
    this.config.addKeywords( list );
}

paramSettingArea.prototype.setStartTime = function( time )
{
    this.config.setStartTime( time );
}

paramSettingArea.prototype.setEndTime = function( time )
{
    this.config.setEndTime( time );
}

paramSettingArea.prototype.getStartTime = function()
{
    return this.config.getStartTime();
}

paramSettingArea.prototype.getEndTime = function()
{
    return this.config.getEndTime();
}