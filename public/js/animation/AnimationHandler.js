AnimationHandler = {

    animationQueue: Array(),
    animating: false,
    timeLastTick: (new Date()).getTime(),

    addAnimation: function(animation)
    {
        AnimationHandler.animationQueue.push(animation);
    },

    tick: function()
    {
        var now = (new Date()).getTime();
        var time = now - AnimationHandler.timeLastTick;

        if (AnimationHandler.animationQueue[0])
        {
            if (AnimationHandler.animationQueue[0].done)
            {
                AnimationHandler.animationQueue.shift();
                AnimationHandler.tick();
                return;
            }

            AnimationHandler.animating = true;
            AnimationHandler.animationQueue[0].tick(time);
        }
        else
        {
            AnimationHandler.animating = false;
        }
        AnimationHandler.timeLastTick = now;
    }
}

var Animation = function()
{
    this.done = false;
}
Animation.prototype.constructor =  Animation;
Animation.prototype.tick = function(time){}
Animation.prototype.reverse = function(){}

Animation.prototype.setDone = function()
{
    this.done = true;
}
