var MoveInterruptEvent = function(origin, eventid, routeNumber)
{
    Event.call(this, origin, "MoveInterruptEvent");
    this.eventid = eventid;
    this.routeNumber = routeNumber;

    console.log("MoveInterruptEvent at time: " + (new Date()).getTime());
}

MoveInterruptEvent.prototype = Object.create( Event.prototype );