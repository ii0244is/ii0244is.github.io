

keywordFilterManager = function ()
{
    this.keywordList = [];
    this.selectdKeywordList = [];
    this.enable = false;
}

keywordFilterManager.prototype.setFilter = function ( enable )
{
    this.enable = enable;
}

keywordFilterManager.prototype.isFilterEnable = function ()
{
    return this.enable;
}

keywordFilterManager.prototype.isExist = function ( keyword )
{
    let find = false;
    for( let i = 0; i < this.keywordList.length; ++i ){
        if( this.keywordList[i] == keyword ){
            find = true;
            break;
        }
    }
    return find;
}

keywordFilterManager.prototype.getKeywords = function ()
{
    return this.selectdKeywordList;
}

keywordFilterManager.prototype.getKeywordList = function ()
{
    return this.keywordList;
}

keywordFilterManager.prototype.setKeywords = function ( list )
{
    this.selectdKeywordList = list;
}

keywordFilterManager.prototype.add = function ( keyword )
{
    this.keywordList.push( keyword )
}

keywordFilterManager.prototype.delete = function ( keyword )
{
    for( let i = 0; i < this.keywordList.length; ++i ){
        if( this.keywordList[i] == keyword ){
            this.keywordList.splice(i, 1);
        }
    }

    for( let i = 0; i < this.selectdKeywordList.length; ++i ){
        if( this.selectdKeywordList[i] == keyword ){
            this.selectdKeywordList.splice(i, 1);
        }
    }
}

