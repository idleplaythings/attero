
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
    console.log("handling UnitPosition");
    console.log(event);
    event.unit.setPosition(event.route[event.route.length-1]);
}



var UnitMoveAnimationListener = function()
{
    MoveEventLister.call(this);
}

UnitMoveAnimationListener.prototype = Object.create( MoveEventLister.prototype );

UnitMoveAnimationListener.prototype.handle = function(event)
{
    console.log("handling UnitAnimation");
    console.log(event);

    AnimationHandler.addAnimation(new UnitMoveAnimation(
        event.unit, event.start, event.route[event.route.length-1], event.azimuth, event.turretFacing));
}