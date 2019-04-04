
let THREADID_AREA_WIDTH = 150;
let SCALE_AREA_HEIGHT = 70;
let SCALE_CHANGE_RATE = 0.0003;
let TIMELINE_HIEGHT = 50;

function appStart()
{
    let fileInput = document.getElementById( "FileInput" );
    fileInput.onchange = function(event) {
        let file = event.target.files[0];        
        let reader = new FileReader();
        reader.readAsText( file );
        reader.onload = function(e) {
            parseLogData( reader.result );
        }
    }

    function parseLogData( data )
    {
        let lines = data.split("\n");
        let logData = {};
        for( let i in lines )
        {
            let values = lines[i].split(",")
            if( values[3] !== "stop" ) continue;

            let taskData = {};
            taskData.time = Number( values[0] );
            taskData.threadID = values[1];
            taskData.name = values[2];
            taskData.startTime = Number( values[4] );
            taskData.processingTime = Number( values[5] );
            taskData.stopTime = taskData.startTime + taskData.processingTime;            

            if( logData[taskData.threadID] ){
                taskData.taskID = logData[taskData.threadID].length;
                logData[taskData.threadID].push(taskData);
            }else{
                let tasks = [];
                taskData.taskID = 0;
                tasks.push(taskData);
                logData[taskData.threadID] = tasks;
            }
        }

        // console.log( logData );
        createPerformanceView( logData );
    }

    let pv = new PerformanceView();      
    function createPerformanceView( logData )
    {
        pv.setLogData( logData );
        pv.draw();
    }    
}

let PerformanceView = function()
{
    this.logData   = {};
    this.colorList = {};
    this.rectList  = [];
    this.selectedTask = {};
    this.selectedTask.threadID = -1;
    this.selectedTask.taskID = -1;    
    this.currentTime = 0;
    this.microSecPerPixel = 1000;
    this.rate = this.microSecPerPixel * SCALE_CHANGE_RATE;
    
    this.viewerArea = document.getElementById( "PerformanceViewer" );
    this.canvas = document.createElement("canvas");
    this.viewerArea.appendChild(this.canvas);

    this.taskInfo = new TaskInformation();
    this.taskInfo.setPosition( "RightBottom", 30, 30 );
    this.taskInfo.show(false);

    this.setupEvents();
    this.resize();
}

PerformanceView.prototype.setLogData = function( logData )
{
    this.logData = logData;
    this.colorList = {};
    for( let threadID in this.logData )
    {
        for( let i in this.logData[ threadID ] )
        {
            let name = this.logData[ threadID ][i].name;
            if( this.colorList[name] ) continue;
            // let color = hsvToRgb( Math.random() * 360, 255, 255);
            let r = Math.floor( Math.random() * 180 ) + 50;
            let g = Math.floor( Math.random() * 180 ) + 50;
            let b = Math.floor( Math.random() * 180 ) + 50;            
            this.colorList[name] = "rgba(" + r + "," + g +"," + b + ",1)"
        }
    }
}

PerformanceView.prototype.setupEvents = function()
{
    this.canvas.onmousedown = function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        this.mousePosX = x;
        this.mousePosY = y;

        if( x < THREADID_AREA_WIDTH ) return;

        switch (event.button)
        {
            case 0: this.mouseLeftDrag   = true; break;
            case 1: this.mouseMiddleDrag = true; break;
            case 2: this.mouseRightDrag  = true; break;
        }

        let isTaskSelected = false;
        for( let i = this.rectList.length - 1; i >= 0; --i ){
            let rect = this.rectList[i];
            if( ( rect.x < x ) && ( x < rect.x + rect.width ) &&
                ( rect.y < y ) && ( y < rect.y + rect.height ) ){
                isTaskSelected = true;
                this.selectedTask.threadID = rect.threadID;
                this.selectedTask.taskID = rect.taskID;
                let taskData = {};                  
                taskData[ "Thread ID" ] = this.logData[rect.threadID][rect.taskID].threadID;                
                taskData[ "Name" ] = this.logData[rect.threadID][rect.taskID].name;
                taskData[ "Start" ] = this.logData[rect.threadID][rect.taskID].startTime + " [us]";
                taskData[ "Stop" ] = this.logData[rect.threadID][rect.taskID].stopTime + " [us]";
                taskData[ "ProcessingTime" ] = this.logData[rect.threadID][rect.taskID].processingTime + " [us]";
                this.taskInfo.setData( taskData );                  
                this.taskInfo.show(true); 
                break;
            }
        } 

        if( !isTaskSelected ){
            this.selectedTask.threadID = -1;
            this.selectedTask.taskID = -1;  
            this.taskInfo.clearData();  
            this.taskInfo.show(false);          
        }

        this.draw();

    }.bind(this);

    this.canvas.onmousemove = function (event)
    {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
    
        if( this.mouseLeftDrag )
        {
            let diffX = this.mousePosX - x;
            let diffTime = this.microSecPerPixel * diffX;
            let tempTime = this.currentTime + diffTime;
            if( tempTime >= 0 ){
                this.currentTime = tempTime;
            }else{
                this.currentTime = 0;
            }
            this.draw();   
        }

        this.mousePosX = x;
        this.mousePosY = y;
    }.bind(this);

    this.canvas.onmouseup = function (event)
    {
        this.mouseLeftDrag   = false;
        this.mouseMiddleDrag = false;
        this.mouseRightDrag  = false;
    }.bind(this);

    this.canvas.onmousewheel = function (event)
    {
        event.preventDefault();

        let mousePosTime = ( this.mousePosX - THREADID_AREA_WIDTH ) * this.microSecPerPixel + this.currentTime;
        let tempVal = this.microSecPerPixel - event.wheelDelta * this.rate;
        if( tempVal >= 1 ){
            this.microSecPerPixel = tempVal;            
        }else{
            this.microSecPerPixel = 1;
        }
        this.rate = this.microSecPerPixel * SCALE_CHANGE_RATE;
        this.currentTime = mousePosTime - ( this.mousePosX - THREADID_AREA_WIDTH ) * this.microSecPerPixel;
        if( this.currentTime < 0 ){
            this.currentTime = 0;
        }
        this.draw();
    }.bind(this);

    window.addEventListener("resize", this.resize.bind(this) );      
}

PerformanceView.prototype.resize = function()
{
    this.canvas.width  = this.viewerArea.clientWidth;
    this.canvas.height = this.viewerArea.clientHeight; 
    this.draw();   
}

PerformanceView.prototype.draw = function()
{
    let ctx = this.canvas.getContext("2d");

    this.clearCanvas(ctx);

    this.drawTimeInfo(ctx);

    let x = THREADID_AREA_WIDTH;
    let y = 0;
    let w = this.canvas.width - THREADID_AREA_WIDTH;
    let h = SCALE_AREA_HEIGHT;
    this.drawScale(ctx, x, y, w, h);

    x = 0;
    y = SCALE_AREA_HEIGHT;
    w = this.canvas.width;
    h = this.canvas.height - SCALE_AREA_HEIGHT;
    this.drawTimelineArea(ctx, x, y, w, h);    

    this.drawFrameLine(ctx);    
}

PerformanceView.prototype.clearCanvas = function(ctx)
{
    ctx.fillStyle = 'rgba(250,250,250,1)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

PerformanceView.prototype.drawTimeInfo = function(ctx)
{
    let width = this.canvas.width;
    let height = this.canvas.height;

    ctx.fillStyle = 'rgba(25,25,25,1)';
    ctx.fillRect( 0, 0, THREADID_AREA_WIDTH, SCALE_AREA_HEIGHT);    
    ctx.fillStyle = 'rgba(250,250,250,1)';
    ctx.fillText("Start : " + this.currentTime.toFixed(0) + "[us]", 20, 30);
    let endTime = this.currentTime + this.microSecPerPixel * ( width - THREADID_AREA_WIDTH );
    ctx.fillText("Stop  : " + endTime.toFixed(0) + "[us]", 20, 50);   
}

PerformanceView.prototype.drawScale = function(ctx, x, y, width, height)
{
    function calcLineInterval( microSecPerPixel ) 
    {
        let microSecPerLine = 100;
        let unit = "us";
        let ref = microSecPerPixel * 200;
        
        let unitList = [
            { microSecPerLine : 1 * 1000 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :      500 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :      100 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :       50 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :       10 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :        5 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :        1 * 1000 * 1000, unit : "s"  },
            { microSecPerLine :             500 * 1000, unit : "ms" },
            { microSecPerLine :             100 * 1000, unit : "ms" },
            { microSecPerLine :              50 * 1000, unit : "ms" },
            { microSecPerLine :              10 * 1000, unit : "ms" },
            { microSecPerLine :               5 * 1000, unit : "ms" },
            { microSecPerLine :               1 * 1000, unit : "ms" },
            { microSecPerLine :                    500, unit : "us" },
            { microSecPerLine :                    100, unit : "us" },
            { microSecPerLine :                     50, unit : "us" },
            { microSecPerLine :                     10, unit : "us" },
            { microSecPerLine :                      5, unit : "us" },
            { microSecPerLine :                      1, unit : "us" },            
        ]        

        for( let i in unitList ){
            microSecPerLine = unitList[i].microSecPerLine;
            unit = unitList[i].unit;
            if( microSecPerLine < ref ){
                break;
            }
        }

        let result = {};
        result.lineInterval = microSecPerLine / microSecPerPixel;
        result.microSecPerLine = microSecPerLine; 
        result.unit = unit;
        return result;
    }

    ctx.fillStyle = 'rgba(25,25,25,1)';
    ctx.fillRect( x, y, width, height );   
    
    let scale = calcLineInterval(this.microSecPerPixel);
    let microSecPerLine = scale.microSecPerLine;
    let lineInterval = scale.lineInterval;
    let unit = scale.unit;
    
    let offsetTime = microSecPerLine - ( this.currentTime % microSecPerLine );
    let timeFirstLine = ( Math.floor( this.currentTime / microSecPerLine ) + 1 ) * microSecPerLine;
    let posFirstLine = offsetTime / microSecPerLine * lineInterval;
    
    let count = 0;
    let linePos = 0;
    while( linePos < width )
    {
        linePos = posFirstLine + count * lineInterval;

        ctx.strokeStyle = 'rgba(250,250,250,1)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(linePos + x, height - 10);
        ctx.lineTo(linePos + x, height);
        ctx.stroke();  

        let time = timeFirstLine + count * microSecPerLine;
        if( unit == "ms" ){
            time /= 1000;
        }else if( unit == "s" ){
            time /= 1000000;
        }
         
        ctx.fillStyle = 'rgba(250,250,250,1)';
        ctx.fillText(time.toFixed(0), linePos + x, height - 35);   
        ctx.fillText("[" + unit + "]", linePos + x, height - 20);
        
        ctx.strokeStyle = 'rgba(200,200,200,1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(linePos + x, height);
        ctx.lineTo(linePos + x, this.canvas.height);
        ctx.stroke();          
        
        ++count;
    }
}

PerformanceView.prototype.drawTimelineArea = function(ctx, x, y, width, height)
{
    let threadCount = 0;
    this.rectList = [];
    for( let threadID in this.logData )
    {
        let posY = y + threadCount * TIMELINE_HIEGHT;

        ctx.strokeStyle = 'rgba(128,128,128,1)';
        ctx.lineWidth = 0.5;    
        ctx.strokeRect( x, posY, width, TIMELINE_HIEGHT );

        this.drawThreadID( ctx, x, posY, THREADID_AREA_WIDTH, TIMELINE_HIEGHT, threadID );

        let w = width - THREADID_AREA_WIDTH;
        this.drawTasks( ctx, THREADID_AREA_WIDTH, posY, w, TIMELINE_HIEGHT, this.logData[threadID] );

        ++threadCount;
    }
}

PerformanceView.prototype.drawThreadID = function(ctx, x, y, width, height, threadID)
{
    ctx.fillStyle = 'rgba(25,25,25,1)';
    let posX = x + 20;
    let posY = y + 29;
    ctx.fillText(threadID, posX, posY);    
}

PerformanceView.prototype.drawTasks = function(ctx, x, y, width, height, tasks)
{
    let viewStartTime = this.currentTime;    
    let viewEndTime = this.currentTime + this.microSecPerPixel * width;
    
    let taskList = [];
    for( let i in tasks ){
        if( tasks[i].stopTime < viewStartTime ) continue;
        if( viewEndTime < tasks[i].startTime ) continue;    
        taskList.push( tasks[i] );    
    }

    taskList.sort(function(a,b){
        if( a.processingTime < b.processingTime ){
            return 1;
        }else if( a.processingTime > b.processingTime ){
            return -1;
        }
        return 0;
    })

    let selectedRect = null;
    for( let i in taskList ){
        let taskStartTime = taskList[i].startTime;
        let taskEndTime = taskList[i].stopTime;   
        
        let left = width * ( taskStartTime - viewStartTime ) / ( viewEndTime - viewStartTime );
        if( taskStartTime < viewStartTime ){
            left = 0;
        }

        let right = width * ( taskEndTime - viewStartTime ) / ( viewEndTime - viewStartTime );
        if( viewEndTime < taskEndTime ){
            right = width;
        }        

        let top = height * 0.3;
        let bottom = height * 0.7;

        ctx.fillStyle = this.colorList[taskList[i].name];
        ctx.fillRect( left+x, top+y, right-left, bottom-top );    
        
        let rect = {}
        rect.x = left+x;
        rect.y = top+y;   
        rect.width = right-left; 
        rect.height = bottom-top;  
        rect.threadID = taskList[i].threadID;
        rect.taskID = taskList[i].taskID;
        this.rectList.push( rect );

        if( this.selectedTask.threadID == taskList[i].threadID &&
            this.selectedTask.taskID == taskList[i].taskID ){
            selectedRect = rect;     
        }   
    }

    if( selectedRect ){
        ctx.strokeStyle = 'rgba(250,20,20,1)';
        ctx.lineWidth = 3;    
        ctx.strokeRect( selectedRect.x, selectedRect.y, selectedRect.width, selectedRect.height );        
    }
}

PerformanceView.prototype.drawFrameLine = function(ctx)
{
    let width = this.canvas.width;
    let height = this.canvas.height;
    
    ctx.strokeStyle = 'rgba(150,150,150,1)';
    ctx.lineWidth = 1.0;
    let startX = THREADID_AREA_WIDTH;
    let startY = 0; 
    let endX   = THREADID_AREA_WIDTH;
    let endY   = height;   
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();    

    ctx.strokeStyle = 'rgba(200,200,200,1)';
    ctx.lineWidth = 2.0;    
    startX = 0;
    startY = SCALE_AREA_HEIGHT;   
    endX   = width;
    endY   = SCALE_AREA_HEIGHT;   
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();      
    
    ctx.strokeStyle = 'rgba(25,25,25,1)';
    ctx.lineWidth = 3.0;    
    ctx.strokeRect( 0, 0, this.canvas.width, this.canvas.height );    
}

let TaskInformation = function(){
    this.dom = document.createElement("div");
    this.dom.style.position = "absolute";
    this.dom.style.backgroundColor = "#222"    
    this.dom.style.color = "#eee"
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.padding = "20px";    
    this.dom.style.borderRadius = "10px";
    this.dom.style.opacity = "0.8";    
    document.body.appendChild( this.dom );
}

TaskInformation.prototype.show = function( isShown ){
    if( isShown ){
        this.dom.style.display = "flex";
    }else{
        this.dom.style.display = "none";
    }
}

TaskInformation.prototype.setPosition = function( align, x, y ){
    if( align == "LeftTop" ){
        this.dom.style.left = x;
        this.dom.style.top = y;
    }else if( align == "RightTop" ){
        this.dom.style.right = x;
        this.dom.style.top = y;
    }else if( align == "LeftBottom" ){
        this.dom.style.left = x;
        this.dom.style.bottom = y;
    }else if( align == "RightBottom" ){
        this.dom.style.right = x;
        this.dom.style.bottom = y;
    }
}

TaskInformation.prototype.setData = function( data ){
    this.clearData()

    for( let key in data )
    {
        let row = document.createElement("div");
        row.style.display = "flex";
        row.style.flexDirection = "row";     
        row.style.justifyContent = "space-between";

        let label = document.createElement("div");
        label.textContent = key;
        label.style.width = "180px";
        let value = document.createElement("div");
        value.textContent = data[key];
        
        row.appendChild( label );
        row.appendChild( value );
        this.dom.appendChild( row );
    }
}

TaskInformation.prototype.clearData = function(){
    while( this.dom.lastChild ){
        this.dom.removeChild( this.dom.lastChild );
    }
}

function hsvToRgb(H,S,V) {
    //https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV

    var C = V * S;
    var Hp = H / 60;
    var X = C * (1 - Math.abs(Hp % 2 - 1));

    var R, G, B;
    if (0 <= Hp && Hp < 1) {[R,G,B]=[C,X,0]};
    if (1 <= Hp && Hp < 2) {[R,G,B]=[X,C,0]};
    if (2 <= Hp && Hp < 3) {[R,G,B]=[0,C,X]};
    if (3 <= Hp && Hp < 4) {[R,G,B]=[0,X,C]};
    if (4 <= Hp && Hp < 5) {[R,G,B]=[X,0,C]};
    if (5 <= Hp && Hp < 6) {[R,G,B]=[C,0,X]};

    var m = V - C;
    [R, G, B] = [R+m, G+m, B+m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return [R ,G, B];
}