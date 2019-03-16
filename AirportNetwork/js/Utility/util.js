
////////////////////////////////////////////////////////
// Rect
////////////////////////////////////////////////////////

rect = function ( x, y, w, h )
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

rect.prototype.setRect = function ( x, y, w, h )
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

rect.prototype.isInsideRect = function ( x, y )
{
    let result = false;
    if( ( this.x < x ) && ( x < this.x + this.w ) && 
        ( this.y < y ) && ( y < this.y + this.h ) )
    {
        result = true;
    }

    return result;
}


