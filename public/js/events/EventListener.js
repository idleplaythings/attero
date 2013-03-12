var EventListener = function(eventName, parent, handleCallback)
{
    this.eventName = eventName;
    this.parent = parent;
    this.handleCallback = handleCallback;
};

EventListener.prototype.constructor =  EventListener;

EventListener.prototype.handle = function(event)
{
    if (this.handleCallback && typeof(this.handleCallback) === "function" )
        this.handleCallback(event);
};

EventListener.prototype.reverse = function(event){};