
let NOTE_NONE = -100;    
let NOTE_REST = -100;   
let NOTE_C_0  = 0;
let NOTE_Db_0 = 1;
let NOTE_D_0  = 2;
let NOTE_Eb_0 = 3;
let NOTE_E_0  = 4;
let NOTE_F_0  = 5;
let NOTE_Gb_0 = 6;
let NOTE_G_0  = 7;
let NOTE_Ab_0 = 8;
let NOTE_A_0  = 9;
let NOTE_Bb_0 = 10;
let NOTE_B_0  = 11;
let NOTE_C_1  = 12;
let NOTE_Db_1 = 13;
let NOTE_D_1  = 14;
let NOTE_Eb_1 = 15;
let NOTE_E_1  = 16;
let NOTE_F_1  = 17;
let NOTE_Gb_1 = 18;
let NOTE_G_1  = 19;
let NOTE_Ab_1 = 20;
let NOTE_A_1  = 21;
let NOTE_Bb_1 = 22;
let NOTE_B_1  = 23;
let NOTE_C_2  = 24;    
let NOTE_Db_2 = 25;
let NOTE_D_2  = 26;

let WebAudioPlayer = function()
{
    this.audioCtx = null;
    this.bpm = 120;
    this.isPlaying = false;
    this.soundOff = false;
    this.notes = [];
    this.count = 0;
    this.parts = {};
    this.isSwinging = true;
}

WebAudioPlayer.prototype.addPart = function( name, volume, octave )
{
    try {
        if( this.audioCtx == null ){
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
    }catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

    let part = {}
    part.osc  = this.audioCtx.createOscillator();
    part.gain = this.audioCtx.createGain();
    part.osc.type = 'triangle' // sine, square, sawtooth, triangle 
    part.mute = false;  
    part.volume = volume;
    part.octave = octave; 
    part.notes = [];  

    this.parts[ name ] = part;
    this.parts[ name ].osc.connect(this.parts[ name ].gain);
    this.parts[ name ].gain.connect(this.audioCtx.destination);    
    this.parts[ name ].osc.start(0);
}

WebAudioPlayer.prototype.setBPM = function( bpm )
{
    this.bpm = bpm;
}

WebAudioPlayer.prototype.setSwingRhythm = function( isSwinging )
{
    this.isSwinging = isSwinging;
}

WebAudioPlayer.prototype.setVolume = function( name, volume )
{
    this.parts[ name ].volume = volume;
}

WebAudioPlayer.prototype.setMelodyLine = function( name, notes )
{
    this.parts[ name ].notes = notes;
}

WebAudioPlayer.prototype.play = function( callbackFunc )
{
    if( this.isPlaying ) return;

    let interval = 60000 / this.bpm / 2;
    let currentTime = this.audioCtx.currentTime;
    let timeConst = 0.01;

    if( this.count >= 8 ){
        if( callbackFunc ){
            this.count = 0;
            callbackFunc();            
        }
        return;
    }

    for( let name in this.parts )
    {
        let part = this.parts[ name ];
        let note = part.notes[ this.count ];
        
        if( part.mute || note == NOTE_REST || this.soundOff ){
            part.gain.gain.setTargetAtTime( 0.0, currentTime, timeConst );
        }else{
            part.gain.gain.setTargetAtTime( part.volume, currentTime, timeConst );
        }

        let octaveFactor = 1;
        if( part.octave == -2 ){
            octaveFactor *= 0.25;
        }else if( part.octave == -1 ){
            octaveFactor *= 0.5;
        }else if( part.octave == 1 ){
            octaveFactor *= 2;
        }
        let freq = this.noteToFreq(note) * octaveFactor;

        part.osc.frequency.setTargetAtTime( freq, currentTime, timeConst);
    }

    if( this.soundOff ){
        this.soundOff = false;
        setTimeout( this.play.bind(this), interval / 4, callbackFunc );
        ++this.count;
    }else{
        this.soundOff = true;
        let time = interval * 3 / 4
        if( this.isSwinging ){
            if( this.count % 2 == 0 ){
                time *= 4 / 3;
            }else{
                time *= 2 / 3;
            }
        }
        setTimeout( this.play.bind(this), time, callbackFunc );
    }
}

WebAudioPlayer.prototype.pause = function()
{
    
}

WebAudioPlayer.prototype.stop = function()
{
    for( let name in this.parts ){
        let part = this.parts[ name ];
        part.osc.stop();
    }        
}

WebAudioPlayer.prototype.noteToFreq = function( note )
{
    return 261 * Math.pow( 2, note / 12 );
}
