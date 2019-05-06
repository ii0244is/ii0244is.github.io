let FileManager = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.overflowY = "scroll"; 
    this.dom.style.padding = "0px 10px 0px 0px";     

    let addParam = function( name, input ){
        let row = document.createElement("div");
        row.style.display = "flex"; 
        row.style.flexDirection = "row"; 
        row.style.alignItems = "center";
        row.style.margin = "10px 0px 5px 0px";        
        let label = document.createElement("div");
        label.textContent = name;
        label.style.width = "100px";
        label.style.margin = "0px 20px 0px 0px";
        row.appendChild(label);
        row.appendChild(input);
        this.dom.appendChild(row);
    }.bind(this);    

    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = function(event){
        loadProjectFile(event.target.files);
    }.bind(this);
    addParam( "Import", fileInput );

    if( g_isViewerMode ){
        return;
    }

    let fileDownloadArea = document.createElement("div");
    fileDownloadArea.style.display = "flex";
    fileDownloadArea.style.flexDirection = "column";
    fileDownloadArea.style.backgroundColor = "#fff";
    fileDownloadArea.style.color = "#111";
    fileDownloadArea.style.padding = "10px 15px 10px 15px";
    fileDownloadArea.style.margin  = "10px 0px 10px 0px"; 
    fileDownloadArea.style.borderRadius = "10px"    
    let fileNameArea = document.createElement("div");
    fileNameArea.style.display = "flex";
    fileNameArea.style.flexDirection = "row";
    fileNameArea.style.alignItems = "center";
    fileNameArea.style.margin  = "0px 0px 10px 0px"; 
    let fileNameLabel = document.createElement("div");
    fileNameLabel.textContent = "File Name"
    fileNameLabel.style.padding = "0px 10px 0px 0px"
    let fileNameInput = document.createElement("input");
    fileNameInput.style.borderRadius = "10px";
    fileNameInput.style.padding = "5px";
    fileNameArea.appendChild( fileNameLabel );
    fileNameArea.appendChild( fileNameInput );
    let downloadButton = document.createElement("a");
    downloadButton.href = "#";
    downloadButton.textContent = "Download";
    downloadButton.classList.add( "textButton" );
    downloadButton.onclick = function(){
        if (fileNameInput.value === ""){
            window.confirm("Please enter the name of your project.");
        }else{
            downloadProjectFile( fileNameInput.value, downloadButton );
        }
    }.bind(this);
    fileDownloadArea.appendChild( fileNameArea );
    fileDownloadArea.appendChild( downloadButton );
    addParam( "Export", fileDownloadArea );
}

FileManager.prototype.getDom = function()
{
    return this.dom;
}

FileManager.prototype.resize = function()
{
}

FileManager.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}
