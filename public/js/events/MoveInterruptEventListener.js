var MoveInterruptEventLister = function()
{
    EventListener.call(this, "MoveInterruptEvent");
}

MoveInterruptEventLister.prototype = Object.create( EventListener.prototype );

MoveInterruptEventLister.prototype.handle = function(event)
{
    var routeNumber = event.routeNumber;
    //console.log("Handling move event interrup, routeNumber: " + routeNumber);

    var originalEvent = window.GameEventDispatcher.events[event.eventid];

    window.GameEventDispatcher.revertEverythingAfter(originalEvent);

    //console.log(originalEvent.route);
    var howmany = originalEvent.route.length - routeNumber + 1;
    originalEvent.route.splice(routeNumber, howmany);
    //console.log(originalEvent.route);

    var pos = originalEvent.route[routeNumber-1];

    originalEvent.unit.setPosition(pos);
    originalEvent.animation.interrupt(routeNumber);
}
