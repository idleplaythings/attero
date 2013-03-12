var Scrolling = function(element, dispatcher)
{
    this.scrollingstarted = 0;
    this.scrolling = false;
    this.lastpos = {x:0, y:0};
    this.scrollingSpeed = 1;
    this.mouseRightButton = 3;
    this.dispatcher = dispatcher;

    this.init(element);

    this.dispatcher.attach(new EventListener("ZoomEvent", this, this.onZoom));

    this.zoom = 1;
};

Scrolling.prototype.constructor =  Scrolling;

Scrolling.prototype.onZoom = function(event)
{
    if (event.zoom)
        this.parent.zoom = event.zoom;
};

Scrolling.prototype.init = function(element)
{
    var o = this;

    element.on(
        "mousedown",
        function(event){ o.mousedown.call(o, event, this.offsetLeft, this.offsetTop);}
    );

    element.on(
        "mouseup",
        function(event){o.mouseup.call(o, event, this.offsetLeft, this.offsetTop);}
    );

    element.on(
        "mouseout",
        function(event){o.mouseout.call(o, event, this.offsetLeft, this.offsetTop);}
    );

    element.on(
        "mousemove",
        function(event){o.mousemove.call(o, event, this.offsetLeft, this.offsetTop);}
    );
};

Scrolling.prototype.mousedown = function(event, offsetLeft, offsetTop)
{
    if (!event || event.which !== this.mouseRightButton)
        return;

    event.stopPropagation(event);

    this.scrolling = true;
    this.scrollingstarted = ((new Date()).getTime());

    var x = event.pageX - offsetLeft;
    var y = event.pageY - offsetTop;

    this.lastpos.x = x;
    this.lastpos.y = y;
};

Scrolling.prototype.mouseup  = function(event, offsetLeft, offsetTop)
{
    this.scrolling = false;

    var now = (new Date()).getTime();
    if (now - this.scrollingstarted < 250)
    {
        var x = event.pageX - offsetLeft;
        var y = event.pageY - offsetTop;
        TileGrid.doGridClicked(x, y, true);
    }
};

Scrolling.prototype.mouseout = function(event)
{
	Scrolling.Scrolling = false;
};

Scrolling.prototype.mousemove = function(event, offsetLeft, offsetTop)
{
	event.stopPropagation(event);

    if (this.scrolling === false)
    {
        return;
    }

    var x = event.pageX - offsetLeft;
    var y = event.pageY - offsetTop;

    var dx = x - this.lastpos.x;
    var dy = y - this.lastpos.y;

    this.scroll(dx,dy);

    this.lastpos.x = x;
    this.lastpos.y = y;
};

Scrolling.prototype.getScrollingSpeed = function()
{
    return this.scrollingSpeed*(1/this.zoom);
};

Scrolling.prototype.scroll = function (dx, dy){
    //console.log("dx: " + dx + ", dy: " + dy);
    var speed = this.getScrollingSpeed();
    var position = {x:dx*speed, y:dy*speed};
    //Graphics.moveCamera({x:dx*speed, y:dy*speed});

    var scrollEvent = new Event("player", "ScrollEvent");
    scrollEvent.position = position;

    this.dispatcher.dispatch(scrollEvent);
};

