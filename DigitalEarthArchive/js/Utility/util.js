
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


////////////////////////////////////////////////////////
// Polygon
////////////////////////////////////////////////////////

function generatePolygon( polygonData )
{
    let triangles = [];    
    let vertices = [];    
    for( let i = 0; i < polygonData.length; ++i ){
        vertices.push( polygonData[i] );
    }

    function isPointInsideTriangle( p1, p2, p3, checkPoint )
    {
        let v1 = [ p1[0], p1[1], 0.0 ];
        let v2 = [ p2[0], p2[1], 0.0 ];
        let v3 = [ p3[0], p3[1], 0.0 ];
        let point = [ checkPoint[0], checkPoint[1], 0.0 ];

        function sub( vec1, vec2 )
        {
            let vec = [];
            vec[0] = vec1[0] - vec2[0];
            vec[1] = vec1[1] - vec2[1];
            vec[2] = vec1[2] - vec2[2];
            return vec;
        }
    
        function cross( vec1, vec2 )
        {
            let vec = [];
            vec[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
            vec[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
            vec[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
            return vec;
        }

        function dot( vec1, vec2 )
        {
            return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]; 
        }

        let vec12 = sub( v2, v1 );
        let vec2p = sub( point, v2 );
        let vec23 = sub( v3, v2 );
        let vec3p = sub( point, v3 );
        let vec31 = sub( v1, v3 );
        let vec1p = sub( point, v1 );

        let cross1 = cross( vec12, vec2p );
        let cross2 = cross( vec23, vec3p );
        let cross3 = cross( vec31, vec1p );

        let dot1 = dot( cross1, cross2 );
        let dot2 = dot( cross1, cross3 );

        let isInside = false;
        if( dot1 > 0 && dot2 > 0 ) isInside = true;

        return isInside;
    }    

    function calcDistance( v1, v2 ){
        let diffX = v1[0] - v2[0];
        let diffY = v1[1] - v2[1];
        return Math.sqrt( diffX * diffX + diffY * diffY )
    }

    function getFarthestVertexIndex( vertArray, baseVert ){
        let farthestIndex = 0;
        let farthestDistance = 0;
        for( let i = 0; i < vertArray.length; ++i ){
            let distance = calcDistance( baseVert, vertArray[i] );
            if( farthestDistance < distance ){
                farthestDistance = distance;
                farthestIndex = i;
            }
        }
        return farthestIndex;
    }

    function checkPointInsideTriange( vArray, i1, i2, i3 ){
        let isFound = false;
        for( let i = 0; i < vArray.length; ++i ){
            if( isPointInsideTriangle( vArray[i1], vArray[i2], vArray[i3], vArray[i] ) ) {
                isFound = true;
                break;
            }
        }
        return isFound;
    }

    function cross( p1, p2, p3 )
    {
        let vec1 = [ p2[0] - p1[0], p2[1] - p1[1], 0.0 ];
        let vec2 = [ p3[0] - p1[0], p3[1] - p1[1], 0.0 ];
        let vec = [];
        vec[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
        vec[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
        vec[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
        return vec;
    }

    function dot( vec1, vec2 )
    {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]; 
    }

    if( vertices.length < 3 ) return;

    while( vertices.length > 3 )
    {    
        // serach farthest point.
        let index = getFarthestVertexIndex( vertices, vertices[0] );

        // next point
        let prevIndex = index - 1; 
        if( prevIndex < 0 ) prevIndex = vertices.length - 1;
        let nextIndex = index + 1;
        if( vertices.length <= nextIndex ) nextIndex = 0;

        // check
        if( checkPointInsideTriange( vertices, index, prevIndex, nextIndex ) ){
            let cross1 = cross( vertices[index], vertices[prevIndex], vertices[nextIndex] );
            while( 1 ){
                ++index; ++prevIndex; ++nextIndex; 
                if( vertices.length <= index ) index = 0;
                if( vertices.length <= prevIndex ) prevIndex = 0;
                if( vertices.length <= nextIndex ) nextIndex = 0;
                if( !checkPointInsideTriange( vertices, index, prevIndex, nextIndex ) ){
                    let cross2 = cross( vertices[index], vertices[prevIndex], vertices[nextIndex] );
                    let directionCheck = dot( cross1, cross2 );
                    if( directionCheck > 0 ) break;
                }
            }
        }
        
        // add triangle
        let v1 = vertices[ prevIndex ];
        let v2 = vertices[ index ];
        let v3 = vertices[ nextIndex ];
        let triangle = [ v1, v2, v3 ];
        triangles.push( triangle );

        // delete vertex
        vertices.splice( index, 1 );
    }

    // add triangle
    let v1 = vertices[ 0 ];
    let v2 = vertices[ 1 ];
    let v3 = vertices[ 2 ];
    let triangle = [ v1, v2, v3 ];
    triangles.push( triangle );

    return triangles;
}

