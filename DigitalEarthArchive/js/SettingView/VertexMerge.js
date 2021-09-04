let VertexMerge = function()
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

    this.VertexMergeLabel = document.createElement("div");
    this.VertexMergeLabel.textContent = "Merge";
    this.VertexMergeLabel.style.border = "1px solid #fff";
    this.VertexMergeLabel.style.borderStyle = "none none solid none";  
    this.VertexMergeLabel.style.padding = "0px 0px 10px 0px";     
    this.VertexMergeLabel.style.margin = "0px 0px 10px 0px";
    this.VertexMergeLabel.style.fontSize = "24px";

    this.objectName = document.createElement("div");

    this.mergeButton = document.createElement("div");
    this.mergeButton.textContent = "Merge";
    this.mergeButton.classList.add( "textButton" );
    this.mergeButton.style.padding = "5px 20px 5px 20px"
    this.mergeButton.style.margin = "10px 20px 10px 0px" 
    this.mergeButton.style.border = "1px solid #444";
    this.mergeButton.style.borderStyle = "solid";  

    this.cancelButton = document.createElement("div");
    this.cancelButton.textContent = "Cancel";
    this.cancelButton.classList.add( "textButton" );
    this.cancelButton.style.padding = "5px 20px 5px 20px"
    this.cancelButton.style.margin = "10px 20px 10px 0px" 
    this.cancelButton.style.border = "1px solid #444";
    this.cancelButton.style.borderStyle = "solid";

    let buttonArea = document.createElement("div");
    buttonArea.style.display = "flex"; 
    buttonArea.style.flexDirection = "row"; 
    buttonArea.style.alignItems = "center";
    buttonArea.style.margin = "0px 0px 0px 0px"; 
    buttonArea.appendChild(this.mergeButton);
    buttonArea.appendChild(this.cancelButton);    
    
    this.dom.appendChild(this.VertexMergeLabel);
    this.dom.appendChild(this.objectName);
    this.dom.appendChild(buttonArea);

    this.mergeButton.onclick = function(){
        g_polygonMerge.merge();
    }.bind(this)

    this.cancelButton.onclick = function(){
        g_polygonMerge.cancel();
    }.bind(this)
}

VertexMerge.prototype.getDom = function()
{
    return this.dom;
}

VertexMerge.prototype.resize = function()
{
}

VertexMerge.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

VertexMerge.prototype.setVertexInfo = function()
{
}