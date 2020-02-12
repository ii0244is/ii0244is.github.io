
let DateInput = function()
{
    this.dom = document.createElement("div");
    this.dom.style.display = "flex";
    this.dom.style.flexDirection = "column";
    this.dom.style.width = "280px";

    this.yearInputArea = document.createElement("div");
    this.yearInputArea.style.display = "flex";
    this.yearInputArea.style.flexDirection = "row";
    this.yearInputArea.style.alignItems = "center";
    this.yearInputArea.style.justifyContent = "space-between";

    this.yearLabel = document.createElement("div");
    this.yearLabel.textContent = "Year";

    this.yearInputs = document.createElement("div");
    this.yearInputs.style.display = "flex";
    this.yearInputs.style.flexDirection = "row";
    this.yearInputs.style.alignItems = "center";
    this.ADBCSelect = document.createElement("select");
    this.ADBCSelect.style.borderRadius = "5px";  
    this.ADBCSelect.style.padding = "4px 5px 4px 5px";   
    this.ADBCSelect.style.border = "solid 1px #aaa";       
    let ADOption = document.createElement("option");
    ADOption.value = "AD";
    ADOption.textContent = "AD";
    let BCOption = document.createElement("option");
    BCOption.value = "BC";
    BCOption.textContent = "BC";
    this.ADBCSelect.appendChild(ADOption);
    this.ADBCSelect.appendChild(BCOption);
    this.yearInput = document.createElement("input");
    this.yearInput.type = "number";
    this.yearInput.value = 1;
    this.yearInput.min = 1;
    this.yearInput.style.width = "80px";   
    this.yearInput.style.borderRadius = "5px";  
    this.yearInput.style.padding = "5px 5px 5px 5px";   
    this.yearInput.style.margin = "0px 0px 0px 10px"; 
    this.yearInput.style.border = "solid 1px #aaa";            
    this.yearInputs.appendChild( this.ADBCSelect );    
    this.yearInputs.appendChild( this.yearInput );

    this.monthDayInputArea = document.createElement("div");
    this.monthDayInputArea.style.display = "flex";
    this.monthDayInputArea.style.flexDirection = "row";
    this.monthDayInputArea.style.alignItems = "center";
    this.monthDayInputArea.style.justifyContent = "space-between";
    this.monthDayInputArea.style.margin = "5px 0px 0px 0px";

    this.monthInputArea = document.createElement("div");
    this.monthInputArea.style.display = "flex";
    this.monthInputArea.style.flexDirection = "row";
    this.monthInputArea.style.alignItems = "center";
    this.monthLabel = document.createElement("div");
    this.monthLabel.textContent = "Month";
    this.monthInput = document.createElement("input");
    this.monthInput.type = "number";
    this.monthInput.style.width = "40px";
    this.monthInput.value = 1;
    this.monthInput.min = 1;
    this.monthInput.max = 12;  
    this.monthInput.style.width = "48px";   
    this.monthInput.style.borderRadius = "5px";  
    this.monthInput.style.padding = "5px 5px 5px 5px";   
    this.monthInput.style.margin = "0px 0px 0px 10px"; 
    this.monthInput.style.border = "solid 1px #aaa";        
    this.monthInputArea.appendChild( this.monthLabel );   
    this.monthInputArea.appendChild( this.monthInput );

    this.dayInputArea = document.createElement("div");
    this.dayInputArea.style.display = "flex";
    this.dayInputArea.style.flexDirection = "row";
    this.dayInputArea.style.alignItems = "center";
    this.dayLabel = document.createElement("div");
    this.dayLabel.textContent = "Day";
    this.dayInput = document.createElement("input");
    this.dayInput.type = "number";
    this.dayInput.value = 1;
    this.dayInput.min = 1;
    this.dayInput.max = 31;
    this.dayInput.style.width = "48px";   
    this.dayInput.style.borderRadius = "5px";  
    this.dayInput.style.padding = "5px 5px 5px 5px";   
    this.dayInput.style.margin = "0px 0px 0px 10px";   
    this.dayInput.style.border = "solid 1px #aaa";
    this.dayInputArea.appendChild( this.dayLabel );   
    this.dayInputArea.appendChild( this.dayInput );        

    this.yearInputArea.appendChild( this.yearLabel );
    this.yearInputArea.appendChild( this.yearInputs );
    this.monthDayInputArea.appendChild( this.monthInputArea );
    this.monthDayInputArea.appendChild( this.dayInputArea );    

    this.dom.appendChild( this.yearInputArea );
    this.dom.appendChild( this.monthDayInputArea );  
    
    this.setupEvent();
}

DateInput.prototype.getDom = function()
{
    return this.dom;
}

DateInput.prototype.setValue = function( value )
{
    if( 0 < value.year ){
        this.ADBCSelect.value = "AD"
    }else{
        this.ADBCSelect.value = "BC"
    }
    this.yearInput.value  = Math.abs( value.year );
    this.monthInput.value = value.month;
    this.dayInput.value   = value.day; 
    this.changeDate();   
}

DateInput.prototype.getValue = function()
{    
    let year  = Number( this.yearInput.value );
    let month = Number( this.monthInput.value );
    let day   = Number( this.dayInput.value );

    if( this.ADBCSelect.value === "BC" ){
        year = -year;
    }
    return { year, month, day };    
}

DateInput.prototype.resize = function()
{
}

//////////////////////////////////////////////////////////////
// local function
//////////////////////////////////////////////////////////////

DateInput.prototype.setupEvent = function()
{
    this.ADBCSelect.onchange = () => this.changeDate();     
    this.yearInput.onchange = () => this.changeDate();     
    this.monthInput.onchange = () => this.changeDate();     
    this.dayInput.onchange = () => this.changeDate();
}

DateInput.prototype.changeDate = function() {
    let year  = Number( this.yearInput.value );
    let month = Number( this.monthInput.value );
    let day = Number( this.dayInput.value );
    let numDay = this.getNumDays( year, month );
    this.dayInput.max = numDay;
    if( numDay < day ){
        this.dayInput.value = numDay;
    }

    day = Math.max( day, 1 );
    day = Math.min( day, numDay );
    month = Math.max( month, 1 );
    month = Math.min( month, 12 );
    year = Math.max( year, 1 );
    this.yearInput.value = year;
    this.monthInput.value = month;
    this.dayInput.value = day; 

    if( this.onchange ){
        this.onchange( this.getValue() );
    } 
}

DateInput.prototype.isLeapYear = function( year )
{
    if( year % 4 == 0 ){
        if( year % 100 == 0 ){
            if( year % 400 == 0 ){
                return true;
            }    
            return false;
        }
        return true;
    }else{
        return false;
    }
}

DateInput.prototype.getNumDays = function( year, month )
{
    if( month == 1 || month == 3 || month == 5 || month == 7 || 
        month == 8 || month == 10 || month == 12 ){
        return 31;
    }else if( month == 2 ){
        if( this.isLeapYear( year ) ){
            return 29;
        }else{
            return 28;
        }
    }
    return 30;
}