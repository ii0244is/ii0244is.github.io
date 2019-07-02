
let g_webGLView;
let g_textureSetting;
let g_time = 0;
let g_objList = {
    floor : {
        position : [0.0, 0.0, 0.0], scale : [3.2, 1.0, 2.5], 
        rotation : [0.0, 0.0, 0.0], url : "image/Floor2.jpg", 
    },
    wall1 : {
        position : [0.0, 1.0, -1.25], scale : [3.2, 2.0, 1.0], 
        rotation : [90, 0, 0], url : "image/Wall.jpg", 
    },
    wall2 : {
        position : [-1.6, 1.0, 0.0], scale : [1.0, 2.0, 2.5], 
        rotation : [0, 0, 90], url : "image/Wall.jpg", 
    },
    wall3 : {
        position : [1.6, 1.0, 0.0], scale : [1.0, 2.0, 2.5], 
        rotation : [0, 0, 90], url : "image/BlueWall.png", 
    },
    curtain : {
        position : [0.0, 0.9, -1.24], scale : [1.8, 1.6, 1.0], 
        rotation : [90, 0, 0], url : "image/Curtain.jpg", 
    },
    rug : {
        position : [0.0, 0.01, 0.0], scale : [2.0, 1.0, 2.0], 
        rotation : [0.0, 0.0, 0.0], url : "image/Rug.png", 
    },    
};

function appStart()
{
    g_webGLView = new WebGLCanvas();
    createGLShaderProgram();
    createGui();
    createObjects();
    setUpEvent();
    mainLoop();
}

function createGLShaderProgram()
{
    g_webGLView.createShaderProgram( "objectMap", "vertexShaderObjectMap", "fragmentShaderObjectMap" );
    g_webGLView.createShaderProgram( "image", "vertexShaderImage", "fragmentShaderImage" );
}

function createGui()
{
    let webGLCanvas = document.getElementById("WebGLCanvas");
    webGLCanvas.appendChild( g_webGLView.getDom() );

    g_textureSetting = new TextureSetting();
    let TextureSettingArea = document.getElementById("TextureSetting");
    TextureSettingArea.appendChild( g_textureSetting.getDom() );
}

function createObjects()
{
    let dummy = new glObjectPlane(g_webGLView);
    dummy.setImage(g_webGLView.context, "image/Floor.jpg", function(){});
    dummy.setPosition( [ 0.0, 0.0, 0.0 ] );
    dummy.setScale( [ 0, 0, 0 ] );
    dummy.setSelect( false );    
    dummy.setVisible( false );
    dummy.setBillboardMode( false );    
    dummy.attachShader("image");
    g_webGLView.addGLObject("dummy", dummy);    

    for( let objName in g_objList ){
        let obj = new glObjectPlane(g_webGLView);
        obj.setImage(g_webGLView.context,  g_objList[objName].url, function(){});
        obj.setPosition( g_objList[objName].position );
        obj.setScale( g_objList[objName].scale );
        obj.setRotation( g_objList[objName].rotation );
        obj.setSelect( false );    
        obj.setVisible( true );
        obj.setBillboardMode( false );    
        obj.attachShader("image");
        g_webGLView.addGLObject(objName, obj);
    }
}

function setUpEvent()
{
    function resizeEvent (){
        g_webGLView.resize();
    }    
    window.addEventListener("resize", resizeEvent );

    g_webGLView.setMouseDownCallback( function( x, y, name, isTouch, buttonType )
    {
        for( let i in g_objList ){
            let o = g_webGLView.getGLObject( i );
            o.setSelect(false);       
        }

        if( name != null ){
            let o = g_webGLView.getGLObject( name );
            o.setSelect(true);  
        }

        let param = {}
        param.name = name;
        g_textureSetting.setParam(param);
    } );

    g_textureSetting.onFileChange = function( name, url ){
        let o = g_webGLView.getGLObject( name );
        o.setImage(g_webGLView.context, url, function(){});
    }

    g_textureSetting.onRotateImage = function( name, url ){
        let o = g_webGLView.getGLObject( name );
        o.rotateTexture();
    }

    resizeEvent();
}

function mainLoop()
{
    g_webGLView.draw(g_time);
    g_time += 15;
    setTimeout(mainLoop, 15);
}