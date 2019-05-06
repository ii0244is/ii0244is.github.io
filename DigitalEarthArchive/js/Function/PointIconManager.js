

PointIconManager = function ()
{
    this.iconList = [
        { name:"pointerRed", url:"image/pointerRed.png" },
        { name:"pointerGreen", url:"image/pointerGreen.png" },
        { name:"pointerBlue", url:"image/pointerBlue.png" },
        { name:"pointerYellow", url:"image/pointerYellow.png" },
        { name:"pointerWhite", url:"image/pointerWhite.png" },
        { name:"pointerBlack", url:"image/pointerBlack.png" },
        { name:"test1", url:"image/textureTest1.png" },
        { name:"test2", url:"image/textureTest2.png" },
        { name:"test3", url:"image/textureTest3.png" },
    ]

    this.callback = null;
    this.selectedIconName = null;

    // create point icon texture
    for( let i = 0; i < this.iconList.length; ++i )
    {
        g_webGLView.createTexture( this.iconList[i].name, this.iconList[i].url );
    }

    // create point icon selector gui
    this.iconSelector = document.createElement("div");
    this.iconDomList = {};
    for( let i = 0; i < this.iconList.length; ++i )
    {
        let imgIcon = document.createElement("img");
        imgIcon.style.width = "30px";
        imgIcon.style.height = "30px"; 
        imgIcon.style.margin = "2px 2px 2px 2px";   
        imgIcon.style.opacity = "0.3"; 
        imgIcon.src = this.iconList[i].url;
        imgIcon.onclick = function(){
            this.setIcon(this.iconList[i].name);
            if(this.callback) this.callback(this.iconList[i].name);
        }.bind(this, i)
        this.iconSelector.appendChild(imgIcon);
        this.iconDomList[this.iconList[i].name] = imgIcon;
    }    
}

PointIconManager.prototype.getIconSelectorDom = function ()
{
    return this.iconSelector;
}

PointIconManager.prototype.setIcon = function (name)
{
    if( this.selectedIconName )
    {
        this.iconDomList[this.selectedIconName].style.opacity = "0.3";
    }
    this.iconDomList[name].style.opacity = "1.0";
    this.selectedIconName = name;
}

PointIconManager.prototype.getSelectedIcon = function ()
{
    return this.selectedIconName;
}

PointIconManager.prototype.setIconChangeCallback = function (callback)
{
    this.callback = callback;
}
