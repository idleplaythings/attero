var Raytrace = function(start, end)
{
    this.start = start;
    this.end = end;

    this.starttile = TileGrid.getGameTileByXY(start.x, start.y);
    this.startElevation = this.starttile.elevation;
    this.unitheight = LineOfSight.unitheight;
    this.sumConcealment = 0;
    this.degradation = 0;
    this.angleTreshold = null;
    this.currentElevation = this.startElevation;

}

Raytrace.prototype.run = function()
{
    this.starttile.losConcealment = 0;
    this.bresenhamRaytrace(this.start, this.end);
}

Raytrace.prototype.visit = function(coords)
{
    if (coords.length > 1)
        this.visitCorner(coords);

    this.visitTile(coords.pop())
}

Raytrace.prototype.visitTile = function(pos)
{
    var tile = TileGrid.getGameTileByXY(pos.x, pos.y);
    if (!tile)
        return;

    var distance = Math.floor(MathLib.distance(this.start, tile.position));

    tile.losConcealment = this.sumConcealment + this.degradation;
    this.degradation = distance * LineOfSight.visibilityDegradationPerTile;
    this.sumConcealment += tile.concealment * this.getElevationMultiplier(tile);
    this.calculateAngleTreshold(distance, tile.elevation - (this.startElevation+this.unitheight));
    tile.losConcealment += this.checkElevationVisibility(distance, tile.elevation - this.startElevation);

}

Raytrace.prototype.getElevationMultiplier = function(tile)
{

    var elementHeight = tile.elementHeight;
    var difference = this.startElevation - tile.elevation;

    if (difference>0 && (difference - elementHeight) >= 0)
    {
        return 0;
    }
        return 1;
}

Raytrace.prototype.visitCorner = function(coords)
{
    var corner1 = TileGrid.getGameTileByXY(coords[1].x, coords[1].y);
    var corner2 = TileGrid.getGameTileByXY(coords[2].x, coords[2].y);
    var tile = TileGrid.getGameTileByXY(coords[3].x, coords[3].y);

    this.calculateCornerConcealment(coords);

    if (corner1 && corner2 && tile)
    {
        var distance = Math.floor(MathLib.distance(this.start, tile.position)-0.7);
        var elevation = (corner1.elevation + corner2.elevation)*0.5;
        this.calculateAngleTreshold(distance, elevation - (this.startElevation+this.unitheight));

        if (distance > 100)
        {
            this.degradation = distance * LineOfSight.visibilityDegradationPerTile;

            corner1.losConcealment = this.sumConcealment + this.degradation;
            corner1.losConcealment += this.checkElevationVisibility(distance, corner1.elevation - this.startElevation);

            corner2.losConcealment = this.sumConcealment + this.degradation;
            corner2.losConcealment += this.checkElevationVisibility(distance, corner2.elevation - this.startElevation);
        }
    }
}

Raytrace.prototype.calculateCornerConcealment = function(coords)
{
    var start = TileGrid.getGameTileByXY(coords[0].x, coords[0].y);
    var corner1 = TileGrid.getGameTileByXY(coords[1].x, coords[1].y);
    var corner2 = TileGrid.getGameTileByXY(coords[2].x, coords[2].y);
    var end = TileGrid.getGameTileByXY(coords[3].x, coords[3].y);

    if (
        corner1
        && corner2
        && window.availableTileElements[corner1.subElement] instanceof RoadTileElement
        && corner2.subElement == corner1.subElement
        )
    {
        //console.log("continious");
        if (((!end || end.subElement != corner1.subElement) && (!start || start.subElement != corner1.subElement)))
        {
            var elevationMul = (this.getElevationMultiplier(corner1) + this.getElevationMultiplier(corner2))/2
            this.sumConcealment += corner1.concealment * elevationMul;
        }
    }
    else
    {
        if (corner1)
            this.sumConcealment += corner1.concealment * 0.2 * this.getElevationMultiplier(corner1);

        if (corner2)
            this.sumConcealment += corner2.concealment * 0.2 * this.getElevationMultiplier(corner2);
    }
}

Raytrace.prototype.calculateAngleTreshold = function(distance, elevationDifference)
{
    var newangleTreshold = MathLib.calculateAngle(elevationDifference, distance);
    if (this.angleTreshold === null || newangleTreshold > this.angleTreshold)
    {
        this.angleTreshold = newangleTreshold;
        //console.log("new angletreshold: " + angleTreshold + " distance: " + distance + "elevation diffrence: " + elevationDifference);
    }
}

Raytrace.prototype.checkElevationVisibility = function(distance, elevationDifference)
{
        //console.log(+ MathLib.calculateAngle(elevationDifference, distance)+ " distance: " + distance+ "elevation diffrence: " + elevationDifference);
    if (MathLib.calculateAngle(elevationDifference, distance) < this.angleTreshold)
        return 100;

    return 0;
}

Raytrace.prototype.bresenhamRaytrace = function(start, end, visitfunction)
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

    while(true)
    {
        var e2 = 2*err;
        var coords = Array();
        if (e2 >-dy && e2 < dx)
        {
            coords.push({x:x0, y:y0});
            coords.push({x:x0+sx, y:y0});
            coords.push({x:x0, y:y0+sy});
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

        coords.push({x:x0, y:y0});
        this.visit(coords);

        if ((x0==x1) && (y0==y1))
            break;
    }
}
