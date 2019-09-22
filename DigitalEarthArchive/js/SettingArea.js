
let SettingArea = function()
{
    this.dom = document.createElement("div");
    this.dom.style.height = "calc( 100% - 20px )";
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.padding = "10px 15px 10px 15px";
    this.dom.style.backgroundColor = "rgb( 10, 155, 148 )";
    this.dom.style.color = "rgb( 255, 255, 255 )";  

    this.settingSelectBar = document.createElement("div");
    this.settingSelectBar.style.display = "flex";
    this.settingSelectBar.style.flexDirection = "row";
    this.settingSelectBar.style.justifyContent = "space-between";
    this.settingSelectBar.style.alignItems = "center";
    this.settingSelectBar.style.border = "1px solid #fff";
    this.settingSelectBar.style.borderStyle = "none none solid none";  
    this.settingSelectBar.style.padding = "0px 0px 5px 0px";     
    this.settingSelectBar.style.margin = "0px 0px 10px 0px";
    this.settingLabel = document.createElement("div");
    this.settingLabel.style.fontSize = "28px";
    this.settingButtonArea = document.createElement("div");
    this.settingButtonArea.style.display = "flex";
    this.settingButtonArea.style.flexDirection = "row";
    this.settingButtonArea.style.justifyContent = "space-between";
    this.settingButtonArea.style.alignItems = "center";    
    this.settingList = [
        { name:"File", image:"FileManager" },
        { name:"Data List", image:"DataList" },
        { name:"Camera", image:"CameraController" },       
        { name:"Filter", image:"KeywordFilter" },    
        { name:"Config", image:"Config" },        
    ]
    for( let i in this.settingList ){
        let icon = document.createElement("img");
        icon.style.width = "40px";
        icon.style.height = "40px";
        icon.style.padding = "0px 0px 0px 7px";
        icon.style.cursor = "pointer";
        icon.src = "image/" + this.settingList[i].image + "_0.png";
        icon.onclick = function(){
            this.changeSettingView( this.settingList[i].name );
        }.bind(this)

        if( g_isViewerMode ){
            if( this.settingList[i].name != "Config" ){
                this.settingButtonArea.appendChild( icon );
            }
        }else{
            this.settingButtonArea.appendChild( icon );
        }
        this.settingList[i].icon = icon;
    }
    this.settingSelectBar.appendChild( this.settingLabel );
    this.settingSelectBar.appendChild( this.settingButtonArea );

    this.fileManager   = new FileManager();
    this.dataList      = new DataList();
    this.cameraSetting = new CameraSetting();
    this.keywordFilter = new KeywordFilter();
    this.config        = new Config();
    this.dataEditor    = new DataEditor();
    this.dataViewer    = new DataViewer();
    this.vertexEdit    = new VertexEdit();

    this.dom.appendChild( this.settingSelectBar );
    this.dom.appendChild( this.fileManager.getDom() );
    this.dom.appendChild( this.dataList.getDom() );
    this.dom.appendChild( this.cameraSetting.getDom() );
    this.dom.appendChild( this.keywordFilter.getDom() );
    this.dom.appendChild( this.config.getDom() );
    this.dom.appendChild( this.dataEditor.getDom() );
    this.dom.appendChild( this.dataViewer.getDom() );
    this.dom.appendChild( this.vertexEdit.getDom() );

    this.currentViewName = "";
    this.changeSettingView( "File" );
}

SettingArea.prototype.getDom = function()
{
    return this.dom;
}

SettingArea.prototype.resize = function()
{
    this.fileManager.resize();  
    this.dataList.resize();     
    this.cameraSetting.resize();
    this.keywordFilter.resize();
    this.config.resize();       
    this.dataEditor.resize();   
    this.dataViewer.resize();
}

SettingArea.prototype.setData = function( name, data )
{
    if( g_isViewerMode ){
        this.dataViewer.setData( name, data );
        this.changeSettingView( "DataViewer" );
    }else{
        this.dataEditor.setData( name, data );
        this.changeSettingView( "DataEditor" );
        this.dataEditor.resize();
    }
}

SettingArea.prototype.addDataList = function( name )
{
    this.dataList.addData( name )
}

SettingArea.prototype.deleteDataList = function( name )
{
    this.dataList.deleteData( name )
}

SettingArea.prototype.setDefaultParam = function( type, param )
{
    this.config.setDefaultParam( type, param );
}

SettingArea.prototype.setColorStyle = function( style )
{
    this.config.setColorStyle( style );
}

SettingArea.prototype.getColorStyle = function()
{
    return this.config.getColorStyle();
}

SettingArea.prototype.changeSettingView = function( name )
{
    if( this.currentViewName == name ){
        return;
    }

    this.currentViewName = name;
    this.settingSelectBar.style.display = "flex";
    this.fileManager.show(false);
    this.dataList.show(false);   
    this.cameraSetting.show(false);   
    this.keywordFilter.show(false);   
    this.config.show(false);   
    this.dataEditor.show(false);   
    this.dataViewer.show(false);   
    this.vertexEdit.show(false);

    for( let j in this.settingList ){
        if( name == this.settingList[j].name ){
            this.settingList[j].icon.src = "image/" + this.settingList[j].image + "_1.png";
            this.settingLabel.textContent = this.settingList[j].name;
        }else{
            this.settingList[j].icon.src = "image/" + this.settingList[j].image + "_0.png";
        }
    }

    if( this.currentViewName == "File" ){
        this.fileManager.show(true);
    }else if( this.currentViewName == "Data List" ){
        this.dataList.show(true);
    }else if( this.currentViewName == "Camera"){
        this.cameraSetting.show(true);
    }else if( this.currentViewName == "Filter" ){
        this.keywordFilter.show(true);
    }else if( this.currentViewName == "Config" ){
        this.config.show(true);        
    }else if( this.currentViewName == "DataEditor" ){
        this.dataEditor.show(true);
        this.settingLabel.textContent = "";
    }else if( this.currentViewName == "DataViewer" ){
        this.dataViewer.show(true);
        this.settingLabel.textContent = "";
    }else if( this.currentViewName == "VertexEdit" ){
        this.settingSelectBar.style.display = "none"
        this.vertexEdit.show(true);
    }else{
        this.dataList.show(true);
    }
}

SettingArea.prototype.setBackgroundColor = function( r, g, b )
{
    let bgColor = "rgb(" + r + "," + g + "," + b + ")";
    this.dom.style.backgroundColor = bgColor;
}

SettingArea.prototype.setTextColor = function( r, g, b )
{
    let textColor = "rgb(" + r + "," + g + "," + b + ")";
    this.dom.style.color = textColor;
}

SettingArea.prototype.setVertexInfo = function( idx, lon, lat )
{
    this.vertexEdit.setVertexInfo( idx, lon, lat );
}

SettingArea.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}