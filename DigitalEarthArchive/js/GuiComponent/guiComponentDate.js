
guiComponentDate = function ( callback )
{
    this.dom = document.createElement("div");
    this.dom.style.marginTop = "5px";
    this.dom.style.marginBottom = "5px";
    this.callback = callback;

    this.date = document.createElement("input");
    this.date.type = "date";
    this.date.style.marginRight = "10px";
    this.time = document.createElement("input");
    this.time.type = "time";

    this.dom.appendChild(this.date);
    this.dom.appendChild(this.time);

    this.time.addEventListener("change", function (event)
    {
        if (callback)
        {
            this.callback();
        }
    }.bind(this));
}

guiComponentDate.prototype.getTime = function ()
{
    return convertTimeToValue(this.date.value, this.time.value);
}

guiComponentDate.prototype.setTime = function (currntTime)
{
    this.date.value = currntTime.date;
    this.time.value = currntTime.time;
}

guiComponentDate.prototype.getDom = function()
{
    return this.dom;
}

guiComponentCurrentTime = function (callback)
{
    this.dom = document.createElement("div");
    this.dom.style.width = "400px";
    this.dom.style.height = "60px";
    this.dom.style.marginTop = "20px";
    this.dom.style.marginBottom = "10px";
    this.callback = callback;

    this.date = document.createElement("input");
    this.date.type = "date";
    this.date.style.width = "260px";
    this.date.style.height = "50px";
    this.date.style.fontFamily = "palatino linotype, palatino, serif";
    this.date.style.fontSize = "30px";
    this.date.style.marginRight = "10px";
    this.date.style.paddingLeft = "10px";
    this.date.style.backgroundColor = "#ddd";
    this.time = document.createElement("input");
    this.time.type = "time";
    this.time.style.fontSize = "30px";
    this.time.style.fontFamily = "palatino linotype, palatino, serif";
    this.time.style.width = "125px";
    this.time.style.height = "50px";
    this.time.style.paddingLeft = "10px";
    this.time.style.backgroundColor = "#ddd";

    this.dom.appendChild(this.date);
    this.dom.appendChild(this.time);

    this.date.addEventListener("change", function (event)
    {
        if (callback)
        {
            this.callback();
        }
    }.bind(this));

    this.time.addEventListener("change", function (event)
    {
        if (callback)
        {
            this.callback();
        }
    }.bind(this));
}

guiComponentCurrentTime.prototype.getTime = function ()
{
    return convertTimeToValue(this.date.value, this.time.value);
}

guiComponentCurrentTime.prototype.setTime = function ( currntTime )
{
    this.date.value = currntTime.date;
    this.time.value = currntTime.time;
}

guiComponentCurrentTime.prototype.getDom = function ()
{
    return this.dom;
}

function convertTimeToValue(date, time)
{
    let year   = Number( date.substr(0, 4) );
    let month  = Number( date.substr(5, 2) );
    let day    = Number( date.substr(8, 2) );
    let hour   = Number( time.substr(0, 2) );
    let minute = Number( time.substr(3, 2) );

    let value = minute + hour * 100 + day * 10000 +
                month * 1000000 + year * 100000000;
    return value;
}

function convertValueToTime(value)
{
    let temp = 0;

    let year = Math.floor( value / 100000000 );
    temp = (value - year * 100000000);
    let month  = Math.floor(temp / 1000000);
    temp = (temp - month * 1000000);
    let day = Math.floor( temp / 10000 );
    temp = (temp - day * 10000);
    let hour = Math.floor(temp / 100);
    temp = (temp - hour * 100);
    let minute = Math.floor(temp);

    var toTargetDigits = function (num, digits)
    {
        num += ''
        while (num.length < digits) 
        {
            num = '0' + num
        }
        return num
    }

    let time = {};
    time.date = toTargetDigits(year, 2) + "-" + toTargetDigits(month, 2) + "-" + toTargetDigits(day, 2);
    time.time = toTargetDigits(hour, 2) + ":" + toTargetDigits(minute, 2);
    return time;
}
