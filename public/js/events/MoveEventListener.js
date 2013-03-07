
var MoveEventLister = function()
{
    EventListener.call(this, "MoveEvent");
}

MoveEventLister.prototype = Object.create( EventListener.prototype );

var MoveServerMessageEventLister = function()
{
    MoveEventLister.call(this);
}

MoveServerMessageEventLister.prototype = Object.create( MoveEventLister.prototype );

MoveServerMessageEventLister.prototype.handle = function(event)
{
    console.log("Server message: " + event.name + " origin: " + event.origin + " at time: " + (new Date()).getTime());
    if (event.name == "MoveEvent" && event.origin == "player")
    {
        ServerConnection.sendMessage({
            type: "Move",
            id: event.id,
            payload: {
                unitId: event.unit.id,
                moveroute: this.routeToMessage(event.route)
            }
        });
    }
}

MoveServerMessageEventLister.prototype.routeToMessage = function(route)
{
    var routeString = Array();

    for (var i in route)
    {
        var pos = route[i];
        routeString.push(pos.x +","+pos.y+","+pos.tf+","+pos.uf);
    }

    return routeString.join(";");
}

var UnitPositionListener = function()
{
    MoveEventLister.call(this);
}

UnitPositionListener.prototype = Object.create( MoveEventLister.prototype );

UnitPositionListener.prototype.handle = function(event)
{
    var end = event.route[event.route.length-1];
    var pos = {x: end.x, y: end.y};
    event.unit.setPosition(pos);
}

UnitPositionListener.prototype.reverse = function(event)
{
    var start = event.route[0];
    var pos = {x: start.x, y: start.y};
    event.unit.setPosition(pos);
}

var UnitMoveAnimationListener = function()
{
    MoveEventLister.call(this);
}

UnitMoveAnimationListener.prototype = Object.create( MoveEventLister.prototype );

UnitMoveAnimationListener.prototype.handle = function(event)
{
    var wait = (event.origin == "player");

    event.animation = new UnitMoveAnimation(event.unit, event.route.slice(), wait);
    AnimationHandler.addAnimation(event.animation);
}

UnitMoveAnimationListener.prototype.reverse = function(event)
{
    event.animation.setDone();
    var start = event.route[0];
    var pos = {x: start.x, y: start.y};
    event.unit.setIconPosition(start);
}



