
dataList = function ()
{
    this.dom = document.createElement("div");

    // filter 
    this.filterArea = document.createElement("div");
    this.filterArea.classList.add("filterArea");
    this.filterLabel = document.createElement("div");
    this.filterLabel.style.padding = "2px 5px 2px 5px";
    this.filterLabel.style.backgroundColor = "#888";
    this.filterLabel.style.color = "#fff";    
    this.filterLabel.textContent = "Filter"; 
    this.filterCheckArea = document.createElement("div");
    this.filterCheckArea.classList.add("filterCheckArea");
    this.filterCheckLabel = document.createElement("div");
    this.filterCheckLabel.textContent = "On / Off";
    this.filterCheckLabel.style.float = "left";
    this.filterCheckLabel.style.width = "100px";
    this.filterCheck = document.createElement("input");
    this.filterCheck.type = "checkbox";
    this.filterCheck.classList.add("filterCheck");  
    this.filterCheck.onchange = function(){
        g_keywordFilter.setFilter( this.filterCheck.checked );
        this.updateFilter();
    }.bind(this);
    this.filterCheckArea.appendChild( this.filterCheckLabel );
    this.filterCheckArea.appendChild( this.filterCheck );
    this.keywordSelectorArea = document.createElement("div");
    this.keywordSelectorArea.classList.add("keywordSelectorArea");
    this.keywordSelectorLabel = document.createElement("div");
    this.keywordSelectorLabel.classList.add("keywordLabel");
    this.keywordSelectorLabel.style.width = "100px";    
    this.keywordLabelText = document.createElement("div");
    this.keywordLabelText.textContent = "Keyword";
    this.keywordSelectorLabel.appendChild(this.keywordLabelText);
    this.keywordSelector = document.createElement("select");
    this.keywordSelector.classList.add("KeywordSelector");
    this.keywordSelector.multiple = true;
    this.keywordSelectorArea.appendChild( this.keywordSelectorLabel );
    this.keywordSelectorArea.appendChild( this.keywordSelector );
    this.filterArea.appendChild( this.filterLabel )
    this.filterArea.appendChild( this.filterCheckArea );
    this.filterArea.appendChild( this.keywordSelectorArea );
    this.keywordSelector.onchange = this.updateFilter.bind(this);

    // list
    this.listArea = document.createElement("div");
    this.listArea.classList.add("dataList");
    this.listLabel = document.createElement("div");
    this.listLabel.style.padding = "2px 5px 2px 5px";
    this.listLabel.style.backgroundColor = "#888";
    this.listLabel.style.color = "#fff";    
    this.listLabel.textContent = "Data List"; 
    this.list = document.createElement("div");
    this.list.classList.add("dataList_Table");
    this.listArea.appendChild(this.listLabel);
    this.listArea.appendChild(this.list);
    
    // append dom
    this.dom.appendChild(this.filterArea);
    this.dom.appendChild(this.listArea);

    this.dataTable = {};
    this.numKeyword = 0;
}

dataList.prototype.getDom = function()
{
    return this.dom;
}

dataList.prototype.addData = function( name )
{
    let dataRow = [];
    dataRow[0] = document.createElement("div");
    dataRow[0].classList.add("dataList_Row");
    let data = g_dataList[name];
    dataRow[1] = document.createElement("div");
    dataRow[1].textContent = data.name;
    dataRow[1].classList.add("dataList_Data");
    dataRow[2] = document.createElement("div");
    dataRow[2].textContent = data.value;
    dataRow[2].classList.add("dataList_Data"); 
    dataRow[3] = document.createElement("div");
    let selectButton = document.createElement("input");
    selectButton.type = "button";
    selectButton.value = "select";
    selectButton.style.margin = "3px 5px 0px 0px";
    selectButton.onclick = function(){
        let data = g_dataList[name];
        if( data.type == "Arc"){
            let x = ( data.startPosition[0] + data.endPosition[0] ) / 2
            let z = ( data.startPosition[1] + data.endPosition[1] ) / 2            
            g_cameraWork.startTransition( x, z, 800 );
        }else{
            g_cameraWork.startTransition( data.position[0], data.position[2], 800 );            
        }
        if(data.startTime != ""){
            g_timeManager.startTransition(data.startTime, 800);
        }
        if( g_selectedObjectName != null){
            g_webGLView.getGLObject(g_selectedObjectName).setSelect(false);
        }
        g_selectedObjectName = name;
        g_webGLView.getGLObject(g_selectedObjectName).setSelect(true);      
        if( g_isViewerMode ){
            g_paramSet.setParamView( name );            
        }else{
            g_paramSet.setParam( name );
        }
        g_popup.hide();        
    }.bind(this, name)
    dataRow[3].appendChild( selectButton );
    dataRow[0].appendChild(dataRow[1]);
    dataRow[0].appendChild(dataRow[2]);
    dataRow[0].appendChild(dataRow[3]); 
    this.list.appendChild(dataRow[0]);
    this.dataTable[ name ] = dataRow
}

dataList.prototype.deleteData = function( name )
{
    this.list.removeChild( this.dataTable[name][0] );
    delete this.dataTable[ name ];
}

dataList.prototype.changeData = function( name )
{
    // console.log(this.dataTable);
    let data = g_dataList[name];
    this.dataTable[name][1].textContent = data.name;
    this.dataTable[name][2].textContent = data.value;    
}

dataList.prototype.updateKeywordList = function()
{
    let keywords = g_keywordFilter.getKeywordList();
    if( this.numKeyword == keywords.length ) return;

    while( this.keywordSelector.hasChildNodes() ){
        this.keywordSelector.removeChild( this.keywordSelector.firstChild )
    }

    for( let i in keywords ){
        this.keywordSelector.add( new Option( keywords[i], keywords[i] ) ); 
    }

    this.numKeyword = keywords.length;
}

///////////////////////////////////////////////////////////////
// local function
///////////////////////////////////////////////////////////////

dataList.prototype.updateFilter = function()
{
    let keywordList = [];
    for( let i = 0; i < this.keywordSelector.options.length; ++i ){
        if( this.keywordSelector.options[i].selected == true ){
            keywordList.push( this.keywordSelector.options[i].value )
        }
    }
    g_keywordFilter.setKeywords(keywordList);

    for ( let dataName in g_dataList ){
       
        let hasKeyword = true;
        if( g_keywordFilter.isFilterEnable() )
        {
            hasKeyword = false;
            let data = g_dataList[ dataName ];
            for( let i = 0; i < keywordList.length; ++i ){
                for( let j = 0; j < data.keywords.length; ++j ){
                    if( keywordList[i] == data.keywords[j] ){
                        hasKeyword = true;
                        break;
                    }
                }
            }
        }
        
        if( hasKeyword ){
            this.dataTable[dataName][0].style.display = "flex";
        }else{
            this.dataTable[dataName][0].style.display = "none";
        }
    }
}

