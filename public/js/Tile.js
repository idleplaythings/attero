
window.maskCanvas = $('<canvas width="40" height="40"></canvas>').get(0);
window.maskContext = window.maskCanvas.getContext("2d");

var Tile = function (x, y)
{
    this.position = {x:x, y:y}
    this.textureData = null;
    this.drawOrder = Array(4,1,3,5,7,0,2,6,8);
    this.subTiles = Array(9);
    this.getGameTilesRelatedToTile();
}

Tile.prototype.getGameTilesRelatedToTile = function()
{
    var tx = this.position.x*2;
    var ty = this.position.y*2;

    this.subTiles[0] = TileGrid.getGameTileByXY(tx, ty);
    this.subTiles[1] = TileGrid.getGameTileByXY(tx+1, ty);
    this.subTiles[2] = TileGrid.getGameTileByXY(tx+2, ty);

    this.subTiles[3] = TileGrid.getGameTileByXY(tx, ty+1);
    this.subTiles[4] = TileGrid.getGameTileByXY(tx+1, ty+1);
    this.subTiles[5] = TileGrid.getGameTileByXY(tx+2, ty+1);

    this.subTiles[6] = TileGrid.getGameTileByXY(tx, ty+2);
    this.subTiles[7] = TileGrid.getGameTileByXY(tx+1, ty+2);
    this.subTiles[8] = TileGrid.getGameTileByXY(tx+2, ty+2);

}

Tile.prototype.onClicked = function (x, y)
{
    UIEvents.onTileClicked(this, x, y);
}

Tile.prototype.init = function( )
{
    this.createTexture();
}

Tile.prototype.hasOnlyOneTexture = function()
{
    var tex = this.subTiles[4].subTexture;
    for (var i in this.subTiles)
    {
        if (tex != this.subTiles[i].subTexture)
            return false;
    }

    return true;
}

Tile.prototype.hasThisTexture = function(textureid)
{
    for (var i in this.subTiles)
    {
        if (this.subTiles[i].subTexture == textureid)
            return true;
    }
    return false;
}

Tile.prototype.createTexture = function()
{
    var canvas = $('<canvas width="40" height="40"></canvas>');
    var finalCanvas = canvas.get(0);
    var finalContext = finalCanvas.getContext("2d");

    var centerTexture = this.subTiles[4].subTexture;

    var t = this.subTiles[4].subTextureOffset*40;
    finalContext.drawImage(window.availableTextures[centerTexture].img, t , 0, 40, 40, 0, 0, 40, 40);
    //finalContext.fillRect(5,5,20,20)
    this.textureData = finalContext.getImageData(0, 0, 40, 40);

    if (! this.hasOnlyOneTexture() )
    {
        for (var i in window.availableTextures)
        {
            if (this.hasThisTexture(window.availableTextures[i].id))
                window.availableTextures[i].addToTileTexture(this, this.textureData);
        }
    }

    for (var i in this.subTiles){
        var subElement = this.subTiles[i].subElement;
        if (subElement == 0)
            continue;

        var offset = this.subTiles[i].subElementOffset;
        var offset2 = this.subTiles[i].subElementOffset2;
        window.availableTileElements[subElement].addToTexture(this, this.textureData, i, offset, offset2, true);
    }

    this.createShadows();

    for (var i in this.subTiles){
        var subElement = this.subTiles[i].subElement;
        if (subElement == 0)
            continue;

        var offset = this.subTiles[i].subElementOffset;
        var offset2 = this.subTiles[i].subElementOffset2;
        window.availableTileElements[subElement].addToTexture(this, this.textureData, i, offset, offset2, false);
    }
}

Tile.prototype.getTextureSegmentLocation = function(segment)
{
    var x = (segment < 3 ) ? segment : segment % 3;
    x = (x*20)-20;

    var y = (Math.floor(segment / 3) * 20) - 20;

    return {x:x, y:y};
}

Tile.prototype.createShadows = function()
{
    var finalCanvas = $('<canvas width="40" height="40"></canvas>').get(0);
    var finalContext = finalCanvas.getContext("2d");

    var x = this.position.x;
    var y = this.position.y;

    var shadowData = finalContext.createImageData(40,40);
    var shadowColor = Array(0,0,0);
    var shadowAlpha = 0.8;

    var highlightData = finalContext.createImageData(40,40);
    var highlightColor = Array(255,255,100);
    var highlightAlpha = 0.4;

    var elevations = TileGrid.getElevationDifferenceArray(this);

    for (var i in this.subTiles){
        var gametile = this.subTiles[i];

        this.drawShadowSegment(
            shadowData,
            gametile,
            this.getTextureSegmentLocation(i),
            false);

        this.drawShadowSegment(
            highlightData,
            gametile,
            this.getTextureSegmentLocation(i),
            true);

    }

    ImageManipulation.addImageDataToTileTexture(this.textureData, shadowData);
    ImageManipulation.addImageDataToTileTexture(this.textureData, highlightData);
}

Tile.prototype.drawShadowSegment = function(iData, gametile, pos, highlight)
{
    var details = gametile.getShadowData(pos, highlight);

    if (details === false)
        return;

    var maskData = details.maskData;
    var alpha = details.a;
    var color = details.c;

    var finalData = iData.data;
    var pixels = 6400;

    while (pixels) {
        var r = pixels-4;
        var g = pixels-3;
        var b = pixels-2;
        var a = pixels-1;

        var maskAlpha = Math.floor(maskData[a] * alpha);

        if (maskAlpha == 0)
        {
            pixels -= 4;
            continue;
        }

        finalData[r] = color[0];
        finalData[g] = color[1];
        finalData[b] = color[2];

        if (finalData[a] == 0)
        {
            finalData[a] = maskAlpha;
        }
        else
        {
            finalData[a] = (finalData[a] > maskAlpha) ? finalData[a] : maskAlpha;
        }

        pixels -= 4;
    }
    iData.data = finalData;
}
