var Dispatcher = function()
{
    this.listeners = Array();
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

Dispatcher.prototype.dispatch = function(event)
{
    if (! this.listeners[event.name])
        return

    for (var i in this.listeners[event.name])
    {
        this.listeners[event.name][i].handle(event);

        if (event.stopped)
            break;
    }
}

var EventListener = function(eventName)
{
    this.eventName = eventName;
}

EventListener.prototype.constructor =  EventListener;
EventListener.prototype.handle = function(event){}

window.EventDispatcher = new Dispatcher();