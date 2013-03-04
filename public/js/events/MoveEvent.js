var MoveEvent = function(origin, unit, route)
{
    Event.call(this, origin, "MoveEvent");
    this.unit = unit;
    this.route = route;
}

MoveEvent.prototype = Object.create( Event.prototype );