AnimationHandler = {

    animationQueue: Array(),
    animating: false,

    addAnimation: function(animation)
    {
        AnimationHandler.animationQueue.push(animation);
    },

    tick: function()
    {
        if (AnimationHandler.animationQueue[0])
        {
            if (AnimationHandler.animationQueue[0].done)
            {
                AnimationHandler.animationQueue.shift();
                AnimationHandler.tick();
                return;
            }

            AnimationHandler.animating = true;
            AnimationHandler.animationQueue[0].tick();
        }
        else
        {
            AnimationHandler.animating = false;
        }
    }
}

var Animation = function()
{
    this.lastTick = (new Date()).getTime();
    this.done = false;
}
Animation.prototype.constructor =  Animation;
Animation.prototype.tick = function(){}

Animation.prototype.setDone = function()
{
    this.done = true;
}

Animation.prototype.timeSinceLast = function()
{
    var now = (new Date()).getTime();
    var time = now - this.lastTick;
    this.lastTick = now;

    return time;
}