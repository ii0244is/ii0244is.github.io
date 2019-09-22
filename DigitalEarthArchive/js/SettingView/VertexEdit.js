let VertexEdit = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";

    let addParam = function( name, input ){
        let row = document.createElement("div");
        row.style.display = "flex"; 
        row.style.flexDirection = "row"; 
        row.style.alignItems = "center";
        row.style.margin = "5px 0px 5px 0px";        
        let label = document.createElement("div");
        label.textContent = name;
        label.style.width = "100px";
        label.style.margin = "0px 0px 0px 0px";
        row.appendChild(label);
        row.appendChild(input);
        this.dom.appendChild(row);
    }.bind(this);

    this.vertexEditLabel = document.createElement("div");
    this.vertexEditLabel.textContent = "Vertex information";
    this.vertexEditLabel.style.border = "1px solid #fff";
    this.vertexEditLabel.style.borderStyle = "none none solid none";  
    this.vertexEditLabel.style.padding = "0px 0px 10px 0px";     
    this.vertexEditLabel.style.margin = "0px 0px 10px 0px";
    this.vertexEditLabel.style.fontSize = "24px";

    this.vertexNumber = document.createElement("div");
    this.longitude = document.createElement("div");
    this.latitude = document.createElement("div");

    this.insertButton = document.createElement("div");
    this.insertButton.textContent = "Insert";
    this.insertButton.classList.add( "textButton" );
    this.insertButton.style.padding = "5px 20px 5px 20px"
    this.insertButton.style.margin = "10px 20px 10px 0px" 
    this.insertButton.style.border = "1px solid #444";
    this.insertButton.style.borderStyle = "solid";  

    this.deleteButton = document.createElement("div");
    this.deleteButton.textContent = "Delete";
    this.deleteButton.classList.add( "textButton" );
    this.deleteButton.style.padding = "5px 20px 5px 20px"
    this.deleteButton.style.margin = "10px 20px 10px 0px" 
    this.deleteButton.style.border = "1px solid #444";
    this.deleteButton.style.borderStyle = "solid";      

    let buttonArea = document.createElement("div");
    buttonArea.style.display = "flex"; 
    buttonArea.style.flexDirection = "row"; 
    buttonArea.style.alignItems = "center";
    buttonArea.style.margin = "0px 0px 0px 0px"; 
    buttonArea.appendChild(this.insertButton);
    buttonArea.appendChild(this.deleteButton);    
    
    let separatorLine = document.createElement("div");
    separatorLine.style.border = "1px solid #fff";
    separatorLine.style.borderStyle = "none none solid none";  
    separatorLine.style.padding = "0px 0px 0px 0px";     
    separatorLine.style.margin = "10px 0px 10px 0px";    

    this.endButton = document.createElement("div");
    this.endButton.textContent = "End";
    this.endButton.classList.add( "textButton" );
    this.endButton.style.padding = "5px 20px 5px 20px"
    this.endButton.style.margin = "10px 0px 10px 0px" 
    this.endButton.style.border = "1px solid #444";
    this.endButton.style.borderStyle = "solid";
    let endButtonRow = document.createElement("div");
    endButtonRow.style.display = "flex"; 
    endButtonRow.style.flexDirection = "row-reverse"; 
    endButtonRow.style.alignItems = "center";
    endButtonRow.style.margin = "5px 0px 5px 0px";  
    endButtonRow.appendChild( this.endButton );

    this.dom.appendChild(this.vertexEditLabel);
    addParam( "Number", this.vertexNumber );
    addParam( "longitude", this.longitude );
    addParam( "latitude", this.latitude );
    this.dom.appendChild(buttonArea);
    this.dom.appendChild(separatorLine);
    this.dom.appendChild(endButtonRow);

    this.insertButton.onclick = function(){
        g_vertexEditor.insertVertex();

    }.bind(this)

    this.deleteButton.onclick = function(){
        g_vertexEditor.deleteVertex();
    }.bind(this)

    this.endButton.onclick = function(){
        g_vertexEditor.finish();
    }.bind(this)
}

VertexEdit.prototype.getDom = function()
{
    return this.dom;
}

VertexEdit.prototype.resize = function()
{
}

VertexEdit.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

VertexEdit.prototype.setVertexInfo = function( idx, lon, lat )
{
    this.vertexNumber.textContent = idx;
    this.longitude.textContent = Math.round(lon * 1000000) / 1000000;
    this.latitude.textContent = Math.round(lat * 1000000) / 1000000;
}