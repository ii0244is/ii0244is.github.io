
let CountryInfoArea = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";  
    this.dom.style.display = "none";
    this.dom.style.flexDirection = "column";
    //this.dom.style.width = "450px";    
    //this.dom.style.width = "30%";       
    //this.dom.style.maxWidth = "450px";      
    //this.dom.style.height = "calc(100% - 80px)";  
    this.dom.style.left = "20px";
    this.dom.style.top = "20px";
    this.dom.style.color = "#fff"
    this.dom.style.padding = "10px 20px 10px 20px";
    this.dom.style.borderRadius = "10px";
    this.dom.style.backgroundColor = "#222";
    this.dom.style.opacity = "0.8";    
    
    // Name
    this.NameArea = document.createElement("div");
    this.NameArea.style.width = "100%";
    this.NameArea.textContent = "";
    this.NameArea.style.margin = "0px 0px 0px 0px";
    //this.NameArea.style.border = "1px solid #ddd";
    //this.NameArea.style.borderStyle = "none none solid none";
    this.NameArea.style.fontSize = "24px";

    this.dom.appendChild(this.NameArea);
    document.body.appendChild(this.dom);
}

CountryInfoArea.prototype.setName = function( val ){
    this.NameArea.textContent = val;    
}

CountryInfoArea.prototype.show = function( isShow ){
    if( isShow ){
        this.dom.style.display = "flex";
    }else{
        this.dom.style.display = "none";
    }
}