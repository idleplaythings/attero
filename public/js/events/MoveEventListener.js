
var MoveEventLister = function()
{
    EventListener.call(this, "MoveEvent");
}

MoveEventLister.prototype = Object.create( EventListener.prototype );



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

var UnitMoveAnimationListener = function()
{
    MoveEventLister.call(this);
}

UnitMoveAnimationListener.prototype = Object.create( MoveEventLister.prototype );

UnitMoveAnimationListener.prototype.handle = function(event)
{
    AnimationHandler.addAnimation(new UnitMoveAnimation(event.unit, event.route.slice()));
}