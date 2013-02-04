
function Coordinates(tileSize, tileRowCount)
{
    this.tileSize = tileSize;
    this.tileRowCount = tileRowCount;
}

Coordinates.prototype.viewPortToGridCoordinates = function(offsetLeft, offsetTop, viewPortWidth, viewPortHeight, cameraX, cameraY, zoom, x, y)
{

    x -= offsetLeft;
    y -= offsetTop;

    x -= viewPortWidth / 2 - (cameraX * zoom);
    y -= viewPortHeight / 2 + (cameraY * zoom);

    x /= zoom;
    y /= zoom;

    return { 'x': x, 'y': y };
};

Coordinates.prototype.gridCoordinatesToTileId = function(x, y)
{
    var width = this.tileRowCount * 2 + 1;
    var index = Math.floor((y + 10) / this.tileSize) * width + Math.floor((x + 10) / this.tileSize);

    return index;
};
