
barGraphDataSetting = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";    
    this.dom.style.overflowY = "auto";

    this.selectedObjName = null;

    // dataect type
    this.dataType = document.createElement("div");
    this.dataType.textContent = "Data Type : Bar Graph";
    this.dataType.style.padding = "8px 5px 0px 5px";    
    this.dom.appendChild( this.dataType );

    // name
    this.dataNameInput = document.createElement("input");
    this.dataNameInput.type = "text";
    this.dataNameInput.style.width = "100%";

    // position
    this.dataPosInputArea = new guiComponent2ValueInput( function(diffX, diffY) {
        let x = Number(this.dataPosXInput.value);
        let z = Number(this.dataPosZInput.value);
        let radH = g_webGLView.cameraPosH * 3.141592 / 180;
        x += diffY * Math.cos(radH) * g_webGLView.moveStep;
        z += diffY * Math.sin(radH) * g_webGLView.moveStep;
        x += diffX * Math.sin(radH) * g_webGLView.moveStep;
        z += -diffX * Math.cos(radH) * g_webGLView.moveStep;
        this.dataPosXInput.value = x;
        this.dataPosZInput.value = z;
        this.changeData();
    }.bind(this) )
    this.dataPosXInput = this.dataPosInputArea.getValue1Dom();
    this.dataPosZInput = this.dataPosInputArea.getValue2Dom();
    
    // value
    this.dataValueInput = document.createElement("input");
    this.dataValueInput.type = "text";
    this.dataValueInput.style.width = "100%";
    
    // memo
    this.dataMemoInput = document.createElement("textarea");
    this.dataMemoInput.rows = 6;
    this.dataMemoInput.style.width = "100%";
    this.dataMemoInput.onchange = function(){
        g_dataList[ this.selectedObjName ].memo = this.dataMemoInput.value;
    }.bind(this);

    // date
    this.dataDateInput = new guiComponentDateInput( function() {
        this.changeData();
    }.bind(this) )
    this.startTimeInput = this.dataDateInput.getStartDateDom();
    this.endTimeInput = this.dataDateInput.getEndDateDom();

    // height
    this.dataHeightInputArea = new guiComponent1ValueInput( function(diffX, diffY) {
        let x = Number(this.dataHeightInput.value);
        x += diffX * 0.1;
        this.dataHeightInput.value = x;
        this.changeData();
    }.bind(this) )
    this.dataHeightInput = this.dataHeightInputArea.getValue1Dom();

    // size
    this.dataSizeInputArea = new guiComponent1ValueInput( function(diffX, diffY) {
        let x = Number(this.dataSizeInput.value);
        x += diffX * 0.1;
        this.dataSizeInput.value = x;
        this.changeData();
    }.bind(this) )
    this.dataSizeInput = this.dataSizeInputArea.getValue1Dom();

    // color
    this.dataColorInputArea = new guiComponentColorInput( function(color){
        this.changeData();
    }.bind(this) );

    // keyword
    this.keywordSelector = new guiComponentSelector( function(){
        this.changeData();
    }.bind(this) )

    // delete
    this.deleteButton = document.createElement("input");
    this.deleteButton.type = "button";
    this.deleteButton.value = "Delete this data";
    this.deleteButton.onclick = function(){
        deleteObject( this.selectedObjName );
    }.bind(this);

    // create gui table
    this.table = new guiComponentTable();
    this.table.addRow( "Name", this.dataNameInput );
    this.table.addRow( "Position", this.dataPosInputArea.getDom() );
    this.table.addRow( "Value", this.dataValueInput );
    this.table.addRow( "Memo", this.dataMemoInput );
    this.table.addRow( "Date", this.dataDateInput.getDom() );    
    this.table.addRow( "Height", this.dataHeightInputArea.getDom() );    
    this.table.addRow( "Size", this.dataSizeInputArea.getDom() );
    this.table.addRow( "Color", this.dataColorInputArea.getDom() );  
    this.table.addRow( "Keyword", this.keywordSelector.getDom() );
    this.table.addRow( "Delete", this.deleteButton );    
    this.dom.appendChild( this.table.getDom() );

    // setup event
    this.dataNameInput.onchange = this.changeData.bind(this);
    this.dataPosXInput.onchange = this.changeData.bind(this);
    this.dataPosZInput.onchange = this.changeData.bind(this);
    this.dataValueInput.onchange = this.changeData.bind(this);
    this.dataHeightInput.onchange = this.changeData.bind(this);
    this.dataSizeInput.onchange = this.changeData.bind(this);
}

barGraphDataSetting.prototype.getDom = function ()
{
    return this.dom;
}

barGraphDataSetting.prototype.setParam = function ( name )
{
    this.selectedObjName = name;

    let data = g_dataList[name];
    this.dataNameInput.value   = data.name;
    this.dataPosXInput.value   = data.position[0];
    this.dataPosZInput.value   = data.position[2]; 
    this.dataValueInput.value  = data.value;
    this.dataMemoInput.value   = data.memo;
    if( data.startTime ) {
        this.startTimeInput.value = data.startTime;
    }else{
        this.startTimeInput.value = null;
    }
    if( data.endTime ) {
        this.endTimeInput.value   = data.endTime;
    }else{
        this.endTimeInput.value = null;
    }
    this.dataHeightInput.value = data.height;    
    this.dataSizeInput.value   = data.size;
    this.dataColorInputArea.setColor( data.color );
    this.keywordSelector.setSelectorItems( g_keywordFilter.getKeywordList() );
    let selector = this.keywordSelector.getDom();
    for( let i = 0; i < data.keywords.length; ++i )
    {
        for( let j = 0; j < selector.options.length; ++j ){
            if( selector.options[j].value == data.keywords[i] ){
                selector.options[j].selected = true;
            }
        }
    }        
}

barGraphDataSetting.prototype.changeData = function ()
{
    let name   = this.dataNameInput.value;
    let posX   = Number(this.dataPosXInput.value);
    let posY   = 0;
    let posZ   = Number(this.dataPosZInput.value);
    let value  = this.dataValueInput.value;
    let startTime = this.startTimeInput.value;
    let endTime = this.endTimeInput.value;
    let height = Number(this.dataHeightInput.value);
    let size   = Number(this.dataSizeInput.value);
    let color  = this.dataColorInputArea.getColor();
    let keywords = this.keywordSelector.getSelectedItems();

    g_dataList[ this.selectedObjName ].name      = name
    g_dataList[ this.selectedObjName ].position  = [posX, posY, posZ]; 
    g_dataList[ this.selectedObjName ].value     = value; 
    g_dataList[ this.selectedObjName ].size      = size;
    g_dataList[ this.selectedObjName ].startTime = startTime;
    g_dataList[ this.selectedObjName ].endTime   = endTime;
    g_dataList[ this.selectedObjName ].height    = height;    
    g_dataList[ this.selectedObjName ].color     = color; 
    g_dataList[ this.selectedObjName ].keywords  = keywords;

    g_popup.hide();
    g_paramSet.changeDataList( this.selectedObjName );
    changeObjectParam( this.selectedObjName );
}