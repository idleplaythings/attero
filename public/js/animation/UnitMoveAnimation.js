var UnitMoveAnimation = function(unit, route)
{
    Animation.call(this);

    this.unit = unit;
    this.route = route;

    this.timeToTarget = 0;
    this.timeInThisPart = 0;

    this.currentPos = this.route.shift();
    this.resolveNextTarget();
}

UnitMoveAnimation.prototype = Object.create( Animation.prototype );

UnitMoveAnimation.prototype.resolveNextTarget = function()
{
    this.currentTarget = this.route.shift();
    if (this.currentTarget.uf == this.currentPos.uf && this.route.length > 0)
    {
        this.resolveNextTarget();
    }
    else
    {
        this.timeToTarget = MathLib.distance(this.currentPos, this.currentTarget)*100;
    }
}

UnitMoveAnimation.prototype.tick = function(time)
{
    if (this.unit.getAzimuth != this.currentTarget.uf)
    {
        this.unit.lookAt(this.currentTarget.uf);
    }

    this.timeInThisPart += time;

    var percentage = this.timeInThisPart / this.timeToTarget;

    if (percentage > 1)
        percentage = 1;

    var pos = MathLib.getExactPointBetween(this.currentPos, this.currentTarget, percentage);
    this.unit.setIconPosition(pos);

    if (percentage == 1 )
    {
        if (this.route.length == 0)
        {
            this.setDone();
        }
        else
        {
            this.currentPos = this.currentTarget;
            this.timeInThisPart = 0;
            this.resolveNextTarget();
        }
        //LineOfSight.calculateLosForUnit(this.unit);
    }
}