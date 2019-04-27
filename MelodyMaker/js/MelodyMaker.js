
let MelodyMaker = function()
{
    this.currentChord = 0;
    this.chordProgression = [];
    this.chordInfoArray = [];
    this.melodyLineArray = [];
    this.bassStyle = "4beat";
}

MelodyMaker.prototype.progress = function(){
    ++this.currentChord;
    if( this.currentChord >= this.chordProgression.length ){
        this.currentChord = 0;
    }
}    

MelodyMaker.prototype.getCurrentChordNumber = function(){
    return this.currentChord;
}    

MelodyMaker.prototype.setBassStyle = function( style ){
    this.bassStyle = style;
}    

MelodyMaker.prototype.setChordProgression = function( chordProgression ){
    this.chordProgression = JSON.parse(JSON.stringify(chordProgression))
    this.currentChord = 0;
    this.chordInfoArray = [];

    let NoteList = {
        "C"  : NOTE_C_0,
        "D♭" : NOTE_Db_0,
        "D"  : NOTE_D_0,
        "E♭" : NOTE_Eb_0,
        "E"  : NOTE_E_0,
        "F"  : NOTE_F_0,
        "G♭" : NOTE_Gb_0,
        "G"  : NOTE_G_0,
        "A♭" : NOTE_Ab_0,
        "A"  : NOTE_A_0,
        "B♭" : NOTE_Bb_0,
        "B"  : NOTE_B_0,
    }

    let ThirdNoteInterval = {
        "minor" : 3,
        "major" : 4, 
        "sus4"  : 5,
    }

    let FifthNoteInterval = {
        "-5" : 6,
        "5"  : 7, 
        "+5" : 8,
    }

    let SeventhNoteInterval = {
        "none"   : 0,
        "7"      : 10, 
        "major7" : 11,
    }

    let ScaleNoteInterval = {
        "Ionian"         : [ 0, 2, 4, 5, 7, 9, 11 ], 
        "Dorian"         : [ 0, 2, 3, 5, 7, 9, 10 ], 
        "Phrygian"       : [ 0, 1, 3, 5, 7, 8, 10 ], 
        "Lydian"         : [ 0, 2, 4, 6, 7, 9, 11 ], 
        "Mixolydian"     : [ 0, 2, 4, 5, 7, 9, 10 ], 
        "Aeorian"        : [ 0, 2, 3, 5, 7, 8, 10 ], 
        "Locrian"        : [ 0, 1, 3, 5, 6, 8, 10 ], 
        "MelodicMinor"   : [ 0, 2, 3, 5, 7, 9, 11 ],
        "Lydian7th"      : [ 0, 2, 4, 6, 7, 9, 10 ],
        "Altered"        : [ 0, 1, 3, 4, 6, 8, 10 ], 
        "HMP5b"          : [ 0, 1, 4, 5, 7, 8, 10 ], 
        "Locrian#2"      : [ 0, 2, 3, 5, 6, 8, 10 ], 
        "WholeTone"      : [ 0, 2, 4, 6, 8, 10 ], 
        "H/W_Diminished" : [ 0, 1, 3, 4, 6, 7, 9, 10 ], 
        "W/H_Diminished" : [ 0, 2, 3, 5, 6, 8, 9, 11 ], 
    }

    for( let i in this.chordProgression )
    {
        let chord = this.chordProgression[i];
        let chordInfo = {};

        // chord tone
        let chordTone = {};
        chordTone.root    = NoteList[ chord.root ];
        chordTone.third   = chordTone.root + ThirdNoteInterval[ chord.third ];
        chordTone.fifth   = chordTone.root + FifthNoteInterval[ chord.fifth ];
        chordTone.seventh = chordTone.root + SeventhNoteInterval[ chord.seventh ];
        for( let j in chordTone )
        {
            if( chordTone[j] >= 12 ){
                chordTone[j] -= 12;
            }
        }

        // scale note
        let scaleNote = [];
        let intaval =  ScaleNoteInterval[ chord.scale ];
        for( let j in intaval ){
            scaleNote[j] = chordTone.root + intaval[j];
        }
        for( let j in scaleNote )
        {
            if( scaleNote[j] > 12 ){
                scaleNote[j] -= 12;
            }
        }        
        for( let j in scaleNote ){
            let note = scaleNote[j] + 12;
            scaleNote.push( note );
        }
        scaleNote.sort( function( a, b ){
            if( a > b ){
                return 1;
            }else if( a < b ){
                return -1;
            }
            return 0;
        } )

        let chrodToneIndex = {};
        chrodToneIndex.root = [];
        chrodToneIndex.third = [];
        chrodToneIndex.fifth = [];        
        for( let j in scaleNote )
        {
            if( scaleNote[j] % 12 == chordTone.root ){
                chrodToneIndex.root.push( j );
            }

            if( scaleNote[j] % 12  == chordTone.third ){
                chrodToneIndex.third.push( j );
            }    
            
            if( scaleNote[j] % 12  == chordTone.fifth ){
                chrodToneIndex.fifth.push( j );
            }                
        }

        chordInfo.chordTone = chordTone;
        chordInfo.scaleNote = scaleNote;
        chordInfo.chordToneIndex = chrodToneIndex;
        this.chordInfoArray.push( chordInfo );
    }
}

MelodyMaker.prototype.getMelodyLine = function(){
    if( this.melodyLineArray.length == 0 ){
        this.generateMelodyLine( this.currentChord );
    }
    return this.melodyLineArray.pop();  
}

MelodyMaker.prototype.getBassLine = function(){
    return this.generateBassLine( this.currentChord )
}

MelodyMaker.prototype.clearMelodyLine = function(){
    this.melodyLineArray = [];
    this.currentChord = 0;
}


/////////////////////////////////////////////////////////////////////
// Melody
/////////////////////////////////////////////////////////////////////

MelodyMaker.prototype.generateMelodyLine = function( chordIndex ){

    let isApproach = true;
    let randomVal = Math.floor(Math.random() * 8);
    if (randomVal % 8 === 0){
        isApproach = false;
    }    

    let melodyLine = [];
    if( isApproach ){
        let targetNote = this.generateMelodyLine( this.getNextChord( chordIndex ) );
        melodyLine = this.approachLine( targetNote, chordIndex );
    }else{
        melodyLine = this.notApproachLine( chordIndex );        
    }

    let firstNote = melodyLine[0];

    let scale = this.chordInfoArray[ chordIndex ].scaleNote;
    let chordToneIndex = this.chordInfoArray[ chordIndex ].chordToneIndex;    
    for( let i in melodyLine ) {
        randomVal = Math.floor(Math.random() * 8);

        let isChordTone = false;
        for( let j in chordToneIndex ){
            for( let k in chordToneIndex[ j ] )
            if(  scale[ chordToneIndex[ j ][ k ] ]  == melodyLine[i] ){
                isChordTone = true;
                break;
            }
            if( isChordTone ){
                break;
            }
        }

        if ( randomVal % 8 === 0 && isApproach && !isChordTone ) {
            melodyLine[i] = NOTE_REST;
        }
    }

    this.melodyLineArray.push( melodyLine );

    return firstNote;
}

MelodyMaker.prototype.getNextChord = function ( current )
{
    let next = current + 1;
    if ( next >= this.chordProgression.length ){
        next = 0;
    }
    return next;
}

MelodyMaker.prototype.notApproachLine = function ( chordIndex )
{   
    let randomVal = Math.floor(Math.random() * 2);
    if (randomVal % 2 === 0){
        return this.resolve1( chordIndex );
    }else{
        return this.resolve2( chordIndex );
    }     
}

MelodyMaker.prototype.approachLine = function ( targetNote, chordIndex )
{
    let randomVal = Math.floor(Math.random() * 3);
    if (randomVal % 3 === 0){
        return this.resolve3( targetNote, chordIndex );
    }else{
        return this.approach( targetNote, chordIndex );
    }       
}

MelodyMaker.prototype.resolve1 = function ( chordIndex )
{   
    let melodyLine = [];
  
    let scaleNote = this.chordInfoArray[ chordIndex ].scaleNote;
    let stopPos = Math.floor(Math.random() * 2) + 4;

    for( let i = 7; i > stopPos; --i ){
        melodyLine[i] = NOTE_REST;
    }

    let rootIndex = 0;
    if( Math.random() * 2 > 1 ){
        rootIndex = 1;
    }
    let targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[rootIndex] );
    let targetNote = scaleNote[ targetNoteIndex ];
    if( targetNote >= 16 ) {
        targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[0] );
        targetNote -= 12;
    }
    melodyLine[stopPos] = targetNote;
    
    let isUpLine = true;
    if( NOTE_Bb_0 > targetNote ){
        isUpLine = false;
    }

    for( let i = stopPos - 1; i >= 4; --i ){
        let interval = this.randomSmallInterval();
        if( isUpLine ){
            targetNoteIndex = targetNoteIndex - interval;
        }else{
            targetNoteIndex = targetNoteIndex + interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        targetNote = scaleNote[ targetNoteIndex ];
        melodyLine[i] = targetNote;
    }

    line = this.randomLine( melodyLine[4] );
    count = 3;    
    for( let i = 3; i >= 0; --i ){
        if( line[count].isUp ){
            targetNoteIndex = targetNoteIndex - line[count].interval;
        }else{
            targetNoteIndex = targetNoteIndex + line[count].interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        if( targetNoteIndex > 13 ) targetNoteIndex = 13;
        targetNote = scaleNote[ targetNoteIndex ];
        melodyLine[i] = targetNote;
        --count;        
    }    

    return melodyLine
}

MelodyMaker.prototype.resolve2 = function ( chordIndex )
{   
    let melodyLine = [];
  
    let scaleNote = this.chordInfoArray[ chordIndex ].scaleNote;
    let stopPos1 = Math.floor(Math.random() * 2) + 4;
    let stopPos2 = Math.floor(Math.random() * 2) + 1;
    
    for( let i = 7; i > stopPos1; --i ){
        melodyLine[i] = NOTE_REST;
    }

    let rootIndex = 0;
    if( Math.random() * 2 > 1 ){
        rootIndex = 1;
    }

    let targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[rootIndex] );
    let targetNote = scaleNote[ targetNoteIndex ];
    if( targetNote >= 16 ) {
        targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[0] );
        targetNote -= 12;
    }
    let isHeighNote = false;
    if( targetNote > 12 ){
        isHeighNote = true;
    }
    melodyLine[stopPos1] = targetNote;    

    let isUpLine = true;
    if( NOTE_Bb_0 > targetNote ){
        isUpLine = false;
    }

    for( let i = stopPos1 - 1; i > stopPos2; --i ){
        let interval = this.randomSmallInterval();
        if( isUpLine ){
            targetNoteIndex = targetNoteIndex - interval;
        }else{
            targetNoteIndex = targetNoteIndex + interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        targetNote = scaleNote[ targetNoteIndex ];
        melodyLine[i] = targetNote;
    }

    melodyLine[stopPos2] = NOTE_REST;     

    rootIndex = 0;
    if( isHeighNote ){
        rootIndex = 1;
    }
    targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[rootIndex] );
    targetNote = scaleNote[ targetNoteIndex ];
    if( targetNote >= 16 ) {
        targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[0] );
        targetNote -= 12;
    }
    melodyLine[stopPos2-1] = targetNote;

    for( let i = stopPos2 - 1; i >= 0; --i ){
        let interval = this.randomSmallInterval();
        if( isUpLine ){
            targetNoteIndex = targetNoteIndex - interval;
        }else{
            targetNoteIndex = targetNoteIndex + interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        targetNote = scaleNote[ targetNoteIndex ];
        melodyLine[i] = targetNote;
    }    

    return melodyLine;
}

MelodyMaker.prototype.resolve3 = function ( targetNote, chordIndex )
{   
    let melodyLine = [];
    let scaleNote = this.chordInfoArray[ chordIndex ].scaleNote;

    let isUpLine = true;
    if( NOTE_Bb_0 > targetNote ){
        isUpLine = false;
    }

    let targetNoteIndex = this.searchNearestScaleNoteIndex( targetNote, scaleNote, isUpLine );
    let target = scaleNote[ targetNoteIndex ];
    melodyLine[7] = target;

    let line = this.randomLine( target );
    let count = 2;
    for( let i = 6; i >= 4; --i ){
        if( line[count].isUp ){
            targetNoteIndex = targetNoteIndex - line[count].interval;
        }else{
            targetNoteIndex = targetNoteIndex + line[count].interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        if( targetNoteIndex > 13 ) targetNoteIndex = 13;
        target = scaleNote[ targetNoteIndex ];
        melodyLine[i] = target;
        --count;
    }

    let stopPos = Math.floor(Math.random() * 3);
    for( let i = 3; i > stopPos; --i ){
        melodyLine[i] = NOTE_REST;
    }

    let rootIndex = 0;
    if( Math.random() * 2 > 1 ){
        rootIndex = 1;
    }    
    targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[rootIndex] );
    target = scaleNote[ targetNoteIndex ];
    if( target >= 16 ) {
        targetNoteIndex = Number( this.chordInfoArray[ chordIndex ].chordToneIndex.root[0] );
        target -= 12;
    }
    melodyLine[stopPos] = target;

    if( NOTE_Bb_0 > target ){
        isUpLine = false;
    }

    for( let i = stopPos - 1; i >= 0; --i ){
        let interval = this.randomSmallInterval();
        if( isUpLine ){
            targetNoteIndex = targetNoteIndex - interval;
        }else{
            targetNoteIndex = targetNoteIndex + interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        if( targetNoteIndex > 13 ) targetNoteIndex = 13;
        target = scaleNote[ targetNoteIndex ];
        melodyLine[i] = target;
    }    

    return melodyLine;
}

MelodyMaker.prototype.approach = function ( targetNote, chordIndex )
{   
    let melodyLine = [];
    let scaleNote = this.chordInfoArray[ chordIndex ].scaleNote;
    let chordToneIndex = this.chordInfoArray[ chordIndex ].chordToneIndex;

    let isUpLine = true;
    if( NOTE_Bb_0 > targetNote ){
        isUpLine = false;
    }

    let targetNoteIndex = this.searchNearestScaleNoteIndex( targetNote, scaleNote, isUpLine );
    let target = scaleNote[ targetNoteIndex ];
    melodyLine[7] = target;

    let line = this.randomLine( target );
    let count = 2;
    for( let i = 6; i >= 4; --i ){
        if( line[count].isUp ){
            targetNoteIndex = targetNoteIndex - line[count].interval;
        }else{
            targetNoteIndex = targetNoteIndex + line[count].interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        if( targetNoteIndex > 13 ) targetNoteIndex = 13;
        target = scaleNote[ targetNoteIndex ];
        melodyLine[i] = target;
        --count;
    }

    line = this.randomLine( melodyLine[4] );
    count = 3;    
    for( let i = 3; i >= 1; --i ){
        if( line[count].isUp ){
            targetNoteIndex = targetNoteIndex - line[count].interval;
        }else{
            targetNoteIndex = targetNoteIndex + line[count].interval;
        }
        if( targetNoteIndex < 0 ) targetNoteIndex = 0;
        if( targetNoteIndex > 13 ) targetNoteIndex = 13;
        target = scaleNote[ targetNoteIndex ];
        melodyLine[i] = target;
        --count;        
    }
    
    targetNoteIndex = this.searchNearestChordToneIndex( melodyLine[1], scaleNote, chordToneIndex, line[0].isUp );
    melodyLine[0] = scaleNote[ targetNoteIndex ];

    return melodyLine
}

MelodyMaker.prototype.generateBassLine = function( chord )
{
    let line = [];
    if( this.bassStyle == "latin"){
        line = this.generateLatinBassLine( chord );
    }else{
        line = this.generate4beatBassLine( chord );
    }
    return line;
}

MelodyMaker.prototype.generateLatinBassLine = function( chord )
{
    let chordTone = this.chordInfoArray[ chord ].chordTone;
    let line = [];
    {      
        line[0] = chordTone.root;
        line[1] = NOTE_EXTEND;
        line[2] = NOTE_REST;
        line[3] = chordTone.fifth;
        line[4] = NOTE_EXTEND;
        line[5] = NOTE_REST;
        line[6] = chordTone.root;
        line[7] = NOTE_EXTEND;
    }
    return line;
}

MelodyMaker.prototype.generate4beatBassLine = function( chord )
{
    let chordTone = this.chordInfoArray[ chord ].chordTone;
    let nextChordTone = this.chordInfoArray[ this.getNextChord( chord ) ].chordTone;
    let line = [];
    let randomVal = Math.floor(Math.random() * 6);
    if( randomVal < 2 ){
        line[0] = chordTone.root;
        line[1] = NOTE_REST;
        line[2] = chordTone.third;
        line[3] = NOTE_REST;
        line[4] = chordTone.fifth;
        line[5] = NOTE_REST;
        line[6] = chordTone.root;
        line[7] = NOTE_REST;
    }else if( randomVal < 3 ){
        line[0] = chordTone.root;
        line[1] = NOTE_REST;
        line[2] = chordTone.third;
        line[3] = NOTE_REST;
        line[4] = nextChordTone.root - 2;
        line[5] = NOTE_REST;
        line[6] = nextChordTone.root - 1;
        line[7] = NOTE_REST;
    }else if( randomVal < 4 ){
        line[0] = chordTone.root;
        line[1] = NOTE_REST;
        line[2] = chordTone.third;
        line[3] = NOTE_REST;
        line[4] = nextChordTone.root + 2;
        line[5] = NOTE_REST;
        line[6] = nextChordTone.root + 1;
        line[7] = NOTE_REST;      
    }else{
        line[0] = chordTone.root;
        line[1] = NOTE_REST;
        line[2] = chordTone.root;
        line[3] = NOTE_REST;
        line[4] = chordTone.fifth;
        line[5] = NOTE_REST;
        line[6] = chordTone.root;
        line[7] = NOTE_REST;
    }

    line[1] = NOTE_EXTEND;
    line[3] = NOTE_EXTEND;
    line[5] = NOTE_EXTEND;        
    line[7] = NOTE_EXTEND;

    return line;
}

MelodyMaker.prototype.randomSmallInterval = function ()
{
    let randomVal = Math.floor(Math.random() * 28 );
    if( randomVal < 20 ){
        return 1;
    }else if ( randomVal < 29 ){
        return 2;        
    }else{
        return 3;    
    }
    return 0;
}

MelodyMaker.prototype.randomLargeInterval = function ()
{
    let randomVal = Math.floor(Math.random() * 20 );
    if( randomVal < 4 ){
        return 1;
    }else if ( randomVal < 12 ){
        return 2;        
    }else if ( randomVal < 18 ){
        return 3;
    }else if ( randomVal < 24 ){
        return 4;    
    }else if ( randomVal < 27 ){
        return 5;                
    }else if ( randomVal < 29 ){
        return 6;        
    }else{
        return 7;    
    }
    return 0;
}

MelodyMaker.prototype.randomLine = function ( targetNote )
{
    let isUpLine = true;
    if( NOTE_Bb_0 > targetNote ){
        isUpLine = false;
    }

    let AdjustRandomVal = 10;
    if( isUpLine ){
        if( NOTE_F_1 < targetNote ){
            AdjustRandomVal = 7;
        }
    }else{
        if( targetNote < NOTE_E_0 ){
            AdjustRandomVal = 7;
        }
    }

    let randomVal = Math.floor(Math.random() * AdjustRandomVal );

    let line = [];
    if( isUpLine ){    
        if( randomVal < 5 ){
            line[0] = { "isUp": true, "interval": this.randomSmallInterval() };
            line[1] = { "isUp": true, "interval": this.randomSmallInterval() };
            line[2] = { "isUp": true, "interval": this.randomSmallInterval() };
            line[3] = { "isUp": true, "interval": this.randomSmallInterval() };
        }else if ( randomVal < 7 ){
            line[0] = { "isUp": false, "interval": this.randomLargeInterval() };
            line[1] = { "isUp": true,  "interval": this.randomSmallInterval() };
            line[2] = { "isUp": true,  "interval": this.randomSmallInterval() };
            line[3] = { "isUp": true,  "interval": this.randomSmallInterval() };
        }else if ( randomVal < 9 ){
            line[0] = { "isUp": true,  "interval": this.randomSmallInterval() };
            line[1] = { "isUp": true,  "interval": this.randomSmallInterval() };
            line[2] = { "isUp": false, "interval": this.randomLargeInterval() };
            line[3] = { "isUp": true,  "interval": this.randomSmallInterval() };
        }else{
            line[0] = { "isUp": true,  "interval": this.randomSmallInterval() };
            line[1] = { "isUp": false, "interval": this.randomLargeInterval() };
            line[2] = { "isUp": true,  "interval": this.randomSmallInterval() };
            line[3] = { "isUp": true,  "interval": this.randomSmallInterval() };
        }
    }else{    
        if( randomVal < 5 ){
            line[0] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[1] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[2] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[3] = { "isUp": false, "interval": this.randomSmallInterval() };
        }else if ( randomVal < 7 ){
            line[0] = { "isUp": true,  "interval": this.randomLargeInterval() };
            line[1] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[2] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[3] = { "isUp": false, "interval": this.randomSmallInterval() };
        }else if ( randomVal < 9 ){
            line[0] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[1] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[2] = { "isUp": true,  "interval": this.randomLargeInterval() };
            line[3] = { "isUp": false, "interval": this.randomSmallInterval() };
        }else{
            line[0] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[1] = { "isUp": true,  "interval": this.randomLargeInterval() };
            line[2] = { "isUp": false, "interval": this.randomSmallInterval() };
            line[3] = { "isUp": false, "interval": this.randomSmallInterval() };
        }
    }

    return line;
}

MelodyMaker.prototype.searchNearestScaleNoteIndex = function ( targetNote, scale, isUpLine )
{
    let index = 0;
    if( isUpLine ){
        for( let i = scale.length; i > 0; --i ){
            if( scale[i] < targetNote ){
                index = i;
                break;
            }
        }
    }else{
        for( let i = 0; i < scale.length; ++i ){
            if( scale[i] > targetNote ){
                index = i;
                break;
            }
        }        
    }
    return index;
}

MelodyMaker.prototype.searchNearestChordToneIndex = function ( targetNote, scale, chordToneIndex, isUpLine )
{
    let index = 0;
    let minInterval = 100;

    for( let i in chordToneIndex )
    {
        if( i == "fifth" ) continue;
        let indexList = chordToneIndex[i];
        for( let j in indexList )
        {
            let toneIndex = Number( indexList[j] )
            let interval = Math.abs( targetNote - scale[ toneIndex ] );
            if( interval < minInterval ){
                minInterval = interval;
                index = toneIndex;
            }
        }
    }

    return index;    
}