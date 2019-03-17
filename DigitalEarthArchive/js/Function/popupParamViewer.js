

let popupParamViewer = function()
{
    // パラメータ
    this.isShown = false;

    // DOM 生成
    this.createGui();
}

popupParamViewer.prototype.show = function( posX, posY )
{
    document.body.appendChild( this.dom );
    this.setPosition( posX, posY );
    this.isShown = true;
}

popupParamViewer.prototype.hide = function()
{
    if( this.isShown )
    {    
        document.body.removeChild( this.dom );
        this.isShown = false;
    }
}

popupParamViewer.prototype.setPosition = function( x, y )
{
    let rect = this.dom.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    let posX = x + 30;
    let posY = y + 60;
    if( width + posX > g_webGLView.getWidth() ){
        posX = x - ( 20 + width );
    }

    if( height + posY > g_webGLView.getHeight() ){

        let diff = height + posY - g_webGLView.getHeight()
        posY = y + 80 - diff;
    }
    this.dom.style.left = posX;
    this.dom.style.top = posY;    
}

popupParamViewer.prototype.setSize = function( width, height )
{
    this.dom.style.width = width + "px";
    // this.dom.style.height = height + "px";
}

popupParamViewer.prototype.setParam = function( data )
{
    this.nameArea.textContent = data.name;
    this.valueArea.textContent = data.value;
}

popupParamViewer.prototype.setChangeCallBack = function( callback )
{
    this.callback = callback;
}


/////////////////////////////////////////////////////////////
// ローカル関数（この先の関数はユーザーは使っちゃダメ）
/////////////////////////////////////////////////////////////

popupParamViewer.prototype.createGui = function()
{
    // DOM 生成
    this.dom = document.createElement("div");
    this.dom.classList.add("popupParamViewer");
    this.nameArea = document.createElement("div");
    this.nameArea.style.margin = "5px 0px 5px 0px";
    this.valueArea = document.createElement("div");
    this.valueArea.style.margin = "5px 0px 5px 0px";
    this.dom.appendChild(this.nameArea);
    this.dom.appendChild(this.valueArea);    
}
