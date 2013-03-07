var UnitAppearAnimation = function(unit)
{
    Animation.call(this);

    this.unit = unit;
    this.timeElapsed = 0;
    this.appearTime = 500;

    this.unit.icon.underSprite.visible = false;
    this.unit.icon.unitSprite.material.opacity = 0;
}

UnitAppearAnimation.prototype = Object.create( Animation.prototype );


UnitAppearAnimation.prototype.tick = function(time)
{
    if (this.timeElapsed ==  0)
    {
        this.unit.showIcon();
        this.timeElapsed += 0.01;

        this.unitpos =
        {
            x:this.unit.icon.group.position.x*2,
            y:this.unit.icon.group.position.y*-2,
        }
    }



    var curCamPos = {
        x:Graphics.camera.position.x*2,
        y: -Graphics.camera.position.y*2
    }


    var cameradistance = MathLib.distance(curCamPos, this.unitpos);

    Graphics.moveCameraToPosition(TileGrid.gameCordinatesTo3d(
        MathLib.getExactPointBetween(curCamPos, this.unitpos, 0.02)));

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
}
