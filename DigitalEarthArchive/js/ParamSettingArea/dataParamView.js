
dataParamView = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";    
    this.dom.style.overflowY = "auto";

    this.dataName = document.createElement("div");
    this.dataValue = document.createElement("div");
    this.dataMemo = document.createElement("div");

    this.table = new guiComponentTable();
    this.table.addRow( "Name", this.dataName );
    this.table.addRow( "Value", this.dataValue );
    this.table.addRow( "Memo", this.dataMemo );
    this.dom.appendChild( this.table.getDom() );
}

dataParamView.prototype.getDom = function ()
{
    return this.dom;
}

dataParamView.prototype.setParam = function ( name )
{
    let data = g_dataList[name];
    this.dataName.textContent = data.name;
    this.dataValue.textContent = data.value;
    this.dataMemo.textContent = data.memo;
}
