
let AudioPlayerController = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.style.justifyContent = "space-between";    
    this.dom.style.alignItems = "center";
    this.dom.style.padding = "60px 40px 20px 40px"

    this.playButton = document.createElement("div");
    this.playButton.classList.add( "AudioPlayerButton" );
    this.playButton.textContent = "PLAY";    
    
    this.stopButton = document.createElement("div");
    this.stopButton.classList.add( "AudioPlayerButton" );
    this.stopButton.textContent = "STOP";    

    this.BPMInput = new AudioPlayerParameter( "BPM", "number" );
    this.BPMInput.paramInput.max = 360;
    this.BPMInput.paramInput.min = 60;
    this.BPMInput.setValue( 180 );
    
    this.BassStyleInput = new AudioPlayerParameter( "Bass Style", "select" );    
    let BassStyleList = [ { label:"4 Beat", value:"4Beat"}, 
                          { label:"Latin", value:"latin" } ];
    for( let i in BassStyleList ){
        let opt = document.createElement("option");
        opt.textContent = BassStyleList[i].label;        
        opt.value = BassStyleList[i].value;
        this.BassStyleInput.paramInput.appendChild( opt );
    }

    this.SwingInput = new AudioPlayerParameter( "Swing", "checkbox" );
    this.SwingInput.setValue( "true" );

    this.MainVolumeInput = new AudioPlayerParameter( "Main Volume", "range" );
    this.MainVolumeInput.paramInput.max = 1.0;   
    this.MainVolumeInput.paramInput.min = 0.0;    
    this.MainVolumeInput.paramInput.step = 0.01;        
    this.MainVolumeInput.setValue( 0.5 );    

    this.BassVolumeInput = new AudioPlayerParameter( "Bass Volume", "range" );
    this.BassVolumeInput.paramInput.max = 1.0;   
    this.BassVolumeInput.paramInput.min = 0.0;   
    this.BassVolumeInput.paramInput.step = 0.01;         
    this.BassVolumeInput.setValue( 0.5 );    

    this.playerArea = document.createElement("div");
    this.playerArea.style.display = "flex";
    this.playerArea.style.flexDirection = "row";
    this.playerArea.style.alignItems = "center";
    this.playerArea.appendChild( this.playButton );
    this.playerArea.appendChild( this.stopButton );

    this.parameterArea1 = document.createElement("div");
    this.parameterArea1.style.display = "flex";
    this.parameterArea1.style.flexDirection = "column";
    this.parameterArea1.appendChild( this.BPMInput.getDom() );
    this.parameterArea1.appendChild( this.BassStyleInput.getDom() );
    this.parameterArea1.appendChild( this.SwingInput.getDom() );

    this.parameterArea2 = document.createElement("div");
    this.parameterArea2.style.display = "flex";
    this.parameterArea2.style.flexDirection = "column";
    this.parameterArea2.appendChild( this.MainVolumeInput.getDom() );
    this.parameterArea2.appendChild( this.BassVolumeInput.getDom() );

    this.dom.appendChild( this.playerArea );    
    this.dom.appendChild( this.parameterArea1 );    
    this.dom.appendChild( this.parameterArea2 );    
    
    this.onplay = null;
    this.playButton.onclick = function(){
        if( this.onplay ){
            this.onplay();
        }
    }.bind(this)

    this.onstop = null;
    this.stopButton.onclick = function(){
        if( this.onstop ){
            this.onstop();
        }
    }.bind(this)

    this.onBPMChange = null;
    this.BPMInput.onchange = function( val ){
        if( this.onBPMChange ){
            this.onBPMChange( val );
        }
    }.bind(this)

    this.onSwingChange = null;
    this.SwingInput.onchange = function( val ){
        if( this.onSwingChange ){
            this.onSwingChange( val );
        }
    }.bind(this)

    this.onBassStyleChange = null;
    this.BassStyleInput.onchange = function( val ){
        if( this.onBassStyleChange ){
            this.onBassStyleChange( val )
        }
    }.bind(this)

    this.onMainVolumeChange = null
    this.MainVolumeInput.onchange = function( val ){
        if( this.onMainVolumeChange ){
            this.onMainVolumeChange( val )
        }
    }.bind(this)

    this.onBassVolumeChange = null
    this.BassVolumeInput.onchange = function( val ){
        if( this.onBassVolumeChange ){
            this.onBassVolumeChange( val )
        }
    }.bind(this)
}

AudioPlayerController.prototype.getDom = function()
{
    return this.dom;
}

AudioPlayerController.prototype.getValue = function( paramName )
{
    let value = "";

    if( paramName == "BPM" ){
        value = this.BPMInput.getValue();
    }else if( paramName == "BassStyle" ){
        value = this.BassStyleInput.getValue();
    }else if( paramName == "Swing" ){
        value = this.SwingInput.getValue();
    }else if( paramName == "MainVolume" ){
        value = this.MainVolumeInput.getValue();
    }else if( paramName == "BassVolume" ){
        value = this.BassVolumeInput.getValue();
    }       

    return value;
}

AudioPlayerController.prototype.setValue = function( paramName, value )
{
    if( paramName == "BPM" ){
        this.BPMInput.setValue( value );
    }else if( paramName == "BassStyle" ){
        this.BassStyleInput.setValue( value );
    }else if( paramName == "Swing" ){
       this.SwingInput.setValue( value );
    }    
}

let AudioPlayerParameter = function( name, type )
{
    this.dom = document.createElement("div");    
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.style.alignItems = "center";
    this.dom.style.padding = "5px 10px 5px 10px"

    this.nameLabel = document.createElement("div");
    this.nameLabel.style.padding = "5px 10px 5px 10px"
    this.nameLabel.style.width = "70px";    
    this.nameLabel.textContent = name;

    this.paramInput = null;
    this.type = type;
    if( type == "select" ){
        this.paramInput = document.createElement("select");
    }else{
        this.paramInput = document.createElement("input");        
        this.paramInput.type = type;
    }
    this.paramInput.style.padding = "8px 2px 8px 2px"

    this.dom.appendChild( this.nameLabel );    
    this.dom.appendChild( this.paramInput );

    this.onchange = null;
    this.paramInput.onchange = function(){
        if( this.onchange ){
            this.onchange( this.getValue() );
        }
    }.bind(this)
}

AudioPlayerParameter.prototype.getDom = function()
{
    return this.dom;
}

AudioPlayerParameter.prototype.getValue = function()
{
    let value;
    if( this.type == "checkbox" ){
        value = this.paramInput.checked;
    }else{
        value = this.paramInput.value;        
    }
    return value;
}

AudioPlayerParameter.prototype.setValue = function( value )
{
    if( this.type == "checkbox" ){
        this.paramInput.checked = value;
    }else{
        this.paramInput.value = value;        
    }
}