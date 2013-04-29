var BresenhamRoute = function BresenhamRoute(start, end, tileRepository)
{
    this.start = start;
    this.end = end;
    this.tileRepository = tileRepository;
};

BresenhamRoute.prototype.getRoute = function()
{
    return this.bresenhamRaytrace(this.start, this.end);
};

BresenhamRoute.prototype.getRouteWithDetails = function()
{
    if ( ! this.tileRepository)
        throw "You need to give a valid tileRepository (TileGrid)";

    var route = this.bresenhamRaytrace(this.start, this.end);

    var newRoute = [];

    route.every(function(step)
    {
        if (step.isArray)
        {
            var tileA = this.tileRepository.getGameTileByXY(step[1].x, step[1].y);
            var tileB = this.tileRepository.getGameTileByXY(step[2].x, step[2].y);

            //if either corner is out of the map, ignore.
            if ( ! tileA || ! tileB)
                return true;

            newRoute.push([this.getDetailsFromTile(tileA), this.getDetailsFromTile(tileA)]);
        }
        else
        {
            var tile = this.tileRepository.getGameTileByXY(step.x, step.y);

            //No tile found? Must have gone over map edge!
            if (! tile)
                return false;

            newRoute.push(this.getDetailsFromTile(tile));
        }

        return true;
    });

    return newRoute;
};

BresenhamRoute.prototype.getDetailsFromTile = function(tile)
{
    return new TileDetailsForRaytrace(
        tile.position,
        tile.concealment,
        tile.subElement,
        tile.elevation,
        tile.elementHeight,
        tile.unique
    );
};

BresenhamRoute.prototype.bresenhamRaytrace = function(start, end)
{
    var x0 = start.x;
    var x1 = end.x;
    var y0 = start.y;
    var y1 = end.y;

    var dx = Math.abs(x1-x0);
    var dy = Math.abs(y1-y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx-dy;

    var route = [];

    this.route.push({x:x0, y:y0});

    while(true)
    {
        var e2 = 2*err;

        if (e2 >-dy && e2 < dx)
        {
            this.route.push([{x:x0+sx, y:y0}, {x:x0, y:y0+sy}]);
        }

        if (e2 >-dy)
        {
            err -= dy;
            x0  += sx;
        }

        if (e2 < dx)
        {
            err += dx;
            y0  += sy;
        }

        this.route.push({x:x0, y:y0});

        if ((x0==x1) && (y0==y1))
            break;
    }

    return route;
};