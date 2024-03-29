window.MathLib =
{
    // a: vastakkainen kateetti, b: viereinen kateetti
    calculateAngle: function(a, b)
    {
        return MathLib.radianToDegree(Math.atan(a/b));

    },

    getPointInDirection: function( r, a, cx, cy){

        a = MathLib.addToAzimuth(a, -90);
        x = cx + r * Math.cos(a* Math.PI / 180);
        y = cy + r * Math.sin(a* Math.PI / 180);

        return {x:Math.round(x), y:Math.round(y)};
    },

    addToAzimuth: function(current, add){
        add = add % 360;

        var ret = 0;
        if (current + add > 360){
            ret =  0+(add-(360-current));

        }else if (current + add < 0){
            ret = 360 + (current + add);
        }else{
            ret = current + add;
        }

        return ret;
    },

    distance: function(start, end){
        return Math.sqrt((end.x-start.x)*(end.x-start.x) + (end.y-start.y)*(end.y-start.y));
    },

    getAzimuthFromTarget: function(observer, target){
        var dX = target.x - observer.x;
        var dY = target.y - observer.y;
        var heading = 0.0;
        //console.log("dX: " +dX+ " dY: " + dY);
        if (dX == 0){
            if (dY>0){
                heading = 180.0;
            }else{
                heading = 0.0;
            }

        }else if (dY == 0){
            if (dX>0){
                heading = 90.0;
            }else{
                heading = 270.0;

            }
        }else if (dX>0 && dY<0 ){
            heading = MathLib.radianToDegree(Math.atan(dX/Math.abs(dY)));
        }else if (dX>0 && dY>0 ){
            heading = MathLib.radianToDegree(Math.atan(dY/dX)) + 90;
        }else if (dX<0 && dY>0){
            heading = MathLib.radianToDegree(Math.atan(Math.abs(dX)/dY)) + 180;
        }else if (dX<0 && dY<0){
            heading = MathLib.radianToDegree(Math.atan(dY/dX)) + 270;
        }

        return Math.round(heading);
    },

    radianToDegree: function(angle){
        return angle * (180.0 / Math.PI);
    },

    degreeToRadian: function(angle){
        return (angle / (180.0 / Math.PI));
    },

    getExactPointBetween: function(start, end, percentage){
        var x = start.x + percentage * (end.x - start.x);
        var y = start.y + percentage * (end.y - start.y);

        return {x:x, y:y};
    },

    getPointBetween: function(start, end, percentage){
        var x = Math.floor(start.x + percentage * (end.x - start.x));
        var y = Math.floor(start.y + percentage * (end.y - start.y));

        return {x:x, y:y};
    },
}