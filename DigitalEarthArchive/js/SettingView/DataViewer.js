let DataViewer = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.overflowY = "scroll"; 
    this.dom.style.padding = "0px 10px 0px 0px"; 

    this.nameArea = document.createElement("div");
    this.nameArea.style.margin = "5px 0px 10px 0px";
    this.nameArea.style.fontSize = "28px";
    this.noteArea = document.createElement("div");

    this.dom.appendChild( this.nameArea );
    this.dom.appendChild( this.noteArea );
}

DataViewer.prototype.getDom = function()
{
    return this.dom;
}

DataViewer.prototype.resize = function()
{
}

DataViewer.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}

DataViewer.prototype.setData = function( name, data )
{
    this.nameArea.textContent = data.name;
    this.noteArea.innerHTML = data.note;
}