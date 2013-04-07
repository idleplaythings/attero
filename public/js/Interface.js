
function Interface(coordinateService, tileGrid, canvas, dispatcher)
{
    this.coordinateService = coordinateService;
    this.tileGrid = tileGrid;
    this.canvas = canvas[0];
    this.dispatcher = dispatcher;
    this.zoom = 1;
    this.pos = {x:0, y:0};

    this.mouseoverTile = null;

    this.dispatcher.attach(new EventListener("ZoomEvent", $.proxy(this.onZoom, this)));
    this.dispatcher.attach(new EventListener("ScrollEvent", $.proxy(this.onScroll, this)));
}

Interface.prototype.init = function()
{
    $(this.canvas).mousemove(
        $.throttle(100, $.proxy(this.gameTileHighlighter, this))
    );

    $(this.canvas).click($.proxy(this.onClicked, this));
};

Interface.prototype.onZoom = function(event)
{
    if (event.zoom)
        this.zoom = event.zoom;
};

Interface.prototype.onScroll = function(event)
{
    if (event.position)
    {
        this.pos.x = event.position.x;
        this.pos.y = event.position.y;
    }
};

Interface.prototype.onClicked = function(event)
{
    console.log("tileclick");
    var gameTile = this.getTileFromEvent(event);

    var clickTileEvent = new Event("player", "ClickTileEvent");
    clickTileEvent.tile = gameTile;
    clickTileEvent.domEvent = event;

    this.dispatcher.dispatch(clickTileEvent);
};

Interface.prototype.gameTileHighlighter = function(event)
{
    var gameTile = this.getTileFromEvent(event);

    if (this.mouseoverTile !== null && this.mouseoverTile != gameTile)
    {
        this.dispatchMouseTileEvent(this.mouseoverTile, true);
    }

    if (this.mouseoverTile === null || this.mouseoverTile != gameTile)
    {
        this.dispatchMouseTileEvent(gameTile, false);
        this.mouseoverTile = gameTile;
    }
    //console.log('mouseover gametile x: ' + gameTile.position.x + ', y: ' + gameTile.position.y
    //    + ' e: ' + gameTile.elevation + ' elevation string: ' + gameTile.getElevationDifferenceString());

    //Contours.testMatches(gameTile.getElevationDifferenceString());
};

Interface.prototype.dispatchMouseTileEvent = function(tile, out)
{
    var eventName = out ? "GameTileMouseOutEvent" : "GameTileMouseOverEvent";
    var event = new Event("player", eventName);
    event.tile = tile;

    this.dispatcher.dispatch(event);
};

Interface.prototype.getTileFromEvent = function(event)
{
    var coordinates = this.coordinateService.viewPortToGridCoordinates(
        this.canvas.offsetLeft,
        this.canvas.offsetTop,
        window.innerWidth,
        window.innerHeight,
        this.pos.x,
        this.pos.y,
        this.zoom,
        event.pageX,
        event.pageY
    );
    var tileIndex = this.coordinateService.gridCoordinatesToTileId(coordinates.x, coordinates.y);
    return this.tileGrid.gameTiles[tileIndex];
};
