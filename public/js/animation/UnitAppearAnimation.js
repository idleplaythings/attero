var UnitAppearAnimation = function(unit, scrolling)
{
    Animation.call(this);

    this.scrolling = scrolling;
    this.unit = unit;
    this.timeElapsed = 0;
    this.appearTime = 500;

    this.unit.icon.underSprite.visible = false;
    this.unit.icon.unitSprite.material.opacity = 0;
};

UnitAppearAnimation.prototype = Object.create( Animation.prototype );

UnitAppearAnimation.prototype.tick = function(time)
{
    if (this.timeElapsed === 0)
    {
        this.unit.showIcon();
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

    var opacity = this.timeElapsed / this.appearTime;

    if (opacity > 1)
        opacity = 1;

    //this.unit.icon.underSprite.material.opacity = opacity;

    this.unit.icon.unitSprite.material.opacity = opacity;

    if (opacity == 1)
    {
        this.unit.icon.underSprite.visible = true;
        this.setDone();
    }
};
