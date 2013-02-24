var UnitMoveAnimation = function(unit, start, target, azimuth, turretFacing)
{
    Animation.call(this);

    this.unit = unit;
    this.start = start;
    this.target = target;
    this.timeElapsed = 0;
    this.azimuth = azimuth;
    this.turretFacing = turretFacing;

    this.movementTime = MathLib.distance(this.start, this.target)*100;
}

UnitMoveAnimation.prototype = Object.create( Animation.prototype );

UnitMoveAnimation.prototype.tick = function()
{
    if (this.timeElapsed == 0)
    {
        this.unit.lookAt(this.azimuth);
        this.unit.faceTurretAt(this.turretFacing);
    }

    var time = this.timeSinceLast();
    this.timeElapsed += time;

    var percentage = this.timeElapsed / this.movementTime;

    if (percentage > 1)
        percentage = 1;

    var pos = MathLib.getExactPointBetween(this.start, this.target, percentage);
    this.unit.setIconPosition(pos);

    if (percentage == 1 )
    {
        this.setDone();
        //LineOfSight.calculateLosForUnit(this.unit);
    }
}