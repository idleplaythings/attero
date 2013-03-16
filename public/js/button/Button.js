var Button = function Button(element, background, dispatcher, event)
{
    this.dispatcher = dispatcher;
    this.eventToDispatch = event;
    this.createElement(element, background);
};

Button.prototype.createElement = function(element, background)
{
    var button = $('<button style="background-image:url(/assets/resource/'+background+')">');

    button.on('click', $.proxy(this.onClick, this));
    button.appendTo(element);
};

Button.prototype.onClick = function(e)
{
    e.stopPropagation();
    var newEvent = jQuery.extend({}, this.eventToDispatch);
    this.dispatcher.dispatch(newEvent);
};