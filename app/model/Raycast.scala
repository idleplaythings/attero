package models;

import models.repositories.TileRepository

class Raycast(val start: (Int, Int), val target: (Int, Int), val tileRepository: TileRepository)
{

    /*
    def bresenham(start: (Int, Int), end: (Int, Int)): List[(Int, Int, Int)] =
    {
        /*
        var (x0, y0) = start;
        var (x1, y1) = end;

        var dx = math.abs(x1-x0);
        var dy = math.abs(y1-y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx-dy;

        while(true)
        {
            var e2 = 2*err;
            var coords = Array();
            if (e2 >-dy && e2 < dx)
            {
                coords.push({x:x0, y:y0});
                coords.push({x:x0+sx, y:y0});
                coords.push({x:x0, y:y0+sy});
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

            coords.push({x:x0, y:y0});
            this.visit(coords);

            if ((x0==x1) && (y0==y1))
                break;
        }
        */
    }
    */
}