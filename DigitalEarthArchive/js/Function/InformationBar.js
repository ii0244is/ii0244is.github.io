
let InformationBar = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.width = "200px";
    this.dom.style.borderRadius = "10px"
    this.dom.style.backgroundColor = "#eee";
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.padding = "10px 10px 10px 10px";
    this.dom.style.opacity = "0.6";

    this.borderCheckboxArea = document.createElement("div");
    this.borderCheckboxArea.style.display = "flex";
    this.borderCheckboxArea.style.flexDirection = "row";     
    this.borderCheckboxText = document.createElement("div");    
    this.borderCheckboxText.textContent = "show national border"
    this.borderCheckboxText.style.padding = "0px 10px 0px 0px";
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
    this.currentPositionArea.style.flexDirection = "row"; 
    this.currentPositionArea.style.display = "none";
    this.currentPositionText = document.createElement("div");
    this.currentPositionArea.appendChild(this.currentPositionText);
    this.dom.appendChild(this.currentPositionArea);
    
    document.body.appendChild( this.dom );    
}

InformationBar.prototype.getWidth = function ()
{
    let rect = this.dom.getBoundingClientRect();
    return rect.width;
}

InformationBar.prototype.getHeight = function ()
{
    let rect = this.dom.getBoundingClientRect();
    return rect.height;
}

InformationBar.prototype.setPosition = function( x, y )
{
    this.dom.style.right = x;
    this.dom.style.top = y; 
}

InformationBar.prototype.showNationalBorder = function( show )
{
    this.borderCheckbox.checked = show;
}

InformationBar.prototype.showCurrentPosition = function( show )
{
    if( show ){
        this.currentPositionArea.style.display = "flex";
    }else{
        this.currentPositionArea.style.display = "none";
    }
}

InformationBar.prototype.setCurrentPosition = function( lon, lat )
{
    let longitude = lon.toFixed( 7 );
    let latitude  = lat.toFixed( 7 );
    this.currentPositionText.innerHTML = "lon : " + longitude + "<br>lat : " + latitude;
}
