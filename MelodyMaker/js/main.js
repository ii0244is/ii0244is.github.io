
let g_chordEditor;
let g_fileLoader;
let g_fileDownloader;
let g_melodyMaker;
let g_audioPlayer;
let g_controller;
let g_musicScore;

let g_posChord = 0;
let g_numChord = 1;

function appStart()
{
    let editorArea = document.getElementById("ChordProgressionEditorArea");
    let chordEditLabel = document.createElement("div");
    chordEditLabel.textContent = "Chord Progression";
    chordEditLabel.style.fontSize = "28px"; 
    chordEditLabel.style.margin = "0px 0px 4px 0px";
    g_chordEditor = new ChordProgressionEditor();
    editorArea.appendChild( chordEditLabel );
    editorArea.appendChild( g_chordEditor.getDom() );

    let playerArea = document.getElementById("PlayerArea");
    g_controller = new AudioPlayerController();
    playerArea.appendChild( g_controller.getDom() );

    let fileArea = document.getElementById("FileArea");
    g_fileLoader = document.createElement("input");
    g_fileLoader.type = "file";
    g_fileDownloader = new FileDownloader();
    fileArea.appendChild( g_fileLoader );
    fileArea.appendChild( g_fileDownloader.getDom() );

    let scoreArea = document.getElementById("MusicScoreArea");
    g_musicScore = new MusicScore();
    scoreArea.appendChild( g_musicScore.getDom() );

    g_melodyMaker = new MelodyMaker();

    setupEvent();

    if( location.hash )
    {
        let fileName = "sample/" + location.hash.slice(1) + ".json";
        let request = new window.XMLHttpRequest();
        request.open("GET", fileName, true);
        request.onreadystatechange = function(){
            if( request.readyState == 4 )
            {
                let data = JSON.parse( request.responseText );
                loadSetting(data); 
            }
        }
        request.send(null);
    }
}

function setupEvent()
{
    g_fileLoader.onchange = function(event) {
        let file = event.target.files[0];        
        let reader = new FileReader();
        reader.readAsText( file );
        reader.onload = function(e) {
            let data = JSON.parse( reader.result );
            loadSetting(data); 
        }
    }

    g_fileDownloader.onSaveFile = function() {
        let data = {}
        data.chordProgression = g_chordEditor.getChordProgression();
        data.bpm = Number( g_controller.getValue( "BPM" ) );
        data.bassStyle = g_controller.getValue( "BassStyle" );
        data.swing = g_controller.getValue( "Swing" );
        return data;
    }

    g_controller.onplay = function() {
        if( g_audioPlayer != null ) return;

        let chordProgress = g_chordEditor.getChordProgression();
        g_numChord = chordProgress.length;
        g_melodyMaker.setChordProgression( chordProgress );
        let bassStyle = g_controller.getValue( "BassStyle" );
        g_melodyMaker.setBassStyle( bassStyle );
        g_musicScore.setChordProgression( chordProgress );
        g_musicScore.setNumMeasure( g_numChord );   

        g_audioPlayer = new WebAudioPlayer();
        g_audioPlayer.addPart( "melody", 0.3, 0 );
        g_audioPlayer.addPart( "bass", 0.6, -2 );
        let BPM = Number( g_controller.getValue( "BPM" ) );
        g_audioPlayer.setBPM(BPM);
        let isSwing = g_controller.getValue( "Swing" );
        g_audioPlayer.setSwingRhythm(isSwing);
        let mainVol = Number( g_controller.getValue( "MainVolume" ) );
        g_audioPlayer.setVolume( "melody", mainVol);
        let bassVol = Number( g_controller.getValue( "BassVolume" ) );
        g_audioPlayer.setVolume( "bass", bassVol);

        function play()
        {
            if( g_audioPlayer == null ) return;

            let chordNum = g_melodyMaker.getCurrentChordNumber();
            let melodyLine = g_melodyMaker.getMelodyLine();
            let bassLine = g_melodyMaker.getBassLine();

            g_audioPlayer.setMelodyLine( "melody", melodyLine );        
            g_audioPlayer.setMelodyLine( "bass", bassLine );
            g_audioPlayer.play( play );          

            if( chordNum == 0 ){
                g_musicScore.clearScore();
            }
            g_musicScore.draw( chordNum, melodyLine );  

            g_melodyMaker.progress();
        };

        play();        
    }

    g_controller.onstop = function() {
        if( g_audioPlayer == null ) return;        
        g_audioPlayer.stop();
        g_audioPlayer = null;
        g_melodyMaker.clearMelodyLine();
    }    

    g_controller.onBPMChange = function( value ){
        g_audioPlayer.setBPM(Number(value));
    }

    g_controller.onSwingChange = function( value ){
        g_audioPlayer.setSwingRhythm(value);
    }

    g_controller.onBassStyleChange = function( value ){
        g_melodyMaker.setBassStyle( value );
    }

    g_controller.onMainVolumeChange = function( value ){
        g_audioPlayer.setVolume( "melody", Number(value) );
    }    

    g_controller.onBassVolumeChange = function( value ){
        g_audioPlayer.setVolume( "bass", Number(value) );
    }    
}

function loadSetting(data)
{
    console.log(data);    
    
    let chordProgression = data.chordProgression;
    let bpm = data.bpm;
    let bassStyle = data.bassStyle;    
    let isSwing = data.swing;

    g_controller.setValue( "BPM", bpm );
    g_controller.setValue( "BassStyle", bassStyle );
    g_controller.setValue( "Swing", isSwing );
    g_chordEditor.setChordProgression( chordProgression );

    g_numChord = chordProgression.length;
    g_musicScore.setChordProgression( chordProgression );
    g_musicScore.setNumMeasure( g_numChord );    
}