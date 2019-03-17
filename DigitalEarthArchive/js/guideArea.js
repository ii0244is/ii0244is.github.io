
let guideArea = function ()
{
    // DOM 生成
    this.dom = document.createElement("div");
    this.dom.classList.add("guideArea");
    
    this.borderCheckboxArea = document.createElement("div");
    this.borderCheckboxText = document.createElement("div");    
    this.borderCheckboxText.textContent = "Show National Border"
    this.borderCheckboxText.style.padding = "0px 10px 0px 0px";
    this.borderCheckboxArea.classList.add("borderCheckboxArea");
    this.borderCheckbox = document.createElement("input");    
    this.borderCheckbox.type = "checkbox";
    this.borderCheckbox.checked = true;
    this.borderCheckbox.onchange = function(){
        let isShown = this.borderCheckbox.checked;
        g_webGLView.getGLObject("worldBorder").setVisible( isShown );
    }.bind(this);
    this.borderCheckboxArea.appendChild(this.borderCheckboxText);
    this.borderCheckboxArea.appendChild(this.borderCheckbox);
    this.dom.appendChild(this.borderCheckboxArea);

    this.currentPositionArea = document.createElement("div");
    this.currentPositionArea.classList.add("currentPositionArea");
    this.currentPositionArea.style.display = "none";
    this.currentPositionText = document.createElement("div");
    this.currentPositionArea.appendChild(this.currentPositionText);
    this.dom.appendChild(this.currentPositionArea);
    
    document.body.appendChild( this.dom );    
}

guideArea.prototype.getWidth = function ()
{
    let rect = this.dom.getBoundingClientRect();
    return rect.width;
}

guideArea.prototype.getHeight = function ()
{
    let rect = this.dom.getBoundingClientRect();
    return rect.height;
}

guideArea.prototype.setPosition = function( x, y )
{
    this.dom.style.left = x;
    this.dom.style.top = y; 
}

guideArea.prototype.showNationalBorder = function( show )
{
    this.borderCheckbox.checked = show;
}

guideArea.prototype.showCurrentPosition = function( show )
{
    if( show ){
        this.currentPositionArea.style.display = "flex";
    }else{
        this.currentPositionArea.style.display = "none";
    }
}

guideArea.prototype.setCurrentPosition = function( x, y )
{
    this.currentPositionText.innerHTML = "lon : " + x + "<br>lat : " + y;
}
