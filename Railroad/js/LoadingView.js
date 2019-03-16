
let LoadingView = function()
{
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.left = "0px";
    this.dom.style.top = "0px";  
    this.dom.style.opacity = "0.8";      
    this.dom.style.color = "#eee";
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.style.alignItems = "center"; 
    this.dom.style.backgroundColor = "#444"

    this.loadingArea = document.createElement("div");
    this.loadingArea.style.display = "flex";
    this.loadingArea.style.flexDirection = "row";
    this.loadingArea.style.justifyContent = "center";
    this.loadingArea.style.width = "100%";

    this.loading = document.createElement("div");  
    this.loading.style.display = "flex";
    this.loading.style.flexDirection = "column";

    this.text = document.createElement("div");
    this.text.textContent = "Now Loading ... 0%";
    this.text.style.fontSize = "56px";

    this.loading.appendChild(this.text);
    this.loadingArea.appendChild(this.loading); 
    this.dom.appendChild(this.loadingArea);

    document.body.appendChild(this.dom);
}

LoadingView.prototype.show = function( bShow )
{
    if( bShow ){
        this.dom.style.display = "flex";
    }else{
        this.dom.style.display = "none";        
    }
}

LoadingView.prototype.setProgressRate = function( val )
{
    this.text.textContent = "Now Loading ... " +  Math.floor( val ) + "%";
}