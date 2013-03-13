var Landscaping = function Landscaping(dispatcher, tileGrid)
{
    this.tileGrid = tileGrid;
    this.selectedTexture = 1;
    this.selectedElement = null;
    this.selectedBrush = 1;
    this.selectedBrushSize = 1;
    this.updatedTiles = Array();

    dispatcher.attach(new EventListener("ClickTileEvent", $.proxy(this.onTileClicked, this)));

};

Landscaping.prototype.onTileClicked = function(event)
{
    console.log("Kyl mie kuulen!");

    if ( ! event.tile)
        return;

    var tile = event.tile;

    this.updatedTiles = Array();
    switch (this.selectedBrush)
    {
        case 1:
            if (this.selectedElement)
                this.changeTexture(tile, 'setSubElementForTile');
            else
                this.changeTexture(tile, 'setSubTextureForTile');
            break;
        case 2:
            this.changeTexture(tile, 'removeSubTextureFromTile');
            break;
        case 3:
            this.changeElevation(tile, 1);
            break;
        case 4:
            this.changeElevation(tile, -1);
            break;
    }

    this.updateTiles();
};

Landscaping.prototype.applyLargeSpray = function(callfunction, tile)
{

    var x = tile.position.x -2;
    var y = tile.position.y -2;

    for (var dy = y;dy<y+5;dy++){
        for (var dx = x;dx<x+5;dx++){
            var oTile = TileGrid.getGameTileByXY(dx, dy);
            if (!oTile)
                continue;

            if (Math.random() <= 0.1)
                this.applySmallBrush(callfunction, oTile);
        }
    }
};

Landscaping.prototype.applyLargeBrush = function(callfunction, tile)
{
    var x = tile.position.x -1;
    var y = tile.position.y -1;

    for (var dy = y;dy<y+3;dy++){
        for (var dx = x;dx<x+3;dx++){
            var oTile = TileGrid.getGameTileByXY(dx, dy);
            if (!oTile)
                continue;

            this.applyMediumBrush(callfunction, oTile);
        }
    }
};

Landscaping.prototype.applyMediumBrush = function(callfunction, tile)
{
    var tiles = tile.getAdjacentGameTilesInArray();
    tiles.push(tile);

    for (var i in tiles)
    {
        this.applySmallBrush(callfunction, tiles[i]);
    }


};

Landscaping.prototype.applySmallBrush = function(callfunction, tile)
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

    this.callFunction(callfunction, tile, selected, maskid, offset);
};

Landscaping.prototype.callFunction = function(callfunction, tile, selected, maskid, offset)
{
    this[callfunction](tile, selected, maskid, offset);
};

Landscaping.prototype.changeTexture = function(tile, callfunction)
{
    switch (this.selectedBrushSize)
    {
        case 1:
            this.applySmallBrush(
                callfunction, tile);
            break;
        case 2:
            this.applyMediumBrush(
                callfunction, tile);
            break;
        case 3:
            this.applyLargeBrush(
                callfunction, tile);
            break;
        case 4:
            this.applyLargeSpray(
                callfunction, tile);
            break;
    }
};

Landscaping.prototype.removeSubTextureFromTile = function(tile, element, mask, offset)
{
    tile.subElement = 0;
    tile.subElementOffset = 0;

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.setSubElementForTile = function(tile, element, mask, offset)
{
    window.availableTileElements[element].addToTile(tile, offset);

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.setSubTextureForTile = function(tile, texture, mask, offset)
{
    window.availableTextures[texture].addToTile(tile, mask, offset);

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.changeTileElement = function(tile)
{
    tile.element = this.selectedElement;
    tile.elementOffset = window.availableTileElements[tile.element].getRandomOffset();

    this.addTileToBeUpdated(tile);
};

Landscaping.prototype.changeElevation = function(tile, change)
{
    var tiles = tile.getAdjacentGameTilesInArray();

    var orginalElevation = tile.elevation;
    var targetElevation = orginalElevation + change;

    console.log("te: " + targetElevation + " oe: " + orginalElevation + " c: " + change);
    for (var i in tiles)
    {
        var t = tiles[i];
        var tElevation = t.elevation;

        if (Math.abs(tElevation - targetElevation) > 1)
        {
            console.log("Elevation not possible");
            return false;
        }

    }
    tile.elevation = targetElevation;
    this.addTileToBeUpdated(tile);

    for (i in tiles)
    {
        var t = tiles[i];
        this.addTileToBeUpdated(t);
    }
};

Landscaping.prototype.updateTiles = function()
{
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