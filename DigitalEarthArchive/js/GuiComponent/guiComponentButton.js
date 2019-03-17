
guiComponentButton = function ( text, width, height, callback )
{
    this.dom = document.createElement("div");
    this.dom.textContent  = text;
    this.dom.style.width  = width;
    this.dom.style.height = height;
    this.callback         = callback;

    this.dom.style.color           = "#333";
    this.dom.style.backgroundColor = "#ccc";
    this.dom.style.borderRadius    = "2px"; 
    this.dom.style.border = "4px double #5F5F5F";
    this.dom.style.paddingLeft     = "20px";

    this.dom.addEventListener("mousedown", function ( event )
    {
        this.dom.style.color = "#222";
        this.dom.style.backgroundColor = "#999";
    }.bind(this) );

    this.dom.addEventListener("mouseup", function (event)
    {
        this.dom.style.color = "#666";
        this.dom.style.backgroundColor = "#eee";
        this.callback();
    }.bind(this));

    this.dom.addEventListener("mouseout", function (event)
    {
        this.dom.style.color = "#333";
        this.dom.style.backgroundColor = "#ccc";
    }.bind(this));

    this.dom.addEventListener("mousemove", function (event)
    {
        this.dom.style.color = "#666";
        this.dom.style.backgroundColor = "#eee";
    }.bind(this) );
}

guiComponentButton.prototype.getDom = function()
{
    return this.dom;
}
