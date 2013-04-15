
function Coordinates(tileSize, mapWidth)
{
    console.log("mapWidth: " + mapWidth);
    this.tileSize = tileSize;
    this.mapWidth = mapWidth;
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
    var index = Math.floor((y + 10) / this.tileSize) * this.mapWidth + Math.floor((x + 10) / this.tileSize);

    return index;
};
