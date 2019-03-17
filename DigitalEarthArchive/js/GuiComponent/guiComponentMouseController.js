
guiComponentMouseController = function ( width, height, callback )
{
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext('2d');

    this.canvas.width = width;
    this.canvas.height = height;

    this.mousePosX = 0;
    this.mousePosY = 0;
    this.mouseDrag = false;
    this.touch = false;
    this.callback = callback;

    this.canvas.addEventListener("mousedown", function ( event )
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        this.mousePosX = x;
        this.mousePosY = y;
        this.mouseDrag = true;
    }.bind(this) );

    this.canvas.addEventListener("mouseup", function (event)
    {
        this.mouseDrag = false;
    }.bind(this));

    this.canvas.addEventListener("mouseout", function (event)
    {
        this.mouseDrag = false;
    }.bind(this) );

    this.canvas.addEventListener("mousemove", function (event)
    {
        if (this.mouseDrag)
        { 
            let x = event.offsetX || event.layerX;
            let y = event.offsetY || event.layerY;

            let diffX = x - this.mousePosX;
            let diffY = y - this.mousePosY;

            callback( diffX, diffY );

            this.mousePosX = x;
            this.mousePosY = y;
        }
    }.bind(this) );

    this.canvas.addEventListener("touchstart", function (event)
    {
        event.preventDefault();
        this.mousePosX = event.touches[0].screenX;
        this.mousePosY = event.touches[0].screenY;
        this.touch = true;
    }.bind(this) );

    this.canvas.addEventListener("touchmove", function (event)
    {
        event.preventDefault();
        if (this.touch)
        {
            let x = event.touches[0].screenX;
            let y = event.touches[0].screenY;

            let diffX = x - this.mousePosX;
            let diffY = y - this.mousePosY;

            callback(diffX, diffY);

            this.mousePosX = x;
            this.mousePosY = y;
        }
    }.bind(this) );

    this.canvas.addEventListener("touchend", function (evt)
    {
        event.preventDefault();
        this.touch = false;
    }.bind(this) );

    this.draw();
}

guiComponentMouseController.prototype.getDom = function()
{
    return this.canvas;
}

guiComponentMouseController.prototype.setSize = function( width, height )
{
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
}

guiComponentMouseController.prototype.draw = function()
{
    let ctx = this.context;
    ctx.fillStyle = 'rgb(220, 220, 220)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.beginPath();
    ctx.moveTo(this.canvas.width * 0.1, this.canvas.height * 0.5);
    ctx.lineTo(this.canvas.width * 0.9, this.canvas.height * 0.5);
    ctx.moveTo(this.canvas.width * 0.5, this.canvas.height * 0.2);
    ctx.lineTo(this.canvas.width * 0.5, this.canvas.height * 0.8);
    ctx.closePath();
    ctx.stroke();
}