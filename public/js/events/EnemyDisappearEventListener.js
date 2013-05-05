
var EnemyDisappearEventLister = function()
{
    EventListener.call(this, "EnemyDisappearEvent");
};

EnemyDisappearEventLister.prototype = Object.create( EventListener.prototype );


var EnemyDisappearAnimationListener = function(scrolling)
{
    this.scrolling = scrolling;
    EnemyDisappearEventLister.call(this);
};

EnemyDisappearAnimationListener.prototype = Object.create( EnemyDisappearEventLister.prototype );

EnemyDisappearAnimationListener.prototype.handle = function(event)
{
    console.log("handling unit disappear");
    event.animation = new UnitDisappearAnimation(event.unit, this.scrolling);
    AnimationHandler.addAnimation(event.animation);
};

EnemyDisappearAnimationListener.prototype.reverse = function(event)
{
    event.animation.setDone();
    event.unit.showUnit();
};