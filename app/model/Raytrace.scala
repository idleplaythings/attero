package models;

import models.repositories.TileRepository
import models.tiles._

class Raytrace(val start: (Int, Int), val target: (Int, Int), val tileRepository: TileRepository)
{
    val elevationPerTile:Double = tileRepository.getTileElevationByXY(target) - tileRepository.getTileElevationByXY(start);
    var sumConcealment:Int = (MathLib.distance(start, target)*0.5).toInt;

    var encountered: List[Int] = List.empty[Int];

    def run: Int =
    {
        bresenham(start, target);
        sumConcealment;
    }

    private def visitCorner(c1: (Int, Int), c2: (Int, Int)): Unit =
    {
        sumConcealment += getConcealmentFromTile(c1, 0.2);
        sumConcealment += getConcealmentFromTile(c2, 0.2);
    }

    private def visitOne(pos: (Int, Int)): Unit =
    {
        sumConcealment += getConcealmentFromTile(pos, 1.0);
    }

    private def getConcealmentFromTile(pos: (Int, Int), multi: Double): Int =
    {
        var uMulti = multi;
        val (concealment, element, tileElevation, height, cont) = tileRepository.getTileConcealment(pos);

        if (element == 0)
            return 0;

        if (cont == true && encountered.contains(element))
            return 0;

        if (cont == true)
        {
            uMulti = 1.0;
            encountered :+= element;
        }

        val elevation: Double = MathLib.distance(start, pos)*elevationPerTile+0.5;

        if (tileElevation > elevation)
            return (100*uMulti).toInt;

        if (tileElevation + height > elevation)
            return (concealment*uMulti).toInt;;

        0
    }

    private def bresenham(start: (Int, Int), end: (Int, Int)): Unit =
    {
        var (x0, y0) = start;
        var (x1, y1) = end;

        var dx:Int = math.abs(x1-x0);
        var dy:Int = math.abs(y1-y0);
        var sx:Int = -1;
        if (x0 < x1)
            sx = 1 ;

        var sy:Int = -1;
        if (y0 < y1)
            sy =1;

        var err:Int = dx-dy;

        var path = true;
        while(path && sumConcealment < 100)
        {
            var e2:Int = 2*err;

            if (e2 > -dy && e2 < dx)
            {
                this.visitCorner((x0+sx, y0), (x0, y0+sy))
            }

            if (e2 > -dy)
            {
                err -= dy;
                x0  += sx;
            }

            if (e2 < dx)
            {
                err += dx;
                y0  += sy;
            }

            this.visitOne((x0, y0));

            if ((x0 == x1) && (y0 == y1))
                path = false;
        }
    }
}