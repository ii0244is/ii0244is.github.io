let KeywordFilter = function()
{
    this.dom = document.createElement("div");
    this.dom.textContent = "KeywordFilter"
}

KeywordFilter.prototype.getDom = function()
{
    return this.dom;
}

KeywordFilter.prototype.resize = function()
{
}

KeywordFilter.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}