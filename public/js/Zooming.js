
var Zooming = function(element, dispatcher)
{
    this.wheeltimer = null;
    this.wheelzoom = 0;
    this.zoominprogress = false;
    this.zoom = 1;
    this.dispatcher = dispatcher;

    this.init(element);
};

Zooming.prototype.constructor = Zooming;

Zooming.prototype.init = function(element)
{
    this.bindEvent(element);
};

Zooming.prototype.mouseWheel = function(e)
{
    e = e ? e : window.event;
    var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;

    if ( wheelData < 0)
        this.wheelzoom--;
    else
        this.wheelzoom++;

    if (this.wheeltimer === null && this.zoominprogress === false)
    {
        var o = this;
        var callback = function(event){o.wheelCallback.call(o);};
        this.wheeltimer = setTimeout(callback, 100);
    }

    return this.cancelEvent(e);
};

Zooming.prototype.wheelCallback = function()
{
    this.zoominprogress = true;
    var m = this.wheelzoom;
    this.wheelzoom = 0;

    this.wheeltimer = null;

    this.changeZoom(m);
};

Zooming.prototype.changeZoom = function(zoom)
{
    zoom *= 0.1;
    this.zoominprogress = false;
    var newzoom = this.zoom + zoom;

    if (newzoom < 0.2)
        newzoom = 0.2;

    if (newzoom > 2)
        newzoom = 2;

    newzoom = parseFloat(newzoom.toFixed(1));
    this.zoom = newzoom;

    var zoomEvent = new Event("player", "ZoomEvent");
    zoomEvent.zoom = newzoom;

    this.dispatcher.dispatch(zoomEvent);
};

Zooming.prototype.bindEvent = function(element)
{
    element = element.get(0);

    var o = this;
    var callback = function(event){o.mouseWheel.call(o, event);};

    if(element.addEventListener)
    {
        element.addEventListener('DOMMouseScroll', callback, false);
        element.addEventListener('mousewheel', callback, false);
    }
};

Zooming.prototype.cancelEvent = function(e)
{
    e = e ? e : window.event;
    if(e.stopPropagation)
    e.stopPropagation();
    if(e.preventDefault)
    e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
};
