
let PropertyArea = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";  
    this.dom.style.display = "none";
    this.dom.style.flexDirection = "column";
    //this.dom.style.width = "450px";    
    this.dom.style.width = "30%";       
    this.dom.style.maxWidth = "450px";      
    this.dom.style.height = "calc(100% - 80px)";  
    this.dom.style.right = "20px";
    this.dom.style.top = "20px";
    this.dom.style.color = "#fff"
    this.dom.style.padding = "20px 20px 20px 20px";
    this.dom.style.borderRadius = "10px";
    this.dom.style.backgroundColor = "#222";
    this.dom.style.opacity = "0.8";    
    
    // Name
    this.NameArea = document.createElement("div");
    this.NameArea.style.width = "100%";
    this.NameArea.textContent = "";
    this.NameArea.style.margin = "0px 0px 10px 0px";
    this.NameArea.style.border = "1px solid #ddd";
    this.NameArea.style.borderStyle = "none none solid none";
    this.NameArea.style.fontSize = "24px";

    // Image And Text
    this.ImageAndTextArea = document.createElement("div");
    this.ImageAndTextArea.style.width = "100%";
    this.ImageAndTextArea.style.overflowY = "scroll";

    // // Image
    // this.imageArea = document.createElement("div");
    // this.imageArea.style.margin = "10px 0px 10px 0px";
    // this.imageArea.style.opacity = "1.0";
    // this.image = new Image();    
    // this.image.onload = function(){
    //     this.image.style.width = "100%"
    //     this.image.style.height = "auto"   
    // }.bind(this)
    // this.imageArea.appendChild( this.image ); 

    // text
    this.textArea = document.createElement("div");
    this.textArea.style.margin = "10px 0px 10px 0px";

    //////////////////////////////////////////////////////////
    // Append
    //////////////////////////////////////////////////////////
    //this.ImageAndTextArea.appendChild(this.imageArea); 
    this.ImageAndTextArea.appendChild(this.textArea);
    this.dom.appendChild(this.NameArea);
    this.dom.appendChild(this.ImageAndTextArea);
    document.body.appendChild(this.dom);
}

PropertyArea.prototype.setName = function( val ){
    this.NameArea.textContent = val;    
}

PropertyArea.prototype.setImage = function( val ){  
    // this.imageFileName = val;
    // if( val == "NoImage.png" ){
    //     this.imageArea.style.display = "none";
    // }else{
    //     this.imageArea.style.display = "block";
    //     this.image.src = "image/" + val;
    // }
}

PropertyArea.prototype.setText = function( val ){
    this.textArea.textContent = val
}

PropertyArea.prototype.show = function( isShow ){
    if( isShow ){
        this.dom.style.display = "flex";
    }else{
        this.dom.style.display = "none";
    }
}