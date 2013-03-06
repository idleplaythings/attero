package models;

import models.repositories.TileRepository
import models.tiles._

class Raytrace(val start: (Int, Int), val target: (Int, Int), val tileRepository: TileRepository)
{
    val elevationPerTile:Double = tileRepository.getTileElevationByXY(target) - tileRepository.getTileElevationByXY(start);
    var sumConcealment:Float = (MathLib.distance(start, target)*0.5).toFloat;

    def run: Int =
    {
        bresenham(start, target);
        math.round(sumConcealment);
    }

    private def visit(tiles: Array[(Int, Int)]): Unit =
    {
        if (tiles.length > 1)
            visitCorner(tiles)

        visitOne(tiles.last)
    }

    private def visitCorner(tiles: Array[(Int, Int)]): Unit =
    {
        var gts = tiles.map(tileRepository.getTileByXY(_)).toArray


        gts match {
            case Array(Some(start), Some(c1), Some(c2), Some(end)) =>
            {
                val c1E = c1.element;
                val c2E = c2.element;

                if (c1E.isInstanceOf[Continious] && c1E.elementType == c2E.elementType)
                {
                    println("raytrace continious");
                    if (start.element.elementType != c1E.elementType && end.element.elementType != c1E.elementType)
                        sumConcealment += getConcealmentFromTile(c1.getPosition);
                }
                else
                {
                    sumConcealment += (getConcealmentFromTile(c1.getPosition)*0.2).toFloat;
                    sumConcealment += (getConcealmentFromTile(c2.getPosition)*0.2).toFloat;
                }
            }
            case _ => {}
        }

    }

    private def visitOne(pos: (Int, Int)): Unit =
    {
        sumConcealment += getConcealmentFromTile(pos);
    }

    private def getConcealmentFromTile(pos: (Int, Int)): Int =
    {
        val elevation: Double = MathLib.distance(start, pos)*elevationPerTile+0.5;

        if (tileRepository.getTileElevationByXY(pos) > elevation)
            return 100;

        tileRepository.getTileByXY(pos) match {
            case Some(tile) => tile.getConcealment(elevation);
            case None => 100
        }
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
            var coords: Array[(Int, Int)] = Array.empty[(Int, Int)];

            if (e2 > -dy && e2 < dx)
            {
                coords :+= (x0, y0)
                coords :+= (x0+sx, y0)
                coords :+= (x0, y0+sy)
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

            coords :+= (x0, y0)
            this.visit(coords);

            if ((x0==x1) && (y0==y1))
                path = false;
        }
    }
}