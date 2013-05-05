var Event = function(origin, name)
{
    if (origin !== "player" && origin !== "server")
        throw 'Only origins "player" and "server" are supported!';

    this.origin = origin;
    this.id = "ID NOT SET";
    this.name = name;
};

Event.prototype.constructor =  Event;

Event.prototype.setId = function(id)
{
    this.id = id;
};

var EnemySpottedEvent = function(origin, unit)
{
    Event.call(this, origin, "EnemySpottedEvent");
    this.unit = unit;
};

EnemySpottedEvent.prototype = Object.create( Event.prototype );

var EnemyDisappearEvent = function EnemyDisappearEvent(origin, unit)
{
    Event.call(this, origin, "EnemyDisappearEvent");
    this.unit = unit;
};

EnemyDisappearEvent.prototype = Object.create( Event.prototype );