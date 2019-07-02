
function appStart()
{
    let inputPicture = new Image();
    let canvasSize = 500;
    let transformAreaPointer = {
        leftTop     : { position : { x:50,  y:50  }, isMoving : false },
        rightTop    : { position : { x:450, y:50  }, isMoving : false },
        leftBottom  : { position : { x:50,  y:450 }, isMoving : false },
        rightBottom : { position : { x:450, y:450 }, isMoving : false },
    }
    let pointerSize = 16;
    let mousePosX = 0;
    let mousePosY = 0;
    let hMat = { 
        h11 : 0, h12 : 0, h13 : 0, 
        h21 : 0, h22 : 0, h23 : 0, 
        h31 : 0, h32 : 0, h33 : 1, 
    }

    let TitleArea = document.getElementById("TitleArea");
    let PictureInputArea = document.getElementById("PictureInputArea");
    let OutputArea = document.getElementById("OutputArea");

    let titleText = document.createElement("div");
    titleText.textContent = "Homograpgy Transform";
    titleText.style.fontSize = "36px";
    TitleArea.appendChild( titleText );

    let inputPictureSetting = document.createElement("div");
    inputPictureSetting.style.display = "flex";
    inputPictureSetting.style.flexDirection = "column";    
    let fileInput = document.createElement("input");
    fileInput.type = "file";
    let transformButton = document.createElement("button");
    transformButton.textContent = "Transform";
    transformButton.style.margin = "10px 0px 10px 0px";
    inputPictureSetting.appendChild( fileInput );
    inputPictureSetting.appendChild( transformButton );
    let pictureCanvas = document.createElement("canvas");
    pictureCanvas.style.width = canvasSize + "px";
    pictureCanvas.style.height = canvasSize + "px";
    pictureCanvas.style.border = "1px solid #555";
    pictureCanvas.style.borderStyle = "solid";    
    pictureCanvas.width = canvasSize;
    pictureCanvas.height = canvasSize;
    PictureInputArea.appendChild( inputPictureSetting );
    PictureInputArea.appendChild( pictureCanvas );

    let homograpgyOutputSetting = document.createElement("div");
    homograpgyOutputSetting.style.display = "flex";
    homograpgyOutputSetting.style.flexDirection = "column";
    let fileNameInput = document.createElement("input");
    let downloadButton = document.createElement("a");
    downloadButton.href = "#";
    downloadButton.textContent = "Download";
    let homograpgyCanvas = document.createElement("canvas");
    homograpgyCanvas.style.width = canvasSize + "px";
    homograpgyCanvas.style.height = canvasSize + "px";
    homograpgyCanvas.style.border = "1px solid #555";
    homograpgyCanvas.style.borderStyle = "solid";    
    homograpgyCanvas.width = canvasSize;
    homograpgyCanvas.height = canvasSize;
    homograpgyOutputSetting.appendChild( fileNameInput );
    homograpgyOutputSetting.appendChild( downloadButton );
    OutputArea.appendChild( homograpgyCanvas );    
    OutputArea.appendChild( homograpgyOutputSetting );    

    fileInput.onchange = function(e){
        if ( !e.target.files[0] ) return;
        let reader = new FileReader();    
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function (e){
            inputPicture.src = reader.result;
        }
    }

    inputPicture.onload = function (){
        drawInputPictureCanvas();
    }

    transformButton.onclick = function(){
        calcHomograpgy();
        drawOutputImage();
    }

    pictureCanvas.onmousedown = function (e){
        mouseDrag = true;
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        for( let i in transformAreaPointer ){
            let mousePoint = { x:x, y:y };
            let pointer = transformAreaPointer[i].position;
            let rect = {
                left   : pointer.x - pointerSize / 2,   
                top    : pointer.y - pointerSize / 2,   
                right  : pointer.x + pointerSize / 2,   
                bottom : pointer.y + pointerSize / 2,   
            }            
            if( isInRect( mousePoint, rect ) ){
                transformAreaPointer[i].isMoving = true;
                mousePosX = x;
                mousePosY = y;        
                break;
            }
        }
    }

    pictureCanvas.onmousemove = function (e){
        let x = event.offsetX || event.layerX;
        let y = event.offsetY || event.layerY;
        for( let i in transformAreaPointer ){
            if( transformAreaPointer[i].isMoving ){
                let diffX = x - mousePosX;
                let diffY = y - mousePosY;
                transformAreaPointer[i].position.x += diffX;
                transformAreaPointer[i].position.y += diffY;
                mousePosX = x;
                mousePosY = y;    
                drawInputPictureCanvas();
                break;
            }
        }
    }

    pictureCanvas.onmouseup = function (e){
        for( let i in transformAreaPointer ){
            transformAreaPointer[i].isMoving = false;
        }        
    }    

    pictureCanvas.onmouseout = function (e){
        for( let i in transformAreaPointer ){
            transformAreaPointer[i].isMoving = false;
        }        
    }        

    downloadButton.onclick = function(){
        if( fileNameInput.value == "" ){
            return;
        }
        saveCanvasImage();
    }

    function isInRect( point, rect ){
        return( 
            rect.left <= point.x && point.x <= rect.right &&
            rect.top  <= point.y && point.y <= rect.bottom 
        );
    }

    function drawLine( ctx, start, stop ){
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(stop.x, stop.y);
        ctx.stroke();
    }

    function drawInputPictureCanvas(){
        let ctx = pictureCanvas.getContext("2d");
        ctx.drawImage( inputPicture, 0, 0, canvasSize, canvasSize );
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(240, 40, 40)";
        drawLine( ctx, transformAreaPointer.leftTop.position, transformAreaPointer.rightTop.position );
        drawLine( ctx, transformAreaPointer.leftTop.position, transformAreaPointer.leftBottom.position );
        drawLine( ctx, transformAreaPointer.rightBottom.position, transformAreaPointer.rightTop.position );
        drawLine( ctx, transformAreaPointer.rightBottom.position, transformAreaPointer.leftBottom.position );
        for( let i in transformAreaPointer ){
            let point = transformAreaPointer[i].position;
            let pointerX = point.x - pointerSize / 2;   
            let pointerY = point.y - pointerSize / 2;     
            ctx.fillStyle = "rgb(240, 100, 100)";
            ctx.fillRect( pointerX, pointerY, pointerSize, pointerSize );   
        }
    }

    function calcHomograpgy()
    {
        let leftTopX     = transformAreaPointer.leftTop.position.x     / canvasSize;
        let leftTopY     = transformAreaPointer.leftTop.position.y     / canvasSize;
        let leftBottomX  = transformAreaPointer.leftBottom.position.x  / canvasSize;
        let leftBottomY  = transformAreaPointer.leftBottom.position.y  / canvasSize;
        let rightTopX    = transformAreaPointer.rightTop.position.x    / canvasSize;
        let rightTopY    = transformAreaPointer.rightTop.position.y    / canvasSize;
        let rightBottomX = transformAreaPointer.rightBottom.position.x / canvasSize;
        let rightBottomY = transformAreaPointer.rightBottom.position.y / canvasSize;
    
        let sx  = leftTopX - leftBottomX + rightBottomX - rightTopX;
        let sy  = leftTopY - leftBottomY + rightBottomY - rightTopY;
        let dx1 = leftBottomX - rightBottomX;
        let dx2 = rightTopX   - rightBottomX;
        let dy1 = leftBottomY - rightBottomY;
        let dy2 = rightTopY   - rightBottomY;
    
        hMat.h31 = (sx * dy1 - sy * dx1) / (dy1 * dx2 - dx1 * dy2);
        hMat.h32 = (sy * dx2 - sx * dy2) / (dy1 * dx2 - dx1 * dy2);
        hMat.h11 = rightTopX   * hMat.h31 - leftTopX + rightTopX;
        hMat.h12 = leftBottomX * hMat.h32 - leftTopX + leftBottomX;
        hMat.h13 = leftTopX;
        hMat.h21 = rightTopY   * hMat.h31 - leftTopY + rightTopY;
        hMat.h22 = leftBottomY * hMat.h32 - leftTopY + leftBottomY;
        hMat.h23 = leftTopY;
    }

    function drawOutputImage()
    {
        let tempCanvas = document.createElement("canvas");
        tempCanvas.style.width = canvasSize + "px";
        tempCanvas.style.height = canvasSize + "px";
        tempCanvas.width = canvasSize;
        tempCanvas.height = canvasSize;
        let tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage( inputPicture, 0, 0, canvasSize, canvasSize );
        let srcData =tempCtx.getImageData( 0, 0, canvasSize, canvasSize );
        let ctx = homograpgyCanvas.getContext("2d");
        let dstData = ctx.createImageData( canvasSize, canvasSize );
                
        for( let y = 0; y < canvasSize; ++y ){
            for( let x = 0; x < canvasSize; ++x ){
                let u_dst = x / canvasSize;
                let v_dst = y / canvasSize;
                let X = hMat.h11 * u_dst + hMat.h12 * v_dst + hMat.h13;
                let Y = hMat.h21 * u_dst + hMat.h22 * v_dst + hMat.h23;
                let Z = hMat.h31 * u_dst + hMat.h32 * v_dst + hMat.h33;
                let u_src = X / Z * canvasSize;
                let v_src = Y / Z * canvasSize;
                let srcIndex = ( canvasSize * Math.floor(v_src) +  Math.floor(u_src) ) * 4;
                let dstIndex = ( canvasSize * y + x ) * 4;
                if (0 < u_src && u_src < canvasSize && 0 < v_src && v_src < canvasSize) {
                    dstData.data[dstIndex + 0] = srcData.data[srcIndex + 0];
                    dstData.data[dstIndex + 1] = srcData.data[srcIndex + 1];
                    dstData.data[dstIndex + 2] = srcData.data[srcIndex + 2];
                    dstData.data[dstIndex + 3] = srcData.data[srcIndex + 3];
                }
            }
        }

        ctx.fillStyle = "rgb(190, 190, 190)";
        ctx.fillRect( 0, 0, canvasSize, canvasSize );   
        ctx.putImageData( dstData, 0, 0 );
    }

    function saveCanvasImage(){
        let imageType = "image/png";
        let fileName = fileNameInput.value + ".png";
        let base64 = homograpgyCanvas.toDataURL(imageType);
        let blob = Base64toBlob(base64);
        saveBlob(blob, fileName);
    }

    function Base64toBlob(base64)
    {
        let tmp = base64.split(',');
        let data = atob(tmp[1]);
    	let mime = tmp[0].split(':')[1].split(';')[0];
    	let buf = new Uint8Array(data.length);
    	for (var i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
    	let blob = new Blob([buf], { type: mime });
        return blob;
    }

    function saveBlob(blob, fileName)
    {
        if (window.navigator.msSaveBlob){
            window.navigator.msSaveBlob(blob, fileName);
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }else{
            downloadButton.download = fileName;
            downloadButton.href = window.URL.createObjectURL(blob);
        }    
    }    
}