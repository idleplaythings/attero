var EventListener = function(eventName)
{
    this.eventName = eventName;
};

EventListener.prototype.constructor =  EventListener;
EventListener.prototype.handle = function(event){};
EventListener.prototype.reverse = function(event){};