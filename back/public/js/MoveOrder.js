var MoveOrder = function(unit, end)
{
    this.unit = unit;
    this.start = unit.position;
    this.end = end;
    this.route = Array();
}

MoveOrder.prototype.execute = function()
{
    this.bresenhamRaytrace(this.start, this.end, this.visit);
    return this.routeToMessage();
}

MoveOrder.prototype.routeToMessage = function()
{
    var routeString = Array();

    for (var i in this.route)
    {
        var pos = this.route[i];
        routeString.push(pos.x +","+pos.y+",0,0");
        //last zeros: unit facing (reversing unit, for example), and turret facing.
    }

    return routeString.join(";");
}

MoveOrder.prototype.visit = function(coords)
{
    //TODO: check if you can move to this tile. If not, halt
    this.route.push(coords.pop());
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