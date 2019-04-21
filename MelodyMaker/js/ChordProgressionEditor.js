

let ChordProgressionEditor = function()
{
    this.dom = document.createElement("div");
    this.dom.style.width = "calc( 100% - 40px )";
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "row";
    this.dom.style.overflowX = "auto";    
    this.dom.style.padding = "15px 20px 20px 20px";
    this.dom.style.border = "1px solid #666";
    this.dom.style.borderStyle = "solid";       

    this.chordProgression = [];
    this.chordInputArray = [];
    this.insertChord( 0 );
}

ChordProgressionEditor.prototype.getDom = function()
{
    return this.dom;
}

ChordProgressionEditor.prototype.getChordProgression = function()
{
    return this.chordProgression;
}

ChordProgressionEditor.prototype.setChordProgression = function( chordProgression )
{
    this.chordProgression = JSON.parse(JSON.stringify(chordProgression))

    while( this.dom.lastChild ){
        this.dom.removeChild( this.dom.lastChild );
    }
    this.chordInputArray = [];

    for( let num in this.chordProgression ){
        let chord = new ChordInput( Number(num) );
        this.dom.appendChild( chord.getDom() );
        this.chordInputArray.push( chord );

        chord.onInsert = function( i ){
            this.insertChord( i );
        }.bind(this)
    
        chord.onDelete = function( i ){
            this.deleteChord( i );
        }.bind(this)
    
        chord.onChange = function( i, param ){
            this.chordProgression[i] = param;
        }.bind(this)            
    }

    this.updateChord();
}

ChordProgressionEditor.prototype.insertChord = function( number )
{
    let chord = new ChordInput( number );
    this.dom.appendChild( chord.getDom() );
    this.chordInputArray.push( chord );
    this.chordProgression.splice( number + 1, 0, chord.getParam() );

    chord.onInsert = function( i ){
        this.insertChord( i );
    }.bind(this)

    chord.onDelete = function( i ){
        this.deleteChord( i );
    }.bind(this)

    chord.onChange = function( i, param ){
        this.chordProgression[i] = param;
    }.bind(this)    

    this.updateChord();    
}

ChordProgressionEditor.prototype.deleteChord = function( number )
{
    if( this.chordProgression.length == 1 ){
        return;
    }

    this.chordProgression.splice( number, 1 );
    this.chordInputArray.pop();    
    this.dom.removeChild( this.dom.lastChild );
    
    this.updateChord();
}

ChordProgressionEditor.prototype.updateChord = function()
{
    for( let i in this.chordProgression )
    {
        let num = Number(i)
        this.chordInputArray[i].setParam( num, this.chordProgression[i] )
    }
}

let ChordInput = function( number )
{
    this.params = {};
    this.number = number;
    this.onChange = null;        
    this.onInsert = null;
    this.onDelete = null;    

    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";   

    this.chordNumber = document.createElement("div");
    this.chordNumber.textContent = ( this.number + 1 );
    this.chordNumber.style.fontSize = "18px"
    this.chordNumber.style.margin = "0px 0px 2px 0px";

    this.chordInputArea = document.createElement("div");
    this.chordInputArea.style.display = "flex";
    this.chordInputArea.style.flexDirection = "row";   
    this.chordInputArea.style.alignItems = "center";    

    this.chordEditArea = document.createElement("div");
    this.chordEditArea.style.display = "flex";
    this.chordEditArea.style.flexDirection = "column";
    this.chordEditArea.style.width = "140px";    
    this.chordEditArea.style.padding = "6px 10px 10px 10px";
    this.chordEditArea.style.border = "1px solid #666";
    this.chordEditArea.style.borderStyle = "solid";  
    this.chordEditArea.style.borderRadius = "10px";  

    this.chordNameArea = document.createElement("div");
    this.chordNameArea.style.display = "flex";
    this.chordNameArea.style.flexDirection = "row";
    this.chordNameArea.style.alignItems = "center";   
    this.chordNameArea.style.padding = "0px 0px 5px 0px"     
    this.chordNameArea.style.justifyContent = "space-between";

    this.chordName = document.createElement("canvas");
    this.chordName.width = 110;
    this.chordName.height = 34;  
    this.chordName.style.width = "110px";
    this.chordName.style.height = "34px";   
    
    this.deleteButton = document.createElement("div");
    this.deleteButton.style.width = "24px";
    this.deleteButton.style.height = "24px";
    this.deleteButton.style.color = "#fff";
    this.deleteButton.style.backgroundColor = "#55f"; 
    this.deleteButton.style.borderRadius = "3px";            
    this.deleteButton.onclick = function(){
        if( this.onDelete ){
            this.onDelete( this.number );
        }
    }.bind(this)
    
    this.deleteText = document.createElement("div");
    this.deleteText.style.fontSize = "18px";   
    this.deleteText.style.cursor = "pointer";   
    this.deleteText.style.margin = "2px 0px 0px 7px";    
    this.deleteText.textContent = "×";    
    
    this.paramInput = document.createElement("div");
    this.paramInput.style.display = "flex";
    this.paramInput.style.flexDirection = "column";
    this.paramInput.style.margin = "0px 0px 0px 0px";
    this.paramInput.style.backgroundColor = "#fff";  

    this.insertButton = document.createElement("div");
    this.insertButton.style.height = "40px";
    this.insertButton.style.width  = "30px";    
    this.insertButton.style.margin = "0px 15px 0px 20px";
    this.insertButton.style.cursor = "pointer";
    this.insertButton.classList.add("Right-Triangle");
    this.insertButton.onclick = function(){
        if( this.onInsert ){
            this.onInsert( this.number );
        }
    }.bind(this)

    this.chordNameArea.appendChild( this.chordName );
    this.chordNameArea.appendChild( this.deleteButton );
    this.deleteButton.appendChild( this.deleteText );    
    this.chordEditArea.appendChild( this.chordNameArea );
    this.chordEditArea.appendChild( this.paramInput );
    this.chordInputArea.appendChild( this.chordEditArea );
    this.chordInputArea.appendChild( this.insertButton );
    this.dom.appendChild(this.chordNumber);    
    this.dom.appendChild(this.chordInputArea);

    let ParamList = [
        { 
            name:"root", label:"Root", type:"select",
            values:[ "C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"]
        },
        { 
            name:"third", label:"3rd", type:"select",
            values:[ "major", "minor", "sus4" ]
        },
        { 
            name:"fifth", label:"5th", type:"select",
            values:[ "5", "-5", "+5" ]
        },
        { 
            name:"seventh", label:"7th", type:"select",
            values:[ "none", "7", "major7" ]
        },
        {
            name:"scale", label:"Scale", type:"select",
            values:[ "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian",
                     "Aeorian", "Locrian", "HMP5b", "Lydian7th" ]            
        }
    ]

    for( let i in ParamList ){
        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexDirection = "row";
        row.style.alignItems = "center";   
        row.style.justifyContent = "space-between";    
        row.style.margin = "2px 0px 3px 0px";

        let label = document.createElement("div");
        label.textContent = ParamList[i].label;
        label.style.width    = "48px";
        label.style.fontSize = "16px"        
        row.appendChild(label);

        let input;
        if( ParamList[i].type ){
            input = document.createElement("select");
            for( let j in  ParamList [i].values ){
                let opt = document.createElement("option");
                opt.value = ParamList[i].values[j];
                opt.textContent = ParamList[i].values[j];
                input.appendChild(opt);
            }  
        }else{
            input = document.createElement("input");
            input.type = ParamList[i].type;
        }
        input.style.backgroundColor = "#eee";
        input.style.height   = "20px";
        input.style.width    = "72px";
        input.style.fontSize = "8px"
        input.onchange = function(){
            this.drawChordName();
            if( this.onChange ){
                this.onChange( this.number, this.getParam() );
            }
        }.bind(this);
        row.appendChild(input);  

        this.paramInput.appendChild( row );
        this.params[ ParamList[i].name ] = input;
    }

    this.drawChordName();
}

ChordInput.prototype.getDom = function()
{
    return this.dom;
}

ChordInput.prototype.getParam = function()
{
    let param = {};
    for( let key in this.params ){
        param[ key ] = this.params[ key ].value;
    }
    return param;
}

ChordInput.prototype.setParam = function( number, param )
{
    this.number = number;
    this.chordNumber.textContent = ( this.number + 1 ); 
    for( let key in param ){
        this.params[ key ].value = param[ key ];
    }
    this.drawChordName();
}

ChordInput.prototype.drawChordName = function()
{
    let param = this.getParam();
    let ctx = this.chordName.getContext("2d");
    let width = this.chordName.width;
    let height = this.chordName.height;    
   
    ctx.clearRect( 0, 0,  width, height );
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.textAlign = "left"
    ctx.font = "32px 'Times New Roman'"    

    // root
    let posX = 0;
    let posY = 30;    
    let root = param.root.slice(0,1);
    ctx.fillText( root, posX, posY );
    let rootTextWidth = ctx.measureText( root );

    // ♭ 
    posX = rootTextWidth.width;
    posY = 14;    
    let flat = param.root.slice(1,2);
    ctx.font = "14px 'Times New Roman'"    
    ctx.fillText( flat, posX, posY );
    let flatTextWidth = ctx.measureText( flat );

    // 3rd
    posX = rootTextWidth.width + 3;
    posY = 30;
    let third = "";
    if( param.third == "minor" ){
        third = "m";    
    }else if( param.third == "sus4"){
        third = "sus4"; 
    }
    if( flat == "♭" ){
        posX += flatTextWidth.width - 3;
    }
    ctx.font = "22px 'Times New Roman'"    
    ctx.fillText( third, posX, posY );
    let trirdTextWidth = ctx.measureText( third ).width;

    // 5th
    posY = 14;
    let fifth = "";
    if( param.fifth == "-5" || param.fifth == "+5" ){
        fifth = param.fifth;    
    }
    ctx.font = "14px 'Times New Roman'"    
    ctx.fillText( fifth, posX, posY );

    // 7th
    posX += trirdTextWidth + 2;
    posY = 30;
    let seventh = "";
    if( param.seventh == "7" ){
        seventh = "7";    
    }else if( param.seventh == "major7" ){
        seventh = "M7";    
    }
    ctx.font = "22px 'Times New Roman'"    
    ctx.fillText( seventh, posX, posY );    
}