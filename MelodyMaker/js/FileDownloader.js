
let FileDownloader = function( index )
{
    this.fileIndex = index;

    ///////////////////////////////////////////////////
    // create dom 

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.style.alignItems = "center";
    this.dom.style.margin = "0px 0px 0px 0px";

    this.fileNameInput = document.createElement("input");
    this.fileNameInput.type = "text"; 
    this.fileNameInput.style.width = "240px"; 
    this.dom.appendChild( this.fileNameInput );

    this.downloader = document.createElement("a");
    this.downloader.href = "#";    
    this.downloader.textContent = "save";
    this.downloader.style.margin = "0px 0px 0px 8px"; 
    this.dom.appendChild( this.downloader );
    
    ///////////////////////////////////////////////////
    // event 

    this.onSaveFile = null
    this.downloader.addEventListener("click", function (){

        let fileName = this.fileNameInput.value;
        if( fileName == "" ){
            return alert( "input file Name." );
        }
        fileName += ".json";

        if( this.onSaveFile )
        {
            let jsonData = this.onSaveFile();
            if( jsonData )
            {
                let data = JSON.stringify( jsonData );                
                let blob = new Blob([data], { "type": "text/plain" });
                if (window.navigator.msSaveBlob)
                {
                    window.navigator.msSaveBlob(blob, fileName);
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                }
                else
                {
                    this.downloader.download = fileName;
                    this.downloader.href = window.URL.createObjectURL(blob);
                }               
            }
        }         
    }.bind(this));    
}    

FileDownloader.prototype.getDom = function(){
    return this.dom;
}    
