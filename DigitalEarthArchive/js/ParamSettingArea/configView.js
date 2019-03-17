
configView = function ()
{
    this.dom = document.createElement("div");
    this.dom.style.width = "100%";
    this.dom.style.height = "100%";    
    this.dom.style.overflowY = "auto";

    this.createDom();
    this.setupEvent();
    this.updateTime();    
}

configView.prototype.getDom = function ()
{
    return this.dom;
}

configView.prototype.setTitle = function ( title )
{
    this.titleInput.value = title;
    g_headerArea.setTitle( title );
}

configView.prototype.addKeywords = function ( list )
{
    for( let i = 0; i < list.length; ++i ){
        if( !g_keywordFilter.isExist( list[i] ) ){
            this.keywordList.add( new Option( list[i], list[i] ) );            
            g_keywordFilter.add(list[i]);   
        }
    }
}

configView.prototype.getStartTime = function ()
{
    return this.startTime.value;
}

configView.prototype.setStartTime = function ( time )
{
    this.startTime.value = time;
    this.updateTime(); 
}

configView.prototype.getEndTime = function ()
{
    return this.endTime.value;
}

configView.prototype.setEndTime = function ( time )
{
    this.endTime.value = time;
    this.updateTime(); 
}


///////////////////////////////////////////////////////////////
// local function
///////////////////////////////////////////////////////////////

configView.prototype.createDom = function ()
{
    // title
    this.titleInput = document.createElement("input");
    this.titleInput.type = "text";
    this.titleInput.style.width = "100%";
    this.titleInput.value = "Data Visualization";

    // keyword
    this.keywordArea = document.createElement("div")
    this.keywordArea.style.display = "flex";
    this.keywordArea.style.flexDirection = "column";      
    this.newKeywordInputArea = document.createElement("div")
    this.newKeywordInputArea.style.display = "flex";
    this.newKeywordInputArea.style.flexDirection = "row";
    this.newKeywordInputArea.style.justifyContent = "space-between";
    this.newKeywordLabel = document.createElement("div")
    this.newKeywordLabel.textContent = "register keyword";
    this.newKeywordInput = document.createElement("input")
    this.newKeywordInput.type = "text";
    this.newKeywordAddButton = document.createElement("input")
    this.newKeywordAddButton.type = "button";
    this.newKeywordAddButton.value = "add";    
    this.newKeywordInputArea.appendChild(this.newKeywordLabel);
    this.newKeywordInputArea.appendChild(this.newKeywordInput);
    this.newKeywordInputArea.appendChild(this.newKeywordAddButton);
    this.keywordList = document.createElement("select")
    this.keywordList.multiple = true;
    this.keywordList.style.height = "180px";
    this.keywordList.style.margin = "5px 0px 5px 0px";
    this.keywordDeleteButton = document.createElement("input")
    this.keywordDeleteButton.type = "button";
    this.keywordDeleteButton.value = "delete";
    this.keywordDeleteButton.style.width = "100px";
    this.keywordArea.appendChild(this.newKeywordInputArea);    
    this.keywordArea.appendChild(this.keywordList);
    this.keywordArea.appendChild(this.keywordDeleteButton);
    
    // time slider
    this.timeSliderArea = document.createElement("div");
    this.timeSliderArea.style.display = "flex";
    this.timeSliderArea.style.flexDirection = "column";
    this.startTimeArea = document.createElement("div");
    this.startTimeArea.style.paddingBottom = "5px";
    this.startTimeLabel = document.createElement("div");
    this.startTimeLabel.textContent = "Begin";
    this.startTimeLabel.style.float = "left";    
    this.startTimeLabel.style.width = "60px";    
    this.startTime = document.createElement("input");
    this.startTime.type = "date";
    this.startTime.value = "1950-01-01";
    this.startTime.style.float = "left";    
    this.startTime.style.width = "calc( 100% - 60px )";  
    this.startTimeArea.appendChild( this.startTimeLabel );
    this.startTimeArea.appendChild( this.startTime );
    this.endTimeArea = document.createElement("div");
    this.endTimeArea.style.paddingBottom = "5px";
    this.endTimeLabel = document.createElement("div");
    this.endTimeLabel.textContent = "End";
    this.endTimeLabel.style.float = "left";    
    this.endTimeLabel.style.width = "60px";    
    this.endTime = document.createElement("input");
    this.endTime.type = "date";
    this.endTime.value = "2049-12-31";
    this.endTime.style.float = "left";  
    this.endTime.style.width = "calc( 100% - 60px )";  
    this.endTimeArea.appendChild( this.endTimeLabel );
    this.endTimeArea.appendChild( this.endTime );
    // this.periodArea = document.createElement("div");
    // this.periodArea.style.display = "flex";
    // this.periodArea.style.flexDirection = "row";
    // this.periodLabelArea = document.createElement("div");
    // this.periodLabelArea.style.display = "flex";
    // this.periodLabelArea.style.flexDirection = "row";
    // this.periodLabelArea.style.alignItems = "center";
    // this.periodLabel = document.createElement("div");
    // this.periodLabel.textContent = "Period";    
    // this.periodLabel.style.width = "60px";    
    // this.periodLabelArea.appendChild(this.periodLabel);        
    // this.periodParamArea = document.createElement("div"); 
    // this.periodParamArea.style.width = "calc(100% - 60px)";
    // this.periodParamArea.style.display = "flex";
    // this.periodParamArea.style.flexDirection = "column";
    // this.periodYearArea = document.createElement("div");
    // this.periodYear = document.createElement("input");
    // this.periodYear.type = "number";    
    // this.periodYear.min = "0";    
    // this.periodYear.step = "1";
    // this.periodYear.style.width = "80px";
    // this.periodYear.style.float = "left";    
    // this.periodYearUnit = document.createElement("div");
    // this.periodYearUnit.textContent = "years"; 
    // this.periodYearUnit.style.float = "left";
    // this.periodYearUnit.style.marginLeft = "5px";    
    // this.periodYearArea.appendChild( this.periodYear );
    // this.periodYearArea.appendChild( this.periodYearUnit );
    // this.periodMonthArea = document.createElement("div");
    // this.periodMonth = document.createElement("input");
    // this.periodMonth.type = "number";    
    // this.periodMonth.min = "0";    
    // this.periodMonth.step = "1";
    // this.periodMonth.style.width = "80px";
    // this.periodMonth.style.float = "left";    
    // this.periodMonthUnit = document.createElement("div");
    // this.periodMonthUnit.textContent = "months"; 
    // this.periodMonthUnit.style.float = "left";
    // this.periodMonthUnit.style.marginLeft = "5px";   
    // this.periodMonthArea.appendChild( this.periodMonth );
    // this.periodMonthArea.appendChild( this.periodMonthUnit );
    // this.periodDateArea = document.createElement("div");
    // this.periodDate = document.createElement("input");
    // this.periodDate.type = "number";    
    // this.periodDate.min = "1";    
    // this.periodDate.step = "1";
    // this.periodDate.style.width = "80px";
    // this.periodDate.style.float = "left";    
    // this.periodDateUnit = document.createElement("div");
    // this.periodDateUnit.textContent = "days"; 
    // this.periodDateUnit.style.float = "left";
    // this.periodDateUnit.style.marginLeft = "5px"; 
    // this.periodDateArea.appendChild( this.periodDate );
    // this.periodDateArea.appendChild( this.periodDateUnit );
    // this.periodParamArea.appendChild( this.periodYearArea );
    // this.periodParamArea.appendChild( this.periodMonthArea );
    // this.periodParamArea.appendChild( this.periodDateArea );
    // this.periodArea.appendChild( this.periodLabelArea );    
    // this.periodArea.appendChild( this.periodParamArea );
    this.timeSliderArea.appendChild( this.startTimeArea );
    this.timeSliderArea.appendChild( this.endTimeArea );
    // this.timeSliderArea.appendChild( this.periodArea );
    
    // create gui table
    this.table = new guiComponentTable();
    this.table.addRow( "Title", this.titleInput );
    this.table.addRow( "Keyword Filter", this.keywordArea );
    this.table.addRow( "Time Filter", this.timeSliderArea );
    this.dom.appendChild( this.table.getDom() );
}

configView.prototype.setupEvent = function ()
{
    this.titleInput.onchange = function(){
        g_headerArea.setTitle(this.titleInput.value);
    }.bind(this);

    this.newKeywordAddButton.onclick = function(){
        let newKeyword = this.newKeywordInput.value;
        if( newKeyword != "" ){
            this.keywordList.add( new Option( newKeyword, newKeyword ) );
            g_keywordFilter.add(newKeyword);            
            this.newKeywordInput.value = "";
        }
    }.bind(this);

    this.keywordDeleteButton.onclick = function(){
        for( let i = 0; i < this.keywordList.options.length; ++i ){
            if( this.keywordList.options[i].selected == true ){
                g_keywordFilter.delete(this.keywordList.options[i].value);                
                this.keywordList.removeChild( this.keywordList.options[i] );
            }
        }
    }.bind(this);

    this.startTime.onchange = function(){
        this.updateTime();        
    }.bind(this);

    this.endTime.onchange = function(){
        this.updateTime();
    }.bind(this);

    function calcSec( y, m, d ){
        let min   = 60;
        let hour  = 60 * min   
        let day   = 24 * hour;    
        let month = 30 * day; 
        let year  = 12 * month; 
        return y * year + m * month + d * day;
    }

    // this.periodYear.onchange = function(){
    //     let y = Number(this.periodYear.value);
    //     let m = Number(this.periodMonth.value);
    //     let d = Number(this.periodDate.value);
    //     g_timeSlider.setPeriod( calcSec( y, m, d ) );  
    // }.bind(this);

    // this.periodMonth.onchange = function(){
    //     let y = Number(this.periodYear.value);
    //     let m = Number(this.periodMonth.value);
    //     let d = Number(this.periodDate.value);
    //     g_timeSlider.setPeriod( calcSec( y, m, d ) );  
    // }.bind(this);

    // this.periodDate.onchange = function(){
    //     let y = Number(this.periodYear.value);
    //     let m = Number(this.periodMonth.value);
    //     let d = Number(this.periodDate.value);
    //     g_timeSlider.setPeriod( calcSec( y, m, d ) );  
    // }.bind(this);
}

configView.prototype.updateTime = function ()
{
    let start = {};
    let end = {};  
    start.year   = Number( this.startTime.value.substr(0, 4) );
    start.month  = Number( this.startTime.value.substr(5, 2) );
    start.day    = Number( this.startTime.value.substr(8, 2) );   
    end.year     = Number( this.endTime.value.substr(0, 4) );
    end.month    = Number( this.endTime.value.substr(5, 2) );
    end.day      = Number( this.endTime.value.substr(8, 2) );
    g_timeSlider.setBeginAndEndDate( start, end );
}