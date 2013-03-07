
var EnemySpottedEventLister = function()
{
    EventListener.call(this, "EnemySpottedEvent");
}

EnemySpottedEventLister.prototype = Object.create( EventListener.prototype );


var UnitAppearAnimationListener = function()
{
    EnemySpottedEventLister.call(this);
}

UnitAppearAnimationListener.prototype = Object.create( EnemySpottedEventLister.prototype );

UnitAppearAnimationListener.prototype.handle = function(event)
{
    console.log("handling unit appear");
    event.animation = new UnitAppearAnimation(event.unit);
    AnimationHandler.addAnimation(event.animation);
}

UnitAppearAnimationListener.prototype.reverse = function(event)
{
    event.animation.setDone();
    event.unit.hideIcon();
}