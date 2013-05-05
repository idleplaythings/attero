var UnitDisappearAnimation = function(unit, scrolling)
{
    Animation.call(this);

    this.scrolling = scrolling;
    this.unit = unit;
    this.timeElapsed = 0;
    this.appearTime = 500;
};

UnitDisappearAnimation.prototype = Object.create( Animation.prototype );

UnitDisappearAnimation.prototype.tick = function(time)
{
    if (this.timeElapsed === 0)
    {
        this.timeElapsed += 0.01;
        this.unitpos = this.unit.icon.getPositionIn3d();
    }

    var curCamPos = Graphics.camPosIn3d();
    var cameradistance = MathLib.distance(curCamPos, this.unitpos);

    this.scrolling.scrollTo3d(MathLib.getExactPointBetween(curCamPos, this.unitpos, 0.02));

    if (cameradistance < 5)
    {
        this.timeElapsed += time;
    }

    var opacity = 1 - (this.timeElapsed / this.appearTime);

    if (opacity < 0)
        opacity = 0;

    this.unit.icon.unitSprite.material.opacity = opacity;

    if (opacity === 0)
    {
        this.unit.hideUnit();
        this.setDone();
    }
};
