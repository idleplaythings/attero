var Landscaping = function Landscaping(dispatcher, tileGrid)
{
    this.tileGrid = tileGrid;
    this.selectedTexture = 1;
    this.selectedElement = null;
    this.selectedBrush = 1;
    this.selectedBrushSize = 1;
    this.updatedTiles = Array();

    this.offsety = 0;

    dispatcher.attach(new EventListener("ClickTileEvent", $.proxy(this.onTileClicked, this)));

};

Landscaping.prototype.onTileClicked = function(event)
{
    if ( ! event.tile)
        return;

    var tile = event.tile;

    this.updatedTiles = Array();
    switch (this.selectedBrush)
    {
        case 1:
            if (this.selectedElement)
                this.modifyTerrain(tile, 'setSubElementForTile');
            else
                this.modifyTerrain(tile, 'setSubTextureForTile');
            break;
        case 2:
            this.modifyTerrain(tile, 'removeSubTextureFromTile');
            break;
        case 3:
            var targetElevation = tile.elevation + 2;

            if (targetElevation & 2 !== 0)
                targetElevation--;

            this.modifyTerrain(tile, 'changeElevation', targetElevation);
            break;
        case 4:
            var targetElevation = tile.elevation - 2;

            if (targetElevation & 2 !== 0)
                targetElevation++;

            this.modifyTerrain(tile, 'changeElevation', targetElevation);
            break;
    }

    this.updateTiles();
};

Landscaping.prototype.applyLargeSpray = function(callfunction, tile, args)
{

    var x = tile.position.x -2;
    var y = tile.position.y -2;

    for (var dy = y;dy<y+5;dy++){
        for (var dx = x;dx<x+5;dx++){
            var oTile = TileGrid.getGameTileByXY(dx, dy);
            if (!oTile)
                continue;

            if (Math.random() <= 0.1)
                this.applySmallBrush(callfunction, oTile, args);
        }
    }
};

Landscaping.prototype.applyLargeBrush = function(callfunction, tile, args)
{
    var x = tile.position.x -1;
    var y = tile.position.y -1;

    for (var dy = y;dy<y+3;dy++){
        for (var dx = x;dx<x+3;dx++){
            var oTile = TileGrid.getGameTileByXY(dx, dy);
            if (!oTile)
                continue;

            this.applyMediumBrush(callfunction, oTile, args);
        }
    }
};

Landscaping.prototype.applyMediumBrush = function(callfunction, tile, args)
{
    var tiles = tile.getAdjacentGameTilesInArray();
    tiles.push(tile);

    for (var i in tiles)
    {
        this.applySmallBrush(callfunction, tiles[i], args);
    }


};

Landscaping.prototype.applySmallBrush = function(callfunction, tile, args)
{
    var selected, element, maskid, offset;

    if ( this.selectedTexture )
    {
        selected = this.selectedTexture;
        element = window.availableTextures[selected];
        maskid = element.getRandomMask();
        offset = element.getRandomOffset();
    }
    else if ( this.selectedElement )
    {
        selected = this.selectedElement;
        element = window.availableTileElements[selected];
        offset = element.getRandomOffset();

    }

    var offsety = this.offsety;

    this.callFunction(callfunction, tile, selected, maskid, offset, offsety, args);
};

Landscaping.prototype.callFunction = function(callfunction, tile, selected, maskid, offset, offsety, args)
{
    this[callfunction](tile, selected, maskid, offset, offsety, args);
};

Landscaping.prototype.modifyTerrain = function(tile, callfunction, args)
{
    switch (this.selectedBrushSize)
    {
        case 1:
            this.applySmallBrush(
                callfunction, tile, args);
            break;
        case 2:
            this.applyMediumBrush(
                callfunction, tile, args);
            break;
        case 3:
            this.applyLargeBrush(
                callfunction, tile, args);
            break;
        case 4:
            this.applyLargeSpray(
                callfunction, tile, args);
            break;
    }
};

Landscaping.prototype.removeSubTextureFromTile = function(tile, element, mask, offset, offsety, args)
{
    tile.subElement = 0;
    tile.subElementOffset = 0;
    tile.subElementOffset2 = 0;

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.setSubElementForTile = function(tile, element, mask, offset, offsety, args)
{
    window.availableTileElements[element].addToTile(tile, offset, offsety, this);

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.setSubTextureForTile = function(tile, texture, mask, offset, offsety, args)
{
    window.availableTextures[texture].addToTile(tile, mask, offset, offsety, this);

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.changeTileElement = function(tile)
{
    tile.element = this.selectedElement;
    tile.elementOffset = window.availableTileElements[tile.element].getRandomOffset();

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.doElevationChange = function(tile, targetElevation)
{
    var tiles = tile.getAdjacentGameTilesInArray();

    for (var i in tiles)
    {
        var t = tiles[i];
        var tElevation = t.elevation;

        if (tElevation == targetElevation)
            continue;

        if (Math.abs(tElevation - targetElevation) > 2 && tElevation % 2 === 0)
        {
            //console.log("Elevation not possible. Elevation: " + tElevation + " target: " + targetElevation);
            return false;
        }

        if (Math.abs(tElevation - targetElevation) > 1 && tElevation % 2 !== 0)
        {
            //console.log("Elevation not possible (SLOPE). Elevation: " + tElevation + " target: " + targetElevation);
            return false;
        }

    }

    tile.elevation = targetElevation;
    this.addTileToBeUpdated(tile);

    for (i in tiles)
    {
        var t = tiles[i];

        if (Math.abs(t.elevation - targetElevation) == 2)
        {
            t.elevation += (targetElevation - t.elevation) /2;
        }
        this.addTileToBeUpdated(t);
    }
};

Landscaping.prototype.levelSlopes = function()
{
    for (var i in TileGrid.gameTiles)
    {
        var tile = TileGrid.gameTiles[i];

        if (tile.elevation % 2 === 0)
            continue;

        var tiles = tile.getAdjacentGameTilesInArrayClockwise();

        this.levelMiddleSlopes(tile, tiles);
    }

    for (var i in TileGrid.gameTiles)
    {
        var tile = TileGrid.gameTiles[i];

        if (tile.elevation % 2 === 0)
            continue;

        var tiles = tile.getAdjacentGameTilesInArrayClockwise();

        this.levelLonelySlopes(tile, tiles);
    }
};

Landscaping.prototype.levelLonelySlopes = function(tile, adjacents)
{
    var highest = -999999;
    var found = Array();
    var number = 0;

    for (var j in adjacents)
    {
        var t  = adjacents[j];
        if (!t)
            continue;

        if (t.elevation > highest)
            highest = t.elevation;

        if (t.elevation != tile.elevation)
        {
            if (!found[t.elevation])
            {
                found[t.elevation] = true;
                number++;
            }
        }
    }

    if (number > 1)
        return;

    if (highest > tile.elevation)
        tile.elevation++;
    else
        tile.elevation--;
};

Landscaping.prototype.levelMiddleSlopes = function(tile, adjacents)
{
    for (var j=1; j<4; j+=2)
    {
        var t  = adjacents[j];
        var ot = adjacents[j+4];

        if (!t || !ot)
            continue;

        if (t.elevation == ot.elevation && t.elevation > tile.elevation)
        {
            tile.elevation++;
            break;
        }

        if (t.elevation == ot.elevation && t.elevation < tile.elevation)
        {
            tile.elevation--;
            break;
        }
    }
};

Landscaping.prototype.changeElevation = function(tile, selected, maskid, offset, offsety, targetElevation)
{
    this.doElevationChange(tile, targetElevation);
};

Landscaping.prototype.updateTiles = function()
{
    this.levelSlopes();

    for (var i in this.updatedTiles)
    {
        var tile = this.updatedTiles[i];
        tile.createTexture();
        TileGrid.updateTexture(tile);
    }
};

Landscaping.prototype.addTileToBeUpdated = function(gametile)
{
    var tiles = gametile.getTilesTouchedByGameTile();


    for (var a in tiles)
    {
        var tile = tiles[a];
        if (!tile)
           continue;

        var found = false;

        for (var i in this.updatedTiles)
        {
            var oTile = this.updatedTiles[i];
            if (oTile.position.x == tile.position.x && oTile.position.y == tile.position.y)
                found = true;
        }

        if (!found)
           this.updatedTiles.push(tile);
    }
};