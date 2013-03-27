var Scrolling = function(element, dispatcher)
{
    this.scrollingstarted = 0;
    this.scrolling = false;
    this.lastpos = {x:0, y:0};
    this.scrollingSpeed = 1;
    this.mouseRightButton = 3;
    this.dispatcher = dispatcher;
    this.position = {x:0, y:0};
    this.element = element;

    this.dispatcher.attach(new EventListener("ZoomEvent", $.proxy(this.onZoom, this)));

    this.zoom = 1;
};

Scrolling.prototype.constructor =  Scrolling;

Scrolling.prototype.onZoom = function(event)
{
    if (event.zoom)
        this.zoom = event.zoom;
};

Scrolling.prototype.init = function()
{
    var o = this;

    this.element.on("mousedown", $.proxy(this.mousedown, this));
    this.element.on("mouseup", $.proxy(this.mouseup, this));
    this.element.on("mouseout", $.proxy(this.mouseout, this));
    this.element.on("mousemove", $.proxy(this.mousemove, this));

    this.scrollTo({x:window.innerWidth/2, y:-window.innerHeight/2});
};

Scrolling.prototype.mousedown = function(event)
{
    if (!event || event.which !== this.mouseRightButton)
        return;

    event.stopPropagation(event);

    var offsetLeft = this.element[0].offsetLeft;
    var offsetTop = this.element[0].offsetTop;

    this.scrolling = true;
    this.scrollingstarted = ((new Date()).getTime());

    var x = event.pageX - offsetLeft;
    var y = event.pageY - offsetTop;

    this.lastpos.x = x;
    this.lastpos.y = y;
};

Scrolling.prototype.mouseup  = function(event)
{
    this.scrolling = false;
};

Scrolling.prototype.mouseout = function(event)
{
	Scrolling.Scrolling = false;
};

Scrolling.prototype.mousemove = function(event)
{
	event.stopPropagation(event);

    if (this.scrolling === false)
    {
        return;
    }

    var offsetLeft = this.element[0].offsetLeft;
    var offsetTop = this.element[0].offsetTop;

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

    this.position.x -= position.x;
    this.position.y += position.y;

    if (this.position.x < 0 )
        this.position.x = 0;

    if (this.position.y > 0 )
        this.position.y = 0;

    //Graphics.moveCamera({x:dx*speed, y:dy*speed});

    var scrollEvent = new Event("player", "ScrollEvent");
    scrollEvent.position = this.position;

    this.dispatcher.dispatch(scrollEvent);
};

Scrolling.prototype.scrollTo = function(pos)
{
    this.position.x = pos.x;
    this.position.y = pos.y;
    //Graphics.moveCamera({x:dx*speed, y:dy*speed});

    var scrollEvent = new Event("player", "ScrollEvent");
    scrollEvent.position = this.position;

    this.dispatcher.dispatch(scrollEvent);
};

