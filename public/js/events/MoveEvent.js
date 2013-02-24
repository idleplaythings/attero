var MoveEvent = function(unit, route, azimuth, turretFacing)
{
    this.name = "MoveEvent";
    this.unit = unit;
    this.start = {x:unit.position.x, y:unit.position.y};
    this.azimuth = azimuth;
    this.turretFacing = turretFacing;
    this.route = route;
}