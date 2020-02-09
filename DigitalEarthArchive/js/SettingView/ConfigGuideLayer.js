
let ConfigGuideLayer = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex"; 
    this.dom.style.flexDirection = "column"; 
    this.dom.style.padding = "0px 0px 0px 10px"; 

    let addParam = function( name, input ){       
        let row = document.createElement("div");
        row.style.display = "flex"; 
        row.style.flexDirection = "row"; 
        row.style.alignItems = "center";
        row.style.margin = "0px 0px 0px 0px";        
        let label = document.createElement("div");
        label.textContent = name;
        label.style.width = "100px";
        label.style.margin = "0px 0px 0px 0px";
        row.appendChild(label);
        row.appendChild(input);
        this.dom.appendChild(row);
    }.bind(this);

    this.showGuideLayer = document.createElement("input");
    this.showGuideLayer.type = "checkbox"; 
    this.showGuideLayer.style.height = "20px"; 
    this.showGuideLayer.style.margin = "10px 0px 10px 0px";  
    addParam( "On / Off", this.showGuideLayer );

    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    addParam( "File", this.fileInput );

    this.position = new PositionInput();
    this.position.getDom().style.width = "calc( 100% - 130px )";
    this.position.setValue( "longitude", 0 );
    this.position.setValue( "latitude", 0 );
    addParam( "Position", this.position.getDom() );

    this.guideLayerParam = new ParametersInput();
    this.guideLayerParam.getDom().style.width = "calc( 100% - 130px )";
    this.guideLayerParam.addParamInput( "ScaleX" , "number" );
    this.guideLayerParam.setValueRange( "ScaleX", 0, 1000, -2 );
    this.guideLayerParam.setScale( "ScaleX", 0.02 );
    this.guideLayerParam.addParamInput( "ScaleY", "number" );
    this.guideLayerParam.setValueRange( "ScaleY", 0, 1000, -2 );  
    this.guideLayerParam.setScale( "ScaleY", 0.02 );
    this.guideLayerParam.addParamInput( "Rotate", "number" );
    this.guideLayerParam.setValueRange( "Rotate", 0, 360, -1 );  
    this.guideLayerParam.setScale( "Rotate", 0.1 );    
    this.guideLayerParam.setValue( "ScaleX", 1.0 );
    this.guideLayerParam.setValue( "ScaleY", 1.0 );
    this.guideLayerParam.setValue( "Rotate", 0.0 );
    addParam( "Transform", this.guideLayerParam.getDom() );

    this.guideLayerObj = new glObjectGuideLayer(g_webGLView);
    this.guideLayerObj.setPosition( [ 0.0, -0.01, 0.0 ] );
    this.guideLayerObj.setScale( [ 2.5, 1.0, 2.5 ] );
    this.guideLayerObj.setSelect( false );    
    this.guideLayerObj.setVisible( false );
    this.guideLayerObj.attachShader("image");
    g_webGLView.addGLObject("guideLayer", this.guideLayerObj); 

    this.showGuideLayer.onchange = function(){
        let show = this.showGuideLayer.checked;
        this.guideLayerObj.setVisible( show );
    }.bind(this);

    this.fileInput.onchange = function(e){
        if ( !e.target.files[0] ) return;
        let reader = new FileReader();    
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function (){
            let url = reader.result;
            this.guideLayerObj.setImage(g_webGLView.context, url, function(){});
        }.bind(this);        
    }.bind(this);

    this.position.onchange = function( value ) {
        let x = value.longitude;
        let z = -value.latitude;
        this.guideLayerObj.setPosition( [ x, -0.01, z ] );
    }.bind(this);

    this.guideLayerParam.onchange = function( value ){
        let x = Number( value.ScaleX ) * 2.5;
        let z = Number( value.ScaleY ) * 2.5;
        let r = Number( value.Rotate );
        this.guideLayerObj.setScale( [ x, 1.0, z ] );
        this.guideLayerObj.setRotation( r * 3.141592 / 180 );
    }.bind(this);
}

ConfigGuideLayer.prototype.getDom = function()
{
    return this.dom;
}

ConfigGuideLayer.prototype.resize = function()
{
    this.position.resize();
    this.guideLayerParam.resize();
}

ConfigGuideLayer.prototype.show = function( isShow )
{
    if( isShow ){
        this.dom.style.display = "flex";
        this.resize();
    }else{
        this.dom.style.display = "none";
    }
}
