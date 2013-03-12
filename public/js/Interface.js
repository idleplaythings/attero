
function Interface(coordinateService, tileGrid, canvas, graphics)
{
    this.coordinateService = coordinateService;
    this.tileGrid = tileGrid;
    this.canvas = canvas[0];
    this.graphics = graphics;
}

Interface.prototype.init = function()
{
    $(this.canvas).mousemove(
        $.throttle(100, $.proxy(this.gameTileHighlighter, this))
    );
};

Interface.prototype.gameTileHighlighter = function(event)
{
    var cameraPosition = this.graphics.camPos();
    var coordinates = this.coordinateService.viewPortToGridCoordinates(
        this.canvas.offsetLeft,
        this.canvas.offsetTop,
        window.innerWidth,
        window.innerHeight,
        cameraPosition.x,
        cameraPosition.y,
        this.graphics.zoom,
        event.pageX,
        event.pageY
    );

    var tileIndex = this.coordinateService.gridCoordinatesToTileId(coordinates.x, coordinates.y);
    var gameTile = this.tileGrid.gameTiles[tileIndex];

    //TODO: Eventify below
    //UIEvents.onGameTileMouseover(gameTile);
    //console.log('mouseover gametile x: ' + gameTile.position.x + ', y: ' + gameTile.position.y);
};
