var Dispatcher = function()
{
    this.listeners = Array();
    this.events = Array();
}

Dispatcher.prototype.attach = function(listener)
{
    if (! this.listeners[listener.eventName])
    {
        this.listeners[listener.eventName] = Array(listener);
    }
    else
    {
        this.listeners[listener.eventName].push(listener);
    }
}

Dispatcher.prototype.dispatch = function(event, revert)
{
    var handleFunction = revert ? "revert" : "handle"

    if (! revert)
    {
        var eventid = this.events.length;
        event.setId(eventid);
        this.events[eventid] = event;
    }

    console.log("event "+handleFunction+": " + +event.id +":"+ event.name)

    if (! this.listeners[event.name])
        return

    for (var i in this.listeners[event.name])
    {
        this.listeners[event.name][i][handleFunction](event);

        if (event.stopped)
            break;
    }
}

Dispatcher.prototype.revertEverythingAfter = function(event)
{
    var eventid = event.id;

    for (var i = this.events.length-1; i > eventid; i--)
    {
        var victim = this.events[i];
        if (victim.origin !== "player")
            continue;

        this.revertEvent(victim);
    }
}

Dispatcher.prototype.revertEvent = function(event)
{
    this.dispatch(event, true);
    this.events.splice(event.id, 1);
}

var EventListener = function(eventName)
{
    this.eventName = eventName;
}

EventListener.prototype.constructor =  EventListener;
EventListener.prototype.handle = function(event){}
EventListener.prototype.reverse = function(event){}

window.EventDispatcher = new Dispatcher();