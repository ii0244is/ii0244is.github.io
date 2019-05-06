
let NewDataArea = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.height = "calc( 100% - 20px )";
    this.dom.style.flexDirection = "column";
    this.dom.style.padding = "10px 10px 10px 10px";
    this.dom.style.backgroundColor = "rgb( 10, 155, 148 )";

    let newBarGraphButton = document.createElement("img");
    newBarGraphButton.src = "image/addBarGraph.png";
    newBarGraphButton.classList.add("newDataButton");
    newBarGraphButton.onclick = function(){
        g_newDataManager.start( "BarGraph" );
    }
    this.dom.appendChild( newBarGraphButton );

    let newArcButton = document.createElement("img");
    newArcButton.src = "image/addArc.png";
    newArcButton.classList.add("newDataButton");
    newArcButton.onclick = function(){
        g_newDataManager.start( "Arc" );
    }
    this.dom.appendChild( newArcButton );

    let newPointButton = document.createElement("img");
    newPointButton.src = "image/addPoint.png";
    newPointButton.classList.add("newDataButton");
    newPointButton.onclick = function(){
        g_newDataManager.start( "Point" );
    }
    this.dom.appendChild( newPointButton );

    let newLineButton = document.createElement("img");
    newLineButton.src = "image/addLine.png";
    newLineButton.classList.add("newDataButton");
    newLineButton.onclick = function(){
        g_newDataManager.start( "Line" );
    }
    this.dom.appendChild( newLineButton );

    let newPolygonButton = document.createElement("img");
    newPolygonButton.src = "image/addPolygon.png";
    newPolygonButton.classList.add("newDataButton");
    newPolygonButton.onclick = function(){
        g_newDataManager.start( "Polygon" );
    }
    this.dom.appendChild( newPolygonButton );    
}

NewDataArea.prototype.getDom = function()
{
    return this.dom;
}

NewDataArea.prototype.setBackgroundColor = function( r, g, b )
{
    let bgColor = "rgb(" + r + "," + g + "," + b + ")";
    this.dom.style.backgroundColor = bgColor;
}