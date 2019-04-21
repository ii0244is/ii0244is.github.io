
function MusicScore()
{
    this.MARGIN_LEFT       = 40;
    this.MARGIN_RIGHT      = 40;
    this.WIDTH_MEASURE     = 200;
    this.TOPLINE_POS       = 14; 
    this.HEIGHT_ROW        = 170;
    this.FIRST_NOTE_OFFSET = 6;
    this.WIDTH_ACCIDENTALS = 12;
    this.WIDTH_NOTES       = 12;
    this.HEIGHT_LINEGAP    = 12;
    this.INTERVAL_NOTE     = 22;
    this.SIZE_REST_CIRCLE  = 3;
    this.NUM_NOTES         = 8;
    this.NOTE_REST         = -50;
    
    this.NotePositionTable = 
    [
        { pos : 24, accidental : false, isLineNeeded : true  },
        { pos : 23, accidental : true,  isLineNeeded : false },
        { pos : 23, accidental : false, isLineNeeded : false },
        { pos : 22, accidental : true,  isLineNeeded : false },
        { pos : 22, accidental : false, isLineNeeded : false },
        { pos : 21, accidental : false, isLineNeeded : false },
        { pos : 20, accidental : true,  isLineNeeded : false },
        { pos : 20, accidental : false, isLineNeeded : false },
        { pos : 19, accidental : true,  isLineNeeded : false },
        { pos : 19, accidental : false, isLineNeeded : false },
        { pos : 18, accidental : true,  isLineNeeded : false },
        { pos : 18, accidental : false, isLineNeeded : false },
        { pos : 17, accidental : false, isLineNeeded : false },
        { pos : 16, accidental : true,  isLineNeeded : false },
        { pos : 16, accidental : false, isLineNeeded : false },
        { pos : 15,  accidental : true,  isLineNeeded : false },
        { pos : 15,  accidental : false, isLineNeeded : false },
        { pos : 14,  accidental : false, isLineNeeded : false },
        { pos : 13,  accidental : true,  isLineNeeded : false },
        { pos : 13,  accidental : false, isLineNeeded : false },
        { pos : 12,  accidental : true,  isLineNeeded : true  },
        { pos : 12,  accidental : false, isLineNeeded : true  },
        { pos : 11,  accidental : true,  isLineNeeded : true  },
        { pos : 11,  accidental : false, isLineNeeded : true  },
        { pos : 10,  accidental : false, isLineNeeded : true  }
    ];

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.MARGIN_LEFT + 4 * this.WIDTH_MEASURE + this.MARGIN_RIGHT;
    this.canvas.height = this.HEIGHT_ROW;
    this.context = this.canvas.getContext("2d");
    this.numMeasure = 1;
    this.chordProgression = [];
    this.clearScore();
}

MusicScore.prototype.getDom = function ()
{
    return this.canvas;
}

MusicScore.prototype.setNumMeasure = function ( num )
{
    this.numMeasure = num;
    this.canvas.height = this.HEIGHT_ROW * Math.ceil( this.numMeasure / 4 ) + 20; 
    this.clearScore();
}

MusicScore.prototype.setChordProgression = function( chordProgression ){
    this.chordProgression = JSON.parse(JSON.stringify(chordProgression))
}

MusicScore.prototype.draw = function ( pos, melody )
{
    let posX = this.MARGIN_LEFT + this.FIRST_NOTE_OFFSET + this.WIDTH_MEASURE * (pos % 4);
    let posY = Math.floor( pos / 4 ) * this.HEIGHT_ROW;
    this.drawMeasure( posX, posY, melody );
}

MusicScore.prototype.clearScore = function ()
{
    this.clearCanvas();
    let numRow = Math.ceil( this.numMeasure / 4 );
    for( let i = 0; i < numRow; ++i )
    {
        let offsetY = i * this.HEIGHT_ROW;
        this.draw5Line( offsetY );
        this.drawChord( offsetY + 15, i );        
    }
}

MusicScore.prototype.drawMeasure = function ( posX, posY, melody )
{
    let melody4note = [ melody[0], melody[1], melody[2], melody[3] ];
    let stratPos = posX;
    this.drawMelodyNote(stratPos, posY, this.INTERVAL_NOTE, melody4note);
    melody4note = [ melody[4], melody[5], melody[6], melody[7] ];
    stratPos = posX + this.INTERVAL_NOTE * 4;
    this.drawMelodyNote(stratPos, posY, this.INTERVAL_NOTE, melody4note);   
}

MusicScore.prototype.clearCanvas = function ()
{
    let ctx = this.context;
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

MusicScore.prototype.draw5Line = function ( offsetY )
{
    let ctx = this.context;
    ctx.strokeStyle = 'rgb(0, 0, 0)';

    for( i = 0; i < 5; ++i )
    {
        ctx.beginPath();
        ctx.lineWidth = 1; 
        let startX = this.MARGIN_LEFT;
        let startY = this.HEIGHT_LINEGAP * ( this.TOPLINE_POS / 2 + i ) + offsetY;
        let stopX  = this.canvas.width - this.MARGIN_RIGHT;
        let stopY  = startY;
        ctx.moveTo(startX, startY);
        ctx.lineTo(stopX, stopY);
        ctx.closePath();
        ctx.stroke();
    }

    for( i = 0; i < 5; ++i )
    {
        ctx.beginPath();
        ctx.lineWidth = 1; 
        let startX = this.MARGIN_LEFT + i * this.WIDTH_MEASURE;
        let startY = this.HEIGHT_LINEGAP * this.TOPLINE_POS / 2 + offsetY;
        let stopX  = startX;
        let stopY  = this.HEIGHT_LINEGAP * ( this.TOPLINE_POS / 2 + 4 ) + offsetY;
        ctx.moveTo(startX, startY);
        ctx.lineTo(stopX, stopY);
        ctx.closePath();
        ctx.stroke();
    }    
}

MusicScore.prototype.drawChord = function ( offsetY, row )
{
    let chordIndex = row * 4;

    for( let i = 0; i < 4; ++i ){
        let chord = this.chordProgression[ chordIndex + i ];    
        if( chord == null ){
            break;
        }
        let offsetX = this.MARGIN_LEFT + i * this.WIDTH_MEASURE + 8;
        this.drawChordName( chord, offsetX, offsetY );
    }
}

MusicScore.prototype.drawChordName = function( chord, x, y )
{
    let param = chord;
    let ctx = this.context;

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.textAlign = "left"
    ctx.font = "24px 'Times New Roman'"    

    // root
    let posX = 0 + x;
    let posY = 30 + y;
    let root = param.root.slice(0,1);
    ctx.fillText( root, posX, posY );
    let rootTextWidth = ctx.measureText( root );

    // ♭ 
    posX = rootTextWidth.width+ x;
    posY = 14 + y;
    let flat = param.root.slice(1,2);
    ctx.font = "10px 'Times New Roman'"    
    ctx.fillText( flat, posX, posY );
    let flatTextWidth = ctx.measureText( flat );

    // 3rd
    posX = rootTextWidth.width + 3 + x;
    posY = 30 + y;
    let third = "";
    if( param.third == "minor" ){
        third = "m";    
    }else if( param.third == "sus4"){
        third = "sus4"; 
    }
    if( flat == "♭" ){
        posX += flatTextWidth.width - 3;
    }
    ctx.font = "16px 'Times New Roman'"    
    ctx.fillText( third, posX, posY );
    let trirdTextWidth = ctx.measureText( third ).width;

    // 5th
    posY = 14 + y;
    let fifth = "";
    if( param.fifth == "-5" || param.fifth == "+5" ){
        fifth = param.fifth;    
    }
    ctx.font = "10px 'Times New Roman'"    
    ctx.fillText( fifth, posX, posY );

    // 7th
    posX += trirdTextWidth + 2;
    posY = 30 + y;
    let seventh = "";
    if( param.seventh == "7" ){
        seventh = "7";    
    }else if( param.seventh == "major7" ){
        seventh = "M7";    
    }
    ctx.font = "16px 'Times New Roman'"    
    ctx.fillText( seventh, posX, posY );    
}

MusicScore.prototype.drawMelodyNote = function ( startPosX, offsetY, gap, melody )
{
    let highestNote = NOTE_C_0;
    let lowestNote = NOTE_C_2;
    let numHighNote = 0;
    let numLowNote = 0;    
    let numRest = 0;
    
    // 高い音、低い音、休符の数を数える
    for( let i = 0; i < melody.length; ++i )
    {
        if(  melody[i] <= this.NOTE_REST )
        {
            ++numRest;
        }
        else
        {
            if( NOTE_B_0 < melody[i] )
            {
                ++numHighNote;
            }
            else
            {
                ++numLowNote;
            }

            if( highestNote < melody[i] )
            {
                highestNote = melody[i];
            }

            if( melody[i] < lowestNote )
            {
                lowestNote = melody[i];
            }
        }
    }

    // 開始音の位置を探す
    let firstNotePos = 0;
    for( let i = 0; i < melody.length; ++i )
    {
        if( melody[i] > this.NOTE_REST )
        {
            firstNotePos = i;
            break;
        }
    }

    // 終了音の位置を探す
    let lastNotePos = 0;
    for( let i = 3; i > 0; --i )
    {
        if( melody[i] > this.NOTE_REST )
        {
            lastNotePos = i;
            break;
        }
    }    

    // 音符の縦線を左右のどちら側に描くか決める
    let isLineLeftSide = false;
    if( numHighNote > numLowNote )
    {
        isLineLeftSide = true;
    }
    if( highestNote >= NOTE_Gb_1 )
    {
        isLineLeftSide = true;
    }

    // 音符を描画する
    let lineStopPos = 0;
    for( let i = 0; i < melody.length; ++i )
    {
        let posX = startPosX + gap * i;
        if( isLineLeftSide )
        {
            lineStopPos = this.NotePositionTable[lowestNote].pos + 5;
            if( !( numRest === 3 ) && ( lineStopPos < 21 ) )
            {
                // 横線の位置と休符記号が重なる場合、横線の位置を下にずらす
                lineStopPos = 21;
            }     
        }
        else
        {
            lineStopPos = this.NotePositionTable[highestNote].pos - 5;
            if( !( numRest === 3 ) && ( lineStopPos > 14 ) )
            {
                // 横線の位置と休符記号が重なる場合、横線の位置を上にずらす
                lineStopPos = 14;
            }
        }
        //console.log(  melody[i] );
        this.drawNote( posX, offsetY, melody[i], isLineLeftSide, lineStopPos );
    }    

    // 8分音符をつなぐ横線を描画する
    if ( numRest === 3 )
    {
        // 8分音符が一つしかない場合
        let ctx = this.context;
        let radiusX = this.WIDTH_NOTES * 0.8;
        let radiusY = 4 * this.HEIGHT_LINEGAP / 2;   
        let posX = startPosX + gap * firstNotePos + this.WIDTH_ACCIDENTALS;
        let posY = offsetY + lineStopPos * this.HEIGHT_LINEGAP / 2 - radiusY;
        let startArc = 10 * Math.PI / 180;
        let stopArc  = 90 * Math.PI / 180; 
        if( !isLineLeftSide )
        {
            posX += this.WIDTH_NOTES;
            posY = offsetY + lineStopPos * this.HEIGHT_LINEGAP / 2 + radiusY;
            startArc = 270 * Math.PI / 180;
            stopArc  = 350 * Math.PI / 180;   
        }        
        ctx.beginPath();
        ctx.ellipse(posX, posY, radiusX, radiusY, 0, startArc, stopArc, false);
        ctx.stroke();
    }
    else if( ( 0 <= numRest ) && (numRest <= 2 ) )
    {
        let ctx = this.context;
        ctx.beginPath();
        let startX = startPosX + gap * firstNotePos + this.WIDTH_ACCIDENTALS;
        let startY = offsetY + lineStopPos * this.HEIGHT_LINEGAP / 2;
        let stopX  = startPosX + gap * lastNotePos + this.WIDTH_ACCIDENTALS;
        let stopY  = offsetY + lineStopPos * this.HEIGHT_LINEGAP / 2;
        if( !isLineLeftSide )
        {
            startX += this.WIDTH_NOTES;
            stopX += this.WIDTH_NOTES;
        }
        ctx.lineWidth = 6;
        ctx.moveTo(startX, startY);
        ctx.lineTo(stopX, stopY);
        ctx.closePath();
        ctx.stroke();           
    } 
}

MusicScore.prototype.drawNote = function ( positionX, offsetY, note, isLineLeftSide, lineStopPos )
{
    let ctx = this.context;
    ctx.fillStyle = 'rgb(0, 0, 0)';

    if( note <= this.NOTE_REST )
    {
        // 休符を描画する
        let radiusX = this.SIZE_REST_CIRCLE;
        let radiusY = this.SIZE_REST_CIRCLE;        
        let posX = positionX + this.WIDTH_ACCIDENTALS + radiusX;
        let posY = offsetY + 17 * this.HEIGHT_LINEGAP / 2;
        ctx.beginPath();
        ctx.ellipse(posX, posY, radiusX, radiusY, 0, 0, 2 * Math.PI, true);
        ctx.fill();

        radiusX = this.SIZE_REST_CIRCLE * 2;
        radiusY = this.SIZE_REST_CIRCLE * 2.3; 
        posX = positionX + this.WIDTH_ACCIDENTALS + radiusX;
        posY = offsetY + 17 * this.HEIGHT_LINEGAP / 2 - radiusY / 2;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.ellipse(posX, posY, radiusX, radiusY, 0, 10 * Math.PI / 180, 160 * Math.PI / 180, false);
        ctx.stroke();

        ctx.beginPath();
        let startX = positionX + this.WIDTH_ACCIDENTALS + radiusX * 2;
        let startY = offsetY + 17 * this.HEIGHT_LINEGAP / 2 - 2;
        let stopX  = startX - radiusX;
        let stopY  = offsetY + 20 * this.HEIGHT_LINEGAP / 2;
        ctx.moveTo(startX, startY);
        ctx.lineTo(stopX, stopY);
        ctx.closePath();
        ctx.stroke();        
    }
    else
    {
        if( this.NotePositionTable[note].isLineNeeded )
        {
            // 5線の範囲外の音には横線を描く
            let startX = 0;
            let stopX  = 0;
            let pos = this.NotePositionTable[note].pos;
            if( pos % 2 == 1 ){
                ++pos;
            }                
            let linePosY = offsetY + pos * this.HEIGHT_LINEGAP / 2;
            let linePlus = this.WIDTH_ACCIDENTALS * 0.4;
            if( this.NotePositionTable[note].accidental )
            {
                startX = positionX;
                stopX  = startX + this.WIDTH_ACCIDENTALS + this.WIDTH_NOTES + linePlus;
            }
            else
            {
                startX = positionX + this.WIDTH_ACCIDENTALS / 2;
                stopX  = startX + this.WIDTH_ACCIDENTALS / 2 + this.WIDTH_NOTES + linePlus;
            }           
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(startX, linePosY);
            ctx.lineTo(stopX, linePosY);
            ctx.closePath();
            ctx.stroke();

            // 高いドは線が2本いる
            if( note === NOTE_C_2 )
            {
                linePosY = offsetY + 12 * this.HEIGHT_LINEGAP / 2;
                ctx.beginPath();
                linePlus = this.WIDTH_ACCIDENTALS * 0.4;
                if( this.NotePositionTable[note].accidental )
                {
                    startX = positionX;
                    stopX  = startX + this.WIDTH_ACCIDENTALS + this.WIDTH_NOTES + linePlus;
                }
                else
                {
                    startX = positionX + this.WIDTH_ACCIDENTALS / 2;
                    stopX  = startX + this.WIDTH_ACCIDENTALS / 2 + this.WIDTH_NOTES + linePlus;
                }           
                ctx.lineWidth = 1;
                ctx.moveTo(startX, linePosY);
                ctx.lineTo(stopX, linePosY);
                ctx.closePath();
                ctx.stroke();                
            }
        }

        // 臨時記号
        let pos  = this.NotePositionTable[note].pos;
        let posX = positionX;
        let posY = offsetY + pos * this.HEIGHT_LINEGAP / 2;    
        if( this.NotePositionTable[note].accidental )
        {
            ctx.font = "14px 'ＭＳ Ｐゴシック'";
            ctx.lineWidth = 1;
            ctx.strokeText("♭", posX, posY + 3 );
        }

        // 音符
        let radiusX = this.WIDTH_NOTES / 2;
        let radiusY = radiusX - 2;
        let rotate  = -20 * Math.PI / 180;   
        posX += this.WIDTH_ACCIDENTALS + radiusX;
        ctx.beginPath();
        ctx.ellipse(posX, posY, radiusX, radiusY, rotate, 0, 2 * Math.PI, true);
        ctx.fill();

        // 縦線
        let linePosX = 0;
        let startY   = posY;
        let stopY    = offsetY + lineStopPos * this.HEIGHT_LINEGAP / 2;  
        if( isLineLeftSide )
        {
            linePosX = posX - radiusX;
        }
        else
        {
            linePosX = posX + radiusX;
        }
        ctx.beginPath();       
        ctx.lineWidth = 1;    
        ctx.moveTo(linePosX, startY);
        ctx.lineTo(linePosX, stopY);
        ctx.closePath();
        ctx.stroke();        
    }
}
