var LOSRaytrace = function(start, end)
{
    this.start = start;
    this.end = end;

    this.starttile = TileGrid.getGameTileByXY(start.x, start.y);
    this.startElevation = this.starttile.elevation;

    this.unitheight = LineOfSight.unitheight;
    this.sumConcealment = 0;
    this.elevationConcealment = 0;
    this.degradation = 0;
    this.angleTreshold = null;
    this.currentElevation = this.startElevation;

    this.encounteredUniques = [];

};

LOSRaytrace.prototype.run = function()
{
    this.starttile.losConcealment = 0;
    this.bresenhamRaytrace(this.start, this.end);
};

LOSRaytrace.prototype.visit = function(a)
{
    var tile = TileGrid.getGameTileByXY(a.x, a.y);
    if (!tile)
        return;

    var distance = MathLib.distance(this.start, a);

    this.calculateDegradation(distance);
    this.calculateAngleTreshold(distance, tile.elevation);
    this.elevationConcealment = this.getElevationVisibility(distance, tile.elevation);
    this.setTileConcealment(tile, distance);
    this.calculateConcealment(tile, 1);
};

LOSRaytrace.prototype.visitCorner = function(a, b)
{
    var tileA = TileGrid.getGameTileByXY(a.x, a.y);
    var tileB = TileGrid.getGameTileByXY(b.x, b.y);

    if ( ! tileA || ! tileB )
        return;

    var cornerPos = {x:0, y:0};
    cornerPos.x = (a.x + b.x) / 2;
    cornerPos.y = (a.y + b.y) / 2;

    var distance = MathLib.distance(this.start, cornerPos);
    var elevation = Math.floor((tileA.elevation + tileB.elevation) / 2);

    this.calculateAngleTreshold(distance, elevation);
    this.calculateConcealment(tileA, 0.2);
    this.calculateConcealment(tileB, 0.2);
};

LOSRaytrace.prototype.setTileConcealment = function(tile, distance)
{
        var concealment = (this.sumConcealment + this.elevationConcealment + this.degradation);
        if (tile.losConcealment > concealment)
            tile.losConcealment = concealment;
};

LOSRaytrace.prototype.calculateDegradation = function(distance)
{
    this.degradation = distance * LineOfSight.visibilityDegradationPerTile;
};

LOSRaytrace.prototype.calculateConcealment = function(tile, multi)
{
    var concealment = tile.concealment;
    var elementid = tile.subElement;

    if (elementid !== 0)
    {
        element = TileRepository.getElement(elementid);

        if (element.unique)
        {
            if ($.inArray(elementid, this.encounteredUniques))
            {
                concealment = 0;
            }
            else
            {
                this.encounteredUniques.push = elementid;
                multi = 1;
            }
        }
    }

    this.sumConcealment += concealment * this.getElevationMultiplier(tile) * multi;
};

LOSRaytrace.prototype.getElevationMultiplier = function(tile)
{

    var elementHeight = tile.elementHeight;
    var difference = this.startElevation - tile.elevation;

    if (difference>0 && (difference - elementHeight) >= 0)
    {
        return 0;
    }
    return 1;
};

LOSRaytrace.prototype.calculateAngleTreshold = function(distance, elevation)
{
    var observerEyeLevel = (this.startElevation+this.unitheight);
    var targetFloorLevel = elevation;

    var toFloorLevel = targetFloorLevel - observerEyeLevel;

    var newangleTreshold = MathLib.calculateAngle(toFloorLevel, distance);
    if (this.angleTreshold === null || newangleTreshold > this.angleTreshold)
    {
        this.angleTreshold = newangleTreshold;
        //console.log("new angletreshold: " + this.angleTreshold + " distance: " + distance + "elevation diffrence: " + toFloorLevel);
    }
};

LOSRaytrace.prototype.getElevationVisibility = function(distance, elevation)
{
    var observerEyeLevel = (this.startElevation+this.unitheight);
    var targetFloorLevel = elevation;
    var targetWaistLevel = elevation + (this.unitheight/2);

    var toFloorLevel = targetFloorLevel - observerEyeLevel;

    if (MathLib.calculateAngle(toFloorLevel, distance) < this.angleTreshold)
    {
        var toWaistLevel = targetWaistLevel - observerEyeLevel;

        //console.log("waist level angle: " + MathLib.calculateAngle(toWaistLevel, distance)
        //    + " angle threshold: " +this.angleTreshold);
        if (MathLib.calculateAngle(toWaistLevel, distance) >= this.angleTreshold)
        {
            //console.log("waist näkyy");
            return 50;
        }

        return 100;
    }

    return 0;
};


LOSRaytrace.prototype.bresenhamRaytrace = function(start, end, visitfunction)
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

        //console.log("e2: " + e2 + " dy: " +dy + " dx: " +dx);

        if (e2 >-dy && e2 < dx)
        {
            this.visitCorner({x:x0+sx, y:y0}, {x:x0, y:y0+sy});
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

        this.visit({x:x0, y:y0});

        if ((x0==x1) && (y0==y1))
            break;
    }
};
