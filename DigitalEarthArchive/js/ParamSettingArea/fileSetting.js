
fileSetting = function()
{
    this.dom = document.createElement("div");
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";    
    this.dom.style.overflowY = "auto";

    // load project file
    this.projectFileInput = document.createElement("input");
    this.projectFileInput.type = "file";
    this.projectFileInput.style.width = "100%";
    this.projectFileInput.onchange = function(event){
        this.loadProjectFile(event.target.files);
    }.bind(this);

    // save project file
    this.saveProjectFileArea = document.createElement("div");
    this.fileNameInput = document.createElement("input");
    this.fileNameInput.type = "text";
    this.fileNameInput.style.width = "100%";
    this.downloader = document.createElement("a");
    this.downloader.href = "#";    
    this.downloader.textContent = "download project file";
    this.downloader.addEventListener("click", function (){
        this.downloadProjectFile();
    }.bind(this));
    this.saveProjectFileArea.appendChild(this.fileNameInput)
    this.saveProjectFileArea.appendChild(this.downloader)
        
    // create gui table
    this.table = new guiComponentTable();
    this.table.addRow( "Load", this.projectFileInput );
    this.table.addRow( "Save", this.saveProjectFileArea );
    this.dom.appendChild( this.table.getDom() );
}

fileSetting.prototype.getDom = function ()
{
    return this.dom;
}

fileSetting.prototype.loadProjectFile = function (files)
{
    if ( !files[0] ) return;

    let reader = new FileReader();    
    reader.readAsText(files[0]);
    reader.onload = function (e)
    {
        let projectData = JSON.parse( reader.result );
        console.log(projectData);

        let objDataList = projectData["dataList"]
        if( objDataList == null ) return;

        for( let i = 0; i < objDataList.length; ++i )
        {
            let objData = objDataList[i];
            let name = g_dataResistration.assignObjName(objData.type);
            if( objData.type == "BarGraph" )
            {
                let barGraph = new glObjectCube(g_webGLView)
                barGraph.attachShader("lighting");
                barGraph.setSelect( false );
                g_webGLView.addGLObject(name, barGraph);
            }   
            else if( objData.type == "Point" )
            {
                let point = new glObjectImage(g_webGLView)
                point.attachShader("image");
                point.setBillboardMode( true );    
                point.setSelect( false );
                g_webGLView.addGLObject(name, point);          
            }   
            else if( objData.type == "Arc" )
            {
                let arc = new glObjectArc(g_webGLView)
                arc.attachShader("arc");
                arc.setSelect( false );
                g_webGLView.addGLObject(name, arc);
            }
            else if( objData.type == "Line" )
            {
                let line = new glObjectLine(g_webGLView);
                let vertexPos = [];
                for( let i = 0; i < objData.vertices.length; ++i ){
                    let pos = [ objData.vertices[i][0], 0.0,  objData.vertices[i][1] ];
                    vertexPos.push( pos );
                }
                line.setPositions( vertexPos );            
                line.attachShader("line");
                line.setSelect( false );
                g_webGLView.addGLObject(name, line);        
            }   
            else if( objData.type == "Polygon" )
            {
                let polygon = new glObjectPolygon(g_webGLView);
                let vertexPos = [];
                let triangles = generatePolygon( objData.vertices );
                for( let i = 0; i < triangles.length; ++i ){
                    let v1 = [ triangles[i][0][0], 0.0, triangles[i][0][1] ];
                    let v2 = [ triangles[i][1][0], 0.0, triangles[i][1][1] ];
                    let v3 = [ triangles[i][2][0], 0.0, triangles[i][2][1] ];
                    vertexPos.push( v1 );
                    vertexPos.push( v2 );
                    vertexPos.push( v3 );            
                }
                polygon.setVertices( vertexPos );            
                polygon.attachShader("polygon");
                polygon.setSelect( false );
                g_webGLView.addGLObject(name, polygon);  
            }
            else
            {
                continue;
            }

            g_dataList[name] = objData;
            g_paramSet.addDataList( name );
            changeObjectParam( name );
        }

        let configData = projectData["configData"];
        if( configData == null ) return;
        g_paramSet.setTitle( configData.title );
        g_paramSet.addKeywords( configData.keywords );
        g_paramSet.setStartTime( configData.time.start );
        g_paramSet.setEndTime( configData.time.end );
        g_timeSlider.setCurrentDate( configData.time.current.year, 
                                     configData.time.current.month, 
                                     configData.time.current.date );
        g_timeSlider.setTimeSliderScale( configData.time.sliderScale );
        if( configData.time.period ){
            g_timeSlider.setDisplayPeriod(configData.time.period.value, configData.time.period.unit);
        }
    }        
}

fileSetting.prototype.downloadProjectFile = function ()
{
    if (this.fileNameInput.value === "")
    {
        window.confirm("Please enter the name of your project.");
        return;
    }

    let projectData = {};

    // data
    projectData["dataList"] = [];
    for( objName in g_dataList )
    {
        projectData["dataList"].push( g_dataList[objName] );
    }

    // config
    projectData["configData"] = {};    
    projectData["configData"].title = g_headerArea.getTitle();
    projectData["configData"].keywords = g_keywordFilter.getKeywordList();
    let time = {};
    time.current = g_timeSlider.getCurrentDate();  
    time.sliderScale = g_timeSlider.getTimeSliderScale();
    time.start = g_paramSet.getStartTime();
    time.end = g_paramSet.getEndTime();
    time.period = g_timeSlider.getDisplayPeriod();
    projectData["configData"].time = time;
    
    console.log( projectData );
    let data = JSON.stringify( projectData );

    let fileName = this.fileNameInput.value + ".json";
    var blob = new Blob([data], { "type": "text/plain" });
    if (window.navigator.msSaveBlob)
    {
        window.navigator.msSaveBlob(blob, fileName);
        window.navigator.msSaveOrOpenBlob(blob, fileName);
    }
    else
    {
        this.downloader.download = fileName;
        this.downloader.href = window.URL.createObjectURL(blob);
    }    
}