let DataList = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.overflowY = "scroll"; 
    this.dom.style.padding = "0px 10px 0px 0px"; 
    
    this.dataTable = {};
}

DataList.prototype.getDom = function()
{
    return this.dom;
}

DataList.prototype.resize = function()
{
}

DataList.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
        this.update();
    }else{
        this.dom.style.display = "none";
    }
}

DataList.prototype.addData = function( objName )
{
    let row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexDirection = "row";
    row.style.alignItems = "center"
    row.style.justifyContent = "space-between";
    row.style.margin = "0px 0px 3px 10px";
    row.style.padding = "3px 3px 3px 3px";
    row.style.flexShrink = "0";
    row.style.border = "1px solid #fff";
    row.style.borderStyle = "none none solid none";

    let label = document.createElement("div");
    label.textContent = g_dataList[ objName ];
    row.appendChild(label);

    let editButton = document.createElement("div");
    if( g_isViewerMode ){
        editButton.textContent = "Go";
    }else{
        editButton.textContent = "Edit";
    }
    editButton.classList.add( "textButton" );
    editButton.style.padding = "3px 15px 3px 15px"
    editButton.style.margin = "0px 0px 3px 0px" 
    editButton.style.border = "1px solid #444";
    editButton.style.borderStyle = "solid";           
    editButton.onclick = function(){
        jumpToObjectPosition( objName );
        jumpToObjectTime( objName )
        selectObject( objName );
    }
    row.appendChild(editButton);

    this.dom.appendChild( row );
    this.dataTable[ objName ] = { row:row, label:label }
}

DataList.prototype.deleteData = function( objName )
{
    this.dom.removeChild( this.dataTable[ objName ].row );
    delete this.dataTable[ objName ];
}

DataList.prototype.update = function()
{
    for( let objName in this.dataTable ){
        let name = g_dataList[objName].name;
        this.dataTable[ objName ].label.textContent = name;
    }
}