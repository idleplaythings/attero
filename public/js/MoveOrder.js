var MoveOrder = function(unit, end)
{
    this.unit = unit;

    this.start = {
        x:      unit.position.x,
        y:      unit.position.y,
        tf:     unit.getTurretFacing(),
        uf:     unit.getAzimuth()
    };

    this.end = end;
    this.route = Array(this.start);
}

MoveOrder.prototype.execute = function()
{
    this.bresenhamRaytrace(this.start, this.end, this.visit);
}

MoveOrder.prototype.visit = function(coords)
{
    //TODO: check if you can move to this tile. If not, halt
    var pos = coords.pop();
    var waypoint = {
        x:      pos.x,
        y:      pos.y,
        tf:     this.start.tf,
        uf:     this.start.uf
    };

    this.route.push(waypoint);
}

MoveOrder.prototype.bresenhamRaytrace = function(start, end, visitfunction)
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