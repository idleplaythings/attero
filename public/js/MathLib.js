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

    bresenhamRaytrace: function(start, end, weight, visitfunction)
    {
        var x0 = start.x;
        var x1 = end.x;
        var y0 = start.y;
        var y1 = end.y;

        var dx = Math.abs(x1-x0);
        var dy = Math.abs(y1-y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx-dy;

        while(true)
        {
            var e2 = 2*err;

            if (e2 >-dy && e2 < dx)
            {
                //console.log("nolla");
                visitfunction(x0+sx,y0, weight);
                visitfunction(x0,y0+sy, weight);
            }

            if (e2 >-dy)
            {
                err -= dy;
                x0  += sx;
            }

            if (e2 < dx)
            {
                err += dx;
                y0  += sy;
            }

            visitfunction(x0,y0, 1);

            if ((x0==x1) && (y0==y1))
                break;
        }
    },

    raytrace: function(start, end, visitfunction)
    {
        var dx = Math.abs(end.x - start.x);
        var dy = Math.abs(end.y - start.y);
        var x = start.x;
        var y = start.y;
        var n = 1 + dx + dy;

        if (end.x > start.x)
            x_inc = 1;
        else
            x_inc = -1;

        if (end.y > start.y)
            y_inc = 1;
        else
            y_inc = -1;

        var error = dx - dy;
        dx = dx * 2;
        dy = dy * 2;

        while (n > 1)
        {
            if (error > 0)
            {
                x = x + x_inc;
                error = error - dy;
            }
            else if (error == 0)
            {
                visitfunction(x+x_inc, y, 0.5);
                visitfunction(x, y+y_inc, 0.5);
                x += x_inc;
                y += y_inc;

                error = error + dx;
                error = error - dy;
                n--;
            }
            else
            {
                y = y + y_inc;
                error = error + dx;
            }

            if (visitfunction(x,y,1) === false)
                return;

            console.log(error);
            n--;
        }
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
            //console.log("h:1");
            heading = MathLib.radianToDegree(Math.atan(dX/Math.abs(dY)));
        }else if (dX>0 && dY>0 ){
            //console.log("h:2");
            heading = MathLib.radianToDegree(Math.atan(dY/dX)) + 90;
        }else if (dX<0 && dY>0){
            //console.log("h:3");
            heading = MathLib.radianToDegree(Math.atan(Math.abs(dX)/dY)) + 180;
        }else if (dX<0 && dY<0){
            //console.log("h:4");
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
}