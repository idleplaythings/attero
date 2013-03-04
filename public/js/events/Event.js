var Event = function(origin, name)
{
    if (origin !== "player" && origin !== "server")
        throw 'Only origins "player" and "server" are supported!'

    this.origin = origin;
    this.id = "ID NOT SET";
    this.name = name;
}

Event.prototype.constructor =  Event;

Event.prototype.setId = function(id)
{
    this.id = id;
}
