
let CountryListArea = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";  
    this.dom.style.display = "none";
    this.dom.style.flexDirection = "column";
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
    
    //////////////////////////////////////////////////////////
    // List 
    //////////////////////////////////////////////////////////
    this.listArea = document.createElement("div");
    this.listArea.style.width = "100%";
    this.listArea.style.overflowY = "scroll";

    //////////////////////////////////////////////////////////
    // Append
    //////////////////////////////////////////////////////////
    this.dom.appendChild(this.listArea);
    document.body.appendChild(this.dom);
}

CountryListArea.prototype.setCountryList = function( list ){
    this.clearData();

    for( let i in list ){
        let listItem = document.createElement("div");
        listItem.style.display = "flex";
        listItem.style.flexDirection = "row";
        listItem.style.justifyContent = "space-between";
        listItem.style.alignItems = "center";
        listItem.style.margin = "0px 0px 12px 0px";

        let countryName = document.createElement("div");
        countryName.textContent = list[i].name;
        countryName.style.padding = "3px 0px 3px 0px";

        let goButton = document.createElement("div");
        goButton.textContent = "Go!!";
        goButton.style.cursor = "pointer"
        goButton.style.backgroundColor = "#33f";
        goButton.style.color = "#fff";
        goButton.style.padding = "3px 20px 3px 20px";
        goButton.style.borderRadius = "5px";      
        goButton.onclick = function(){
            if( this.onclick ){
                let pos = list[i].position;
                let objName =  list[i].objName;
                this.onclick(pos, objName);
            }
        }.bind(this)

        listItem.appendChild( countryName );
        listItem.appendChild( goButton );
        this.listArea.appendChild( listItem );
    }
}

CountryListArea.prototype.show = function( isShow ){
    if( isShow ){
        this.dom.style.display = "flex";
    }else{
        this.dom.style.display = "none";
    }
}

CountryListArea.prototype.clearData = function(){
    while( this.listArea.lastChild ){
        this.listArea.removeChild( this.listArea.lastChild );
    }
}
