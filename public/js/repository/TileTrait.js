var TileTrait = function TileTrait()
{

};

TileTrait.prototype.usedBy = function(e)
{
    for (var i in this)
    {
        if (i == "usedBy")
            continue;

        e[i] = this[i];
    }
};

var TileTraitContinuous = function TileTraitContinuous()
{
    this.continuous = true;
    this.underShadow = true;
    this.straight = 0;
    this.left90 = 2;
    this.left135 = 3;
    this.right135 = 4;
    this.right90 = 1;
    this.many = 5;
};

TileTraitContinuous.prototype = Object.create( TileTrait.prototype );

TileTraitContinuous.prototype.addToTile = function(tile, offsetx, offsety, landscaping)
{
    //var angle = Math.floor(Math.random()*360);
    tile.subElementAngle = 0;
    tile.subElement = this.id;
    tile.subElementOffset = 0;
    tile.subElementOffset2 = offsety;

    this.updateAdjacentTiles(tile, landscaping);
    this.updateTile(tile, landscaping);
};

TileTraitContinuous.prototype.updateTile = function(tile, landscaping)
{
    var tiles = tile.getAdjacentGameTilesInArrayClockwise();
    tiles = this.ignoreRoads(tiles);
    var roadcount = 0;

    for (var i in tiles)
    {
        if (tiles[i] != null)
            roadcount++;
    }

    if (roadcount == 0)
    {
    }
    else if (roadcount < 3)
    {
        var details = this.getRoadsMeetType(tiles);
        tile.subElementAngle = details.angle;
        tile.subElementOffset = details.offset;
    }
    else
    {
        //tile.subElementOffset = this.many;
    }

    landscaping.addTileToBeUpdated(tile);
};

TileTraitContinuous.prototype.getRoadsMeetType = function(tiles)
{
    var first = null;
    var second = null;

    for (var i in tiles)
    {
        if (tiles[i] != null)
        {
            if (first !== null)
            {
                second = i;
                break;
            }

            first = i;
        }
    }


    var offset = 0;

    if (second !== null)
    {
        var diff = second - first;

        if (diff === 4){
            offset = this.straight;
        }else if (diff === 2){
            offset = this.left90;
        }else if (diff === 3){
            offset = this.left135;
        }else if (diff === 5){
            offset = this.right135;
        }else if (diff === 6){
            offset = this.right90;
        }else{
            throw "Illegal roadtype, first: "+first+", second: "
                +second+", diff: "+diff;
        }
    }

    var angle = TileGrid.getAdjacentTilesArrayAngle(first);
    var details =  {offset:offset, angle:angle};

    return details;
};


TileTraitContinuous.prototype.updateAdjacentTiles = function(tile, landscaping)
{
    var tiles = tile.getAdjacentGameTilesInArray();
    tiles = this.ignoreRoads(tiles);

    for (var i in tiles){
        if (tiles[i] != null)
            this.updateTile(tiles[i], landscaping);
    }

};

TileTraitContinuous.prototype.ignoreRoads = function(tiles)
{
    if (tiles[1] && tiles[1].subElement == this.id){
        tiles[0] = null;
        tiles[2] = null;
    }

    if (tiles[3] && tiles[3].subElement == this.id){
        tiles[2] = null;
        tiles[4] = null;
    }

    if (tiles[5] && tiles[5].subElement == this.id){
        tiles[4] = null;
        tiles[6] = null;
    }

    if (tiles[7] && tiles[7].subElement == this.id){
        tiles[0] = null;
        tiles[6] = null;
    }

    for (var i in tiles)
    {
        var tile = tiles[i];
        if (!tile)
            continue;

        if (tile.subElement != this.id)
            tiles[i] = null;
    }

    return tiles;
};



