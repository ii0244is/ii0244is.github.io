

let RailwayLineData;
let TrainPosData;

let canvas;
let timeController;
let time = 0;
let timeUpdate = true;
let startIdxTime = 250; // 4:10; 

let mousePosX = 0;
let mousePosY = 0;
let isMouseDrag = false;
let offsetLon = 139.767125;
let offsetLat = 35.681236;
let scale = 3000;
let rects = [];
let selectedStation = "";
let selectedStationPos = {};
let selectedTrain = -1;
let selectedTrainPos = [];
let selectedRailway = "";
let rate = 0;
let colorList = [];

let zoomCenterX = 0;
let zoomCenterY = 0;
let zoomDistance = 0;
let zoomChange = false;

let debugMessage = "";

function appStart()
{
    function requestJsonData( fileName, callback )
    {
        let request = new window.XMLHttpRequest();
        request.open("GET", fileName, true);
        request.onreadystatechange = function(){
            if( request.readyState == 4 )
            {
                let data = JSON.parse( request.responseText );
                if( callback ) callback( data );
            }
        }
        request.send(null);   
    }

    requestJsonData( "RailwayData_20191019.json", (data) => {
        RailwayLineData = data;
        requestJsonData( "TrainPosData_20191019.json", (data) => {
            TrainPosData = data;
            initialize();
        } )        
    } )
}


function downloadJsonFile( fileName, data ){
    jsonData = JSON.stringify(data);
    var blob = new Blob([jsonData], { "type": "text/plain" });
    if (window.navigator.msSaveBlob){
        window.navigator.msSaveBlob(blob, fileName);
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    }else{
        downloader = document.createElement("a");
        downloader.href = "#";        
        downloader.download = fileName;
        downloader.href = window.URL.createObjectURL(blob);
        downloader.click();
    }    
}


/////////////////////////////////////////////////////////
// Draw Map
/////////////////////////////////////////////////////////

function initialize()
{
    let timer = null;
    canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    offsetLon = offsetLon - canvas.width / scale / 2;
    offsetLat = offsetLat + canvas.height / scale / 2;    

    timeController = new TimeInputSlider();
    timeController.setPosition( "20px", "20px", "calc( 100% - 200px )", "100px", "right-bottom" );
    timeController.setTimeRange( 4 * 60 * 60, 26 * 60 * 60 );
    document.body.appendChild( timeController.getDom() ); 
    timeController.resize();   
    timeController.onchange = ( t ) => {
        let h = t.hour;
        let m = t.min;
        let s = t.sec;
        time = h * 60 + m + s / 60 - startIdxTime;
    };

    playStopButtonArea = document.createElement("div");
    playStopButtonArea.style.position = "absolute";
    playStopButtonArea.style.left = "20px";
    playStopButtonArea.style.bottom = "20px"; 
    playStopButtonArea.style.width = "140px";
    playStopButtonArea.style.height = "100px";
    playStopButtonArea.style.fontSize = "60px";
    playStopButtonArea.style.borderRadius = "15px";    
    playStopButtonArea.style.backgroundColor = "#44a";
    playStopButtonArea.style.color = "#eee";
    playStopButtonArea.style.margin = "auto";
    playStopButtonArea.style.cursor = "pointer";
    playStopButton = document.createElement("div");
    playStopButton.style.display = "flex";
    playStopButton.style.flexDirection = "row";
    playStopButton.style.justifyContent = "center";
    playStopButton.style.alignItems = "center";
    playStopButton.style.width = "100%";
    playStopButton.style.height = "100%";    
    playStopButton.onclick = () => {
        if( !timeUpdate ){
            timeUpdate = true; 
            playStopButtonLabel.textContent = "■";
        }else{
            timeUpdate = false;
            playStopButtonLabel.textContent = "▶";
        }
    }   
    playStopButtonLabel = document.createElement("div");
    playStopButtonLabel.textContent = "■";
    playStopButton.appendChild( playStopButtonLabel );
    playStopButtonArea.appendChild( playStopButton );
    document.body.appendChild( playStopButtonArea ); 

    function click( x, y ){
        let name = hitTest( x, y );
        if( name.match( "train" ) ){
            rate = 0;
            selectedTrain = name.slice( 6 );
            selectedTrainPos = [];
            selectedStation = "";
            selectedStationPos = {};
            selectedRailway = "";
        }else{
            rate = 0;
            selectedTrain = -1;
            selectedTrainPos = [];
            selectedStation = name;
            selectedStationPos = {};
            selectedRailway = "";
        }
        if( name === "" ){
            isMouseDrag = true;
        }        
    }

    canvas.onmousedown = (event) => {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        mousePosX = x;
        mousePosY = y;
        click( x, y );
        draw();
    }

    canvas.onmousemove = (event) => {
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY; 
        
        if( isMouseDrag ){
            offsetLon += ( mousePosX - x ) / scale;
            offsetLat -= ( mousePosY - y ) / scale;
        }
        
        mousePosX = x;
        mousePosY = y;
    }

    canvas.onmouseup = (event) => {
        isMouseDrag = false;
    }

    canvas.onmousewheel = (event) => {
        event.preventDefault();
        let currentPosX = offsetLon + mousePosX / scale;
        let currentPosY = offsetLat - mousePosY / scale;
        let width = canvas.width;        
        let newRange = ( width / scale ) * ( 1 - event.wheelDelta * 0.001 );
        let val = width / newRange;
        if( 0 < val ){
            scale = val;
            offsetLon = currentPosX - mousePosX / scale;
            offsetLat = currentPosY + mousePosY / scale;            
        }
    }

    function touchMove( event ){
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        if( isMouseDrag ){
            offsetLon += ( mousePosX - x ) / scale;
            offsetLat -= ( mousePosY - y ) / scale;
        }
        mousePosX = x;
        mousePosY = y;
    }

    function touchZoomStart( event ){
        let touches = event.changedTouches;
		let x1 = touches[0].pageX;
		let y1 = touches[0].pageY;
		let x2 = touches[1].pageX;
        let y2 = touches[1].pageY;
        zoomCenterX = ( x1 + x2 ) / 2;
        zoomCenterY = ( y1 + y2 ) / 2;        
        zoomDistance = Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) );
        zoomChange = true;
    }

    function touchZoom( event ){

        if( !zoomChange ){
            touchZoomStart( event );
        }

        let touches = event.changedTouches;
		let x1 = touches[0].pageX;
		let y1 = touches[0].pageY;
		let x2 = touches[1].pageX;
		let y2 = touches[1].pageY;
        let distance = Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) );

        let currentPosX = offsetLon + zoomCenterX / scale;
        let currentPosY = offsetLat - zoomCenterY / scale;
        let val = scale * distance / zoomDistance;
        if( 0 < val ){
            scale = val;
            offsetLon = currentPosX - zoomCenterX / scale;
            offsetLat = currentPosY + zoomCenterY / scale;            
        }       
        zoomDistance = distance; 
    }

    canvas.ontouchstart = (event) => {
        event.preventDefault();

        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        if( !x ){
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        mousePosX = x;
        mousePosY = y;
        click( x, y );     
        draw();
    }

    canvas.ontouchmove = (event) => {
        event.preventDefault();
        let touches = event.changedTouches;
        if( touches.length === 1 ){
            touchMove( event );
        }else if( touches.length >= 2 ){
            touchZoom( event );
        }
    }
    
    canvas.ontouchend = (event) => {
        isMouseDrag = false;
        zoomChange = false;
    }    

    for ( let i in RailwayLineData ){
        let color = "";
        if( "color" in RailwayLineData[i] ){
            color = RailwayLineData[i].color;
        }else{
            let r = ( Math.floor( Math.random() * 160 + 80 ) ).toString(16);
            let g = ( Math.floor( Math.random() * 160 + 80 ) ).toString(16);
            let b = ( Math.floor( Math.random() * 160 + 80 ) ).toString(16);
            color = "#" + r + g + b;
        }
        colorList.push( color );
    }

    window.onresize = () =>{
        canvas.width  = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        timeController.resize();
    }

    draw();
    timer = setInterval( update, 30 );
}

function update(){

    let realTime = time + startIdxTime;
    let h = Math.floor( realTime / 60 );
    let m = Math.floor( realTime % 60 );
    let s = Math.floor( ( realTime - Math.floor( realTime ) ) * 60 );
    timeController.setTime( h, m, s );

    if( timeUpdate ){
        time += 0.01;
    }

    if( time >= 22 * 60 ){
        time = 0;
    }

    if( selectedTrainPos.length >= 1 ){
        let lon = 0;
        let lat = 0;
        for( let i in selectedTrainPos ){
            lon += selectedTrainPos[i].lon;
            lat += selectedTrainPos[i].lat;            
        }
        targetLon = lon / selectedTrainPos.length - canvas.width / scale / 2;
        targetLat = lat / selectedTrainPos.length + canvas.height / scale / 2;
        if( rate >= 1 ){
            offsetLon = targetLon;
            offsetLat = targetLat;
        }else{
            offsetLon = lerp( offsetLon, targetLon, rate );
            offsetLat = lerp( offsetLat, targetLat, rate );
            rate += 0.025;
            if( rate > 1 ){
                rate = 1;
            }            
        }
    }else if( selectedStation !== "" ){
        let targetLon = selectedStationPos.lon - canvas.width / scale / 2;
        let targetLat = selectedStationPos.lat + canvas.height / scale / 2;
        offsetLon = lerp( offsetLon, targetLon, rate );
        offsetLat = lerp( offsetLat, targetLat, rate );
        rate += 0.025;
        if( rate > 1 ){
            rate = 1;
        }               
    }

    draw();
}

function draw()
{
    rects = [];
    drawBackground();
    drawRailwayLines();
    drawStations();
    drawTrains();
    drawStationInfo();
    drawRailwayInfo();
    // drawDebugMessage();
}

function drawBackground()
{
    let ctx =  canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;   
    ctx.fillStyle = "rgb( 30, 30, 30 )";
    ctx.fillRect( 0, 0, width, height );       
}

function drawRailwayLines()
{
    let ctx =  canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;   

    function drawLine( ctx, sx, sy, dx, dy, color ){
        if( !( 0 < sx && sx < width && 0 < sy && sy < height ) ){
            if( !( 0 < dx && dx < width && 0 < dy && dy < height ) ){
                return;
            }
        }
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(sx,sy);
        ctx.lineTo(dx,dy);
        ctx.closePath();
        ctx.stroke();
    }

    let count = 0;
    for( let i in RailwayLineData ){
        let railway = RailwayLineData[i];
        let lineVertices = railway.lineVertices;
        let lastPos = {};
        for( let j = 0; j < lineVertices.length; ++j ){

            let lon = Number( lineVertices[j][0] );
            let lat = Number( lineVertices[j][1] );
            if( j === 0 ){
                lastPos.lon = lon;
                lastPos.lat = lat;
                continue;
            }

            let startPos = convertPosition( lastPos.lon, lastPos.lat );
            let stopPos = convertPosition( lon, lat );
            drawLine( ctx, startPos.x, startPos.y, stopPos.x, stopPos.y, colorList[count] );
            lastPos.lon = lon;
            lastPos.lat = lat;
        }
        ++count;
    }
}

function drawStations()
{
    let ctx =  canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;  
    
    let stationSize = 4000 / scale;
    stationSize = Math.max( 0.5, stationSize );
    stationSize = Math.min( 3, stationSize );        
    let size = scale * 0.0012 * stationSize;    

    for( let i in RailwayLineData ){
        let railway = RailwayLineData[i];
        let stations = railway.stations;
        for( let j in stations ){
            let lon = stations[j].lon;
            let lat = stations[j].lat;
            let p = convertPosition( lon, lat );
            if( p.x < 0 || width < p.x || p.y < 0 || height < p.y ){
                continue;
            }
            let x = p.x - size / 2;
            let y = p.y - size / 2;
            let w = size;
            let h = size;
            let name = stations[j].nameEn;
            if( selectedStation === name ){
                ctx.fillStyle = "rgb( 255, 120, 120 )";     
                x -= 5;
                y -= 5;
                w += 10;
                h += 10;             
                selectedStationPos = { lon, lat };
            }else{
                ctx.fillStyle = "rgb( 200, 10, 10 )";     
            }
            ctx.fillRect( x, y, w, h );
            x -= 5;
            y -= 5;
            w += 10;
            h += 10;               
            rects.push( { name, x, y, w, h } );
        }
    }
}

function drawTrains()
{
    let ctx =  canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;       

    let trainSize = 5000 / scale;
    trainSize = Math.max( 0.25, trainSize );
    trainSize = Math.min( 5, trainSize );        
    let size = scale * 0.001 * trainSize;
    selectedRailway = "";

    for( let i in TrainPosData ){
        let railwayName = TrainPosData[i].railway;
        let positions = TrainPosData[i].positions;
        let startTime = TrainPosData[i].startTime;
        let stopTime  = TrainPosData[i].stopTime;
        if( !( startTime <= time && time < stopTime ) ) {
            continue;
        }

        let t = time - startTime;
        let timeInteger = Math.floor( t );
        let timeDecimal = t - timeInteger;
  
        let srcIdx = positions[timeInteger];
        let dstIdx = positions[timeInteger+1];        
        let currentIdx = srcIdx + ( dstIdx - srcIdx ) * timeDecimal;

        let currentIdxInt = Math.floor( currentIdx );
        let currentIdxDec = currentIdx - currentIdxInt;
        let pos1 = getRailwayLinePos( railwayName, currentIdxInt );
        let lon1 = Number( pos1[0] );
        let lat1 = Number( pos1[1] );
        let p1 = convertPosition( lon1, lat1 );
        if( p1.x < 0 || width < p1.x || p1.y < 0 || height < p1.y ){
            if( i !== selectedTrain ){
                continue;
            }
        }
        let pos2 = getRailwayLinePos( railwayName, currentIdxInt+1 );
        let lon2 = Number( pos2[0] );
        let lat2 = Number( pos2[1] );
        let p2 = convertPosition( lon2, lat2 );

        let vecX = p2.x - p1.x;
        let vecY = p2.y - p1.y;
        let norX = -vecY;
        let norY = vecX; 
        if( TrainPosData[i].direction === "dec" ){
            norX = vecY;
            norY = -vecX; 
        }
        let absVec = Math.sqrt( norX * norX + norY * norY );
        if( absVec != 0 ){
            norX /= absVec;       
            norY /= absVec;
        }
        let lon = lon1 + ( lon2 - lon1 ) * currentIdxDec;
        let lat = lat1 + ( lat2 - lat1 ) * currentIdxDec;
        let p = convertPosition( lon, lat );
        let x = p.x - size / 2 + norX * scale * 0.0006 * trainSize;
        let y = p.y - size / 2 + norY * scale * 0.0006 * trainSize;        
        let w = size;
        let h = size;
        let name = "train_" + i;
        if( i === selectedTrain ){
            ctx.beginPath();       
            let radius = scale * 0.006;  
            radius = Math.max( radius, 20 );
            radius = Math.min( radius, 300 ); 
            ctx.arc( x+w/2, y+h/2, radius, 0, 2 * Math.PI, false ) ;
            ctx.fillStyle = "rgba( 225, 220, 60, 0.4)" ;            
            ctx.fill() ;            
            ctx.fillStyle = "rgb( 250, 250, 120 )";  
            if( selectedTrainPos.length >= 10 ){
                selectedTrainPos.shift();
                selectedTrainPos.push( { lon, lat } );
            }else{
                selectedTrainPos.push( { lon, lat } );
            }
            selectedRailway = railwayName.replace("."," ");
        }else{
            ctx.fillStyle = "rgb( 220, 220, 60 )";  
        }
        ctx.fillRect( x, y, w, h );
        x -= 10; 
        y -= 10;
        w += 20;
        h += 20;
        rects.push( { name, x, y, w, h } );        
    }
}

function drawStationInfo()
{
    if( selectedStation === "" ){
        return;
    }

    let ctx = canvas.getContext("2d");
    ctx.font = "28px Arial Black";
    ctx.fillStyle = "rgb( 200, 200, 200 )";
    let info = selectedStation;
    ctx.fillText( info, 20, 50 );  
}

function drawRailwayInfo()
{
    if( selectedRailway === "" ){
        return;
    }

    let ctx = canvas.getContext("2d");
    ctx.font = "28px Arial Black";
    ctx.fillStyle = "rgb( 200, 200, 200 )";
    let info = selectedRailway;
    ctx.fillText( info, 20, 50 );  
}

function drawDebugMessage()
{
    let ctx = canvas.getContext("2d");
    ctx.font = "28px Arial Black";
    ctx.fillStyle = "rgb( 200, 200, 200 )";
    ctx.fillText( debugMessage, 20, 150 );  
}

function convertPosition( lon, lat )
{
    let x = ( lon - offsetLon ) * scale;
    let y = ( -lat + offsetLat ) * scale;    
    return { x, y };
}

function hitTest( x, y )
{
    let name = "";
    for( let i in rects ){
        let r = rects[i];
        if( r.x < x && x < r.x +r.w && r.y < y && y < r.y + r.h ){
            name = r.name;
        }
    }
    return name;
}

function getRailwayLinePos( railwayName, idx )
{
    let railway;
    for( let i in RailwayLineData ){
        if( railwayName === RailwayLineData[i].name ){
            railway = RailwayLineData[i];
            break;
        }
    }

    let i = idx;
    if( idx < 0 ){
        i = 0;
    }    
    if( idx > railway.lineVertices.length-1 ){
        i = railway.lineVertices.length-1;
    }
    return railway.lineVertices[i];
}

function lerp( v1, v2, r ){
    return v1 + ( v2 - v1 ) * r;
}