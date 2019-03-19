
let TimeSelector = function( parentDom )
{
    this.parentDom = parentDom;
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";  
    this.dom.style.display = "flex";
    this.dom.style.alignItems = "center";
    this.dom.style.height = "100px"

    this.previousButton = document.createElement("img");
    this.previousButton.src = "icon/previous.png";
    this.previousButton.style.cursor = "pointer"
    this.previousButton.height = 48;
    
    this.selectedItem = document.createElement("div");
    this.selectedItem.style.color = "#fff";  
    this.selectedItem.style.margin = "10px 10px"; 
    this.selectedItem.style.textAlign = "center";
    this.selectedItem.style.width = "320px";
    this.selectedItem.style.fontSize = "72px";
    this.selectedItem.textContent = ""; 
    this.selectedItem.style.cursor = "pointer"    

    this.nextButton = document.createElement("img");    
    this.nextButton.src =  "icon/next.png";
    this.nextButton.style.cursor = "pointer"    
    this.nextButton.height = 48;
    
    this.dom.appendChild(this.previousButton);
    this.dom.appendChild(this.selectedItem); 
    this.dom.appendChild(this.nextButton);
    this.parentDom.appendChild(this.dom);

    this.currentIndex = 0;
    this.itemList = [];
    this.onchange = null;

    this.previousButton.onclick = function(){
        let temp = this.currentIndex - 1;
        if( 0 <= temp ){
            this.currentIndex = temp;
        }
        this.update();
        if( this.onchange ) this.onchange( this.currentIndex )
    }.bind(this)

    this.selectedItem.onclick = function(){
        if( this.onclick ) this.onclick( this.currentIndex )
    }.bind(this)

    this.nextButton.onclick = function(){
        let temp = this.currentIndex + 1;
        if( temp < this.itemList.length ){
            this.currentIndex = temp;
        }
        this.update();
        if( this.onchange ) this.onchange( this.currentIndex )
    }.bind(this)

    this.previousButton.onmousemove = function(){
        this.previousButton.style.opacity = "0.7";
    }.bind(this)    
    this.previousButton.onmouseleave = function(){
        this.previousButton.style.opacity = "1.0";
    }.bind(this)   

    this.nextButton.onmousemove = function(){
        this.nextButton.style.opacity = "0.7";
    }.bind(this)    
    this.nextButton.onmouseleave = function(){
        this.nextButton.style.opacity = "1.0";
    }.bind(this)       
}

TimeSelector.prototype.setPosition = function( align, x, y ){
    if( align == "LeftTop" ){
        this.dom.style.left = x;
        this.dom.style.top = y;
    }else if( align == "RightTop" ){
        this.dom.style.right = x;
        this.dom.style.top = y;
    }else if( align == "LeftBottom" ){
        this.dom.style.left = x;
        this.dom.style.bottom = y;
    }else if( align == "RightBottom" ){
        this.dom.style.right = x;
        this.dom.style.bottom = y;
    }
}

TimeSelector.prototype.setItems = function( items ){
    this.itemList = [];
    for( let i in items ){
        this.itemList.push( items[i] );
    }    
    this.currentIndex = 0;
    this.update();
}

TimeSelector.prototype.update = function(){
    this.selectedItem.textContent = this.itemList[ this.currentIndex ];
}    