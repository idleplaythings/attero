var GameTile = function (args)
{
    if (!args.position) {
        throw "GameTile has to have position defined";
    }

    this.position = args.position;
    this.subTexture = (args.subTexture) ? args.subTexture : 1;
    this.subTextureOffset = (args.subTextureOffset) ? args.subTextureOffset : 1;
    this.subTextureMask = (args.subTextureMask) ? args.subTextureMask : 1;
    this.elevation = (args.elevation) ? parseInt(args.elevation) : 0;
    this.subElement = (args.subElement) ? parseInt(args.subElement) : 0;
    this.subElementOffset = (args.subElementOffset) ? args.subElementOffset : 0;
    this.subElementOffset2 = (args.subElementVariance) ? args.subElementVariance : 0;
    this.subElementAngle = (args.subElementAngle) ? args.subElementAngle : 0;

    this.concealment = this.calculateConcealment();
    this.losConcealment = 0;

    this.subscribedUnit = null;
}

GameTile.prototype.calculateConcealment = function()
{
    if (window.availableTileElements[this.subElement])
    {
        return window.availableTileElements[this.subElement].concealment;
        console.log("tile concealment: " +  this.concealment );
    }
    else
    {
        return 0;
    }
}

GameTile.prototype.setLosConcealment = function(conc)
{
    if (conc > 100)
        conc = 100;

    if (conc < this.losConcealment)
        this.losConcealment = conc;

}

GameTile.prototype.getLosConcealmentInByteScale = function(conc)
{
    conc = this.losConcealment;

    if (conc < 25)
        return 0;

    if (conc >= 25 && conc < 50)
        return 50;

    if (conc >= 50 && conc < 75)
        return 100;

    if (conc >= 75 && conc < 100)
        return 150;

    return 180;
}

GameTile.prototype.unSubscribeUnitToTile = function(unit)
{
    this.subscribedUnit = null;
}

GameTile.prototype.subscribeUnitToTile = function(unit)
{
    if (this.subscribedUnit != null && this.subscribedUnit.id == unit.id)
        throw "Can't subscribe same unit to same tile more than once";

    if (this.subscribedUnit != null)
        throw "Can't subscribe more than one unit per tile";

    this.subscribedUnit = unit;
}

GameTile.prototype.serialize = function()
{
    var serialized = ''
        + this.subTexture + ','
        + this.subTextureOffset + ','
        + this.subTextureMask + ','
        + this.elevation + ','
        + this.subElement + ','
        + this.subElementOffset + ','
        + this.subElementOffset2 + ','
        + this.subElementAngle + '';
    return serialized;
}

GameTile.prototype.randomizeTile = function()
{
    var texture = window.availableTextures[this.subTexture];
    this.subTextureOffset = texture.getRandomOffset();
    //console.log(this.subTextureOffset);
    this.subTextureMask = texture.getRandomMask();
}

GameTile.prototype.getTilesTouchedByGameTile = function()
{
    var x = this.position.x/2;
    var y = this.position.y/2;

    var tx = Math.floor(x);
    var ty = Math.floor(y);

    var tiles = Array();
    var center = TileGrid.getTileByXY(tx, ty);
    tiles.push(center);

    if (x%1 == 0.5 && y%1 == 0.5)
        return tiles;

    return tiles.concat(TileGrid.getAdjacentTilesInArray(center));

}

GameTile.prototype.getAdjacentGameTilesInArray = function()
{
    var x = this.position.x;
    var y = this.position.y;
    var tiles = Array();

    tiles.push(TileGrid.getGameTileByXY(x-1, y-1));
    tiles.push(TileGrid.getGameTileByXY(x, y-1));
    tiles.push(TileGrid.getGameTileByXY(x+1, y-1));

    tiles.push(TileGrid.getGameTileByXY(x-1, y));
    tiles.push(TileGrid.getGameTileByXY(x+1, y));

    tiles.push(TileGrid.getGameTileByXY(x-1, y+1));
    tiles.push(TileGrid.getGameTileByXY(x, y+1));
    tiles.push(TileGrid.getGameTileByXY(x+1, y+1));

    return tiles;
}

GameTile.prototype.getAdjacentGameTilesInArrayClockwise = function()
{
    var x = this.position.x;
    var y = this.position.y;
    var tiles = Array();

    tiles.push(TileGrid.getGameTileByXY(x-1, y-1));
    tiles.push(TileGrid.getGameTileByXY(x, y-1));
    tiles.push(TileGrid.getGameTileByXY(x+1, y-1));

    tiles.push(TileGrid.getGameTileByXY(x+1, y));

    tiles.push(TileGrid.getGameTileByXY(x+1, y+1));
    tiles.push(TileGrid.getGameTileByXY(x, y+1));
    tiles.push(TileGrid.getGameTileByXY(x-1, y+1));

    tiles.push(TileGrid.getGameTileByXY(x-1, y));


    return tiles;
},

GameTile.prototype.getElevationDifference = function()
{
    var tiles = this.getAdjacentGameTilesInArray();
    var elevations = Array();

    var elevation = this.elevation;
    //console.log("tile: " + this.position.x + "," + this.position.y);
    for (var i in tiles)
    {
        var tile = tiles[i];
        //console.log(tile.elevation);

        if (tile === null)
        {
            elevations[i] = 0;
            continue
        }
        var tileElevation = tile.elevation;

        if (tileElevation > elevation)
            elevations[i] = 'u';
        else if (tileElevation < elevation)
            elevations[i] = 0;
        else
            elevations[i] = 0;
    }
    //console.dir(elevations);
    return elevations;

}

GameTile.prototype.getElevationDifferenceString = function()
{
    return this.getElevationDifference().join('');
}


GameTile.prototype.getShadowData = function(pos, highlight)
{
    var elevationString = this.getElevationDifferenceString();

    if (elevationString === '00000000')
        return false;

    var list = ContourShadows;

    if (highlight)
        list = ContourHighlights;

    //console.log("tile: " + this.position.x + "," + this.position.y + " elevationS: " + elevationString);

    var details = Contours.match(elevationString, list);
    if (details === false)
    {
        //console.log("unknown elevation string: " +elevationString);
        return false;
    }

    details.maskData = this.getShadowMaskData(details, pos);

    return details;
}


GameTile.prototype.getShadowMaskData = function(details, pos)
{
    var segment = details.s;
    var offset = details.offset || 0;
    var context = window.maskContext;
    var shadowpos = this.getShadowSegmentPosition(segment);
    pos.x += shadowpos.x;
    pos.y += shadowpos.y;

    context.clearRect(0, 0, 40, 40);

    //var v = this.subTextureMasks[segment]*40;
    var l = window.textureMasks[2].width / 40;
    v = offset * 40;
    context.drawImage(window.textureMasks[2], v , 0, 40, 40, pos.x, pos.y, 40, 40);

    var mask = context.getImageData(0, 0, 40, 40);
    return mask.data;
}

GameTile.prototype.getShadowSegmentPosition = function(segment)
{
    switch (segment)
    {
        case 0:
        return {x:-5, y:-5};

        case 1:
        return {x:0, y:-5};

        case 2:
        return {x:5, y:-5};

        case 3:
        return {x:-5, y:0};

        case 4:
        return {x:0, y:0};

        case 5:
        return {x:5, y:0};

        case 6:
        return {x:-5, y:5};

        case 7:
        return {x:0, y:5};

        case 8:
        return {x:5, y:5};
    }
}