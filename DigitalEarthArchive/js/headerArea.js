
headerArea = function ()
{
    this.title = new titleArea();    
    this.modeChange = new modeChangeArea();
}

headerArea.prototype.setMode= function ( mode )
{
    this.modeChange.setMode( mode );
}

headerArea.prototype.setTitle = function ( title )
{
    this.title.setTitle( title );
}

headerArea.prototype.getTitle = function ()
{
    return this.title.getTitle();
}

//////////////////////////////////////////////////////////
// title area
//////////////////////////////////////////////////////////

titleArea = function ()
{
    this.dom = document.getElementById("titleArea");  
    this.dom.textContent = "Data Visualization";
}

titleArea.prototype.setTitle = function ( title )
{
    this.dom.textContent = title
}

titleArea.prototype.getTitle = function ()
{
    return this.dom.textContent;
}


//////////////////////////////////////////////////////////
// mode change area
//////////////////////////////////////////////////////////

modeChangeArea = function ()
{
    this.dom = document.getElementById("modeChangeArea");

    // Mode Change Button Area
    this.modeChangeButtonArea = document.createElement("div");
    this.modeChangeButtonArea.className = "modeChangeButtonArea";
    this.buttonFieldSet = document.createElement("div");
    this.buttonFieldSet.className = "modeChangeButton";
    this.buttonFieldSet.textContent = "Config";
    this.buttonCameraSet = document.createElement("div");
    this.buttonCameraSet.className = "modeChangeButton";
    this.buttonCameraSet.textContent = "Camera";
    this.buttonDataSet = document.createElement("div");
    this.buttonDataSet.className = "modeChangeButton";
    this.buttonDataSet.textContent = "Data";
    this.buttonFileSet = document.createElement("div");
    this.buttonFileSet.className = "modeChangeButton";
    this.buttonFileSet.textContent = "File";

    if( g_isViewerMode )
    {
        this.modeChangeButtonArea.appendChild(this.buttonCameraSet);
        this.modeChangeButtonArea.appendChild(this.buttonDataSet);
        this.dom.appendChild(this.modeChangeButtonArea);
        this.buttonDataSet.className = "modeChangeButtonSelect";
    }else{
        this.modeChangeButtonArea.appendChild(this.buttonFieldSet);
        this.modeChangeButtonArea.appendChild(this.buttonCameraSet);
        this.modeChangeButtonArea.appendChild(this.buttonDataSet);
        this.modeChangeButtonArea.appendChild(this.buttonFileSet);
        this.dom.appendChild(this.modeChangeButtonArea);
        this.buttonDataSet.className = "modeChangeButtonSelect";
    }

    this.buttonFieldSet.addEventListener("click", function ()
    {
        this.reset();
        this.buttonFieldSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("Config"); 
    }.bind(this));

    this.buttonCameraSet.addEventListener("click", function ()
    {
        this.reset();
        this.buttonCameraSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("Camera");
    }.bind(this));

    this.buttonDataSet.addEventListener("click", function ()
    {
        this.reset();
        this.buttonDataSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("DataList");     
    }.bind(this) );

    this.buttonFileSet.addEventListener("click", function ()
    {
        this.reset();
        this.buttonFileSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("File");
    }.bind(this) );
}

modeChangeArea.prototype.reset = function()
{
    this.buttonFieldSet.className  = "modeChangeButton";    
    this.buttonCameraSet.className = "modeChangeButton";
    this.buttonDataSet.className   = "modeChangeButton";
    this.buttonFileSet.className   = "modeChangeButton";
}

modeChangeArea.prototype.setMode = function( mode )
{
    this.reset();
    
    if( mode == "Config" )
    {
        this.buttonFieldSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("Config"); 
    }
    else if( mode == "Camera")
    {
        this.buttonCameraSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("Camera");
    }
    else if( mode == "DataList" )        
    {
        this.buttonDataSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("DataList");     
    }
    else if( mode == "File" )        
    {
        this.buttonFileSet.className = "modeChangeButtonSelect";
        g_paramSet.setView("File");
    }
}