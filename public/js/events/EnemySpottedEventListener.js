
var EnemySpottedEventLister = function()
{
    EventListener.call(this, "EnemySpottedEvent");
};

EnemySpottedEventLister.prototype = Object.create( EventListener.prototype );


var UnitAppearAnimationListener = function(scrolling)
{
    this.scrolling = scrolling;
    EnemySpottedEventLister.call(this);
};

UnitAppearAnimationListener.prototype = Object.create( EnemySpottedEventLister.prototype );

UnitAppearAnimationListener.prototype.handle = function(event)
{
    console.log("handling unit appear");
    event.animation = new UnitAppearAnimation(event.unit, this.scrolling);
    AnimationHandler.addAnimation(event.animation);
};

UnitAppearAnimationListener.prototype.reverse = function(event)
{
    event.animation.setDone();
    event.unit.hideIcon();
};