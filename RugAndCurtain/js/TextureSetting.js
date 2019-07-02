
TextureSetting = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "none";
    this.dom.style.flexDirection = "column";

    this.objectName = document.createElement("div");
    this.objectName.style.fontSize = "28px"
    this.objectName.style.padding = "5px 0px 5px 0px";
    this.objectName.style.margin = "5px 0px 5px 0px";  

    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.style.padding = "8px 8px 8px 8px";    
    this.fileInput.style.margin = "5px 0px 5px 0px";  
    this.fileInput.style.backgroundColor = "rgb(150, 150, 150)";
    this.fileInput.style.borderRadius = "8px";

    this.rotateButton = document.createElement("button");
    this.rotateButton.textContent = "Rotate"
    this.rotateButton.style.padding = "8px 8px 8px 8px";  
    this.rotateButton.style.margin = "5px 0px 5px 0px";  
    this.rotateButton.style.backgroundColor = "rgb(150, 150, 150)";
    this.rotateButton.style.borderRadius = "8px";     

    this.dom.appendChild(this.objectName);
    this.dom.appendChild(this.fileInput);
    this.dom.appendChild(this.rotateButton);

    this.fileInput.onchange = function(e){
        if ( !e.target.files[0] ) return;
        let reader = new FileReader();    
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function (e){
            let url = reader.result;
            this.onFileChange( this.objectName.textContent, url );
        }.bind(this)
    }.bind(this)

    this.rotateButton.onclick = function(){
        this.onRotateImage( this.objectName.textContent );
    }.bind(this)
}

TextureSetting.prototype.getDom = function()
{
    return this.dom;
}

TextureSetting.prototype.setParam = function( param )
{
    if( param.name == null ){
        this.dom.style.display = "none";
    }else{
        this.dom.style.display = "flex";
        this.objectName.textContent = param.name;
    }
}

