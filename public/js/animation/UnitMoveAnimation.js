var UnitMoveAnimation = function(unit, route, wait, scrolling)
{
    Animation.call(this);

    this.unit = unit;
    this.route = route;
    this.start = route[0];

    this.timeToTarget = 0;
    this.timeInThisPart = 0;

    this.routeNumber = -1;

    this.currentPos = this.route[0];
    this.currentPosNumber = 0;

    this.timePerTile = 100;
    this.wait = wait | false;

    this.scrolling = scrolling;
    //this.resolveNextTarget();
};

UnitMoveAnimation.prototype = Object.create( Animation.prototype );

UnitMoveAnimation.prototype.resolveNextTarget = function()
{
    this.routeNumber++;
    this.currentTarget = this.route[this.routeNumber];

    if (this.currentTarget.uf == this.currentPos.uf && this.route.length-1 > this.routeNumber)
    {
        this.resolveNextTarget();
    }
    else
    {
        this.timeToTarget = MathLib.distance(this.currentPos, this.currentTarget)*this.timePerTile;
    }
};

UnitMoveAnimation.prototype.tick = function(time)
{
    if (this.unit.owner != window.gameState.playerId)
    {
        var curCamPos = Graphics.camPosIn3d();
        var unitpos = this.unit.icon.getPositionIn3d();

        var cameradistance = MathLib.distance(curCamPos, unitpos);
        var camp = 0.2;

        this.scrolling.scrollTo3d(MathLib.getExactPointBetween(curCamPos, unitpos, camp));
    }

    this.timeInThisPart += time;

    if (this.routeNumber == -1)
    {
        if (this.timeInThisPart>250 || this.wait === false)
        {
            this.timeInThisPart = 0;
            this.resolveNextTarget();
        }

        return;
    }

    if (this.unit.getAzimuth != this.currentTarget.uf)
    {
        this.unit.lookAt(this.currentTarget.uf);
    }

    var percentage = this.timeInThisPart / this.timeToTarget;

    if (percentage > 1)
        percentage = 1;

    var pos = MathLib.getExactPointBetween(this.currentPos, this.currentTarget, percentage);
    this.unit.setIconPosition(pos);

    if (percentage == 1 )
    {
        if (this.route.length-1 == this.routeNumber)
        {
            this.setDone();
            console.log("Unit move animation ready at time: " + (new Date()).getTime());
        }
        else
        {
            this.currentPosNumber = this.routeNumber;
            this.currentPos = this.currentTarget;
            this.timeInThisPart = 0;
            this.resolveNextTarget();
        }
        //LineOfSight.calculateLosForUnit(this.unit);
    }
}

UnitMoveAnimation.prototype.interrupt = function(routeNumber)
{
    var lastRouteNumber = routeNumber-1;

    if (this.currentPosNumber > lastRouteNumber) //past the interrupt position
    {
        //console.log("Interrupting move animation, past the interrupt position: " + this.currentPosNumber + ", " + lastRouteNumber );
        this.setDone();
        this.unit.setIconPosition(this.route[lastRouteNumber]);
    }
    else //mutilate route
    {
        var howmany = this.route.length - routeNumber + 1;
        this.route.splice(routeNumber, howmany);
        //console.log("Interrupting move animation, mutilating route, new length " + this.route.length );
    }

    if (this.routeNumber == -1)
        return;

    if (this.currentPosNumber < lastRouteNumber && this.routeNumber > lastRouteNumber) //interrupt position between current subroute in animation
    {
        var newTarget = this.route[lastRouteNumber];
        var newTime = MathLib.distance(this.currentPos, newTarget)*this.timePerTile;
        if (this.timeInThisPart > newTime) //Too late, have to revert
        {
            //console.log("Interrupting move animation, past interrupt point, current time: " +  this.timeInThisPart + " interrupt point was at time: " + newTime);
            this.setDone();
            this.unit.setIconPosition(this.route[lastRouteNumber]);
        }
        else
        {
            var percentage = this.timeInThisPart / this.timeToTarget;

            if (percentage > 1)
                percentage = 1;

            this.currentPos = MathLib.getExactPointBetween(this.currentPos, this.currentTarget, percentage);

            this.currentTarget = newTarget;
            this.timeToTarget =  MathLib.distance(this.currentPos, this.currentTarget)*this.timePerTile;
            this.timeInThisPart = 0;
            this.routeNumber = lastRouteNumber;
            //console.log("Interrupting move animation, setting new target: "+ this.currentTarget.x +","+ this.currentTarget.y + " current position: " +  this.currentPos.x +","+this.currentPos.y);
        }
    }
    else
    {
        this.setDone();
        this.unit.setIconPosition(this.route[lastRouteNumber]);
    }
}




