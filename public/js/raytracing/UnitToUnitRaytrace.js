var UnitToUnitRaytrace = function UnitToUnitRaytrace(unitheight, degradation, route, partialUnitHeight, fullUnitHeight)
{
    this.start = route.shift();
    this.target = route[route.length -1];
    this.unitheight = unitheight;
    this.route = route;

    this.observerEyeElevation = this.start.elevation+unitheight;

    var distance = MathLib.distance(this.start.position, this.target.position);

    this.elevationPerTileToPartial =  ((this.target.elevation+partialUnitHeight) - this.observerEyeElevation) / distance;
    this.elevationPerTileToFull =  ((this.target.elevation+fullUnitHeight) - this.observerEyeElevation) / distance;

    this.sumConcealment = Math.floor(distance * degradation);
    this.terrainConcealment = 0;

    this.encounteredElements = [];
};

UnitToUnitRaytrace.prototype.run = function()
{
    this.route.every(function(step)
    {
        if (Array.isArray(step))
        {
            this.visitCorner(step);
        }
        else
        {
            this.visit(step);
        }

        //console.log(this.sumConcealment + ", " + this.terrainConcealment);

        if (this.sumConcealment + this.terrainConcealment >= 100)
            return false;

        return true;
    }, this);

    return this.sumConcealment + this.terrainConcealment;
};

UnitToUnitRaytrace.prototype.visit = function(tile)
{
    this.sumConcealment += this.getConcealmentFromTile(tile, 1.0);
    this.getTerrainConcealmentFromTile(
        MathLib.distance(this.start.position, tile.position),
        tile.elevation);
};

UnitToUnitRaytrace.prototype.visitCorner = function(tiles)
{
    var tileA = tiles[0];
    var tileB = tiles[1];

    this.sumConcealment += this.getConcealmentFromTile(tileA, 0.2);
    this.sumConcealment += this.getConcealmentFromTile(tileB, 0.2);

    var cornerPos = {x:0, y:0};
    cornerPos.x = (tileA.position.x + tileB.position.x) / 2;
    cornerPos.y = (tileA.position.y + tileB.position.y) / 2;

    var distance = MathLib.distance(this.start.position, cornerPos);
    var elevation = Math.floor((tileA.elevation + tileB.elevation) / 2);

    this.getTerrainConcealmentFromTile(distance, elevation);
};

UnitToUnitRaytrace.prototype.getConcealmentFromTile = function(tile, multi)
{
    //console.log(tile);
    var distance = MathLib.distance(this.start.position, tile.position);
    var sightCutoutToPartial = this.observerEyeElevation + distance * this.elevationPerTileToPartial;
    var sightCutoutToFull = this.observerEyeElevation + distance * this.elevationPerTileToFull;

    //console.log("distance: " + distance + " startEle: " + this.observerEyeElevation + " elePerTileToFloor: " + this.elevationPerTileToPartial);

    //console.log("tile elevation: " + tile.elevation + " elementheight: " + tile.elementHeight+ " floor cutoff: " + sightCutoutToPartial);

    if (tile.elevation + tile.elementHeight > sightCutoutToPartial)
    {
        if (tile.unique && this.encounteredElements[tile.element] === true)
            return 0;

        if (tile.unique)
        {
            multi = 1.0;
            this.encounteredElements[tile.element] = true;
        }

        return Math.floor(tile.concealment*multi);
    }

    return 0;
};

UnitToUnitRaytrace.prototype.getTerrainConcealmentFromTile = function(distance, elevation)
{
    var sightCutoutToPartial = this.observerEyeElevation + distance * this.elevationPerTileToPartial;
    var sightCutoutToFull = this.observerEyeElevation + distance * this.elevationPerTileToFull;

    var concealment = 0;

    //console.log("elevation: " +elevation + " floor: " + sightCutoutToPartial +  " waist: " +  sightCutoutToFull);
    //ground of this tile cuts out sight to floor
    if (elevation > sightCutoutToPartial)
    {
        //ground of this tile cuts out sight to waist level
        if (elevation > sightCutoutToFull)
        {
            concealment = 100;
        }
        else
        {
            concealment = 50;
        }
    }

    if (this.terrainConcealment < concealment)
        this.terrainConcealment = concealment;
};






