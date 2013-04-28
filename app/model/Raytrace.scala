package models;

import models.repositories.TileRepository
import models.tiles._

class Raytrace(val start: (Int, Int), val target: (Int, Int), val tileRepository: TileRepository)
{
    val unitheight:Double = 1.5;
    val degradationPerTile:Double = 0.5;

    val startElevation:Double = tileRepository.getTileElevationByXY(start);
    val targetElevation:Double = tileRepository.getTileElevationByXY(target);
    val distance:Double = MathLib.distance(start, target);

    val elevationPerTileToFloor:Double =  (targetElevation - (startElevation+unitheight)) / distance;
    val elevationPerTileToWaist:Double =  ((targetElevation+unitheight/2) - (startElevation+unitheight)) / distance;

    var sumConcealment:Int = Math.floor(distance*degradationPerTile).toInt;
    var terrainConcealment:Int = 0;

    var encountered: List[Int] = List.empty[Int];

    def run: Int =
    {
        bresenham(start, target);
        sumConcealment;
    }

    private def visitCorner(c1: (Int, Int), c2: (Int, Int)): Unit =
    {
        this.sumConcealment += getConcealmentFromTile(c1, 0.2);
        this.sumConcealment += getConcealmentFromTile(c2, 0.2);

        val cornerPos: (Int, Int) = ((c1._1 + c2._1)/2, (c1._2 + c2._2)/2);
        val distance = MathLib.distance(start, cornerPos);
        val elevation = this.getAverageElevationFromCorner(c1, c2);

        this.getTerrainConcealmentFromTile(elevation, distance);
    }

    private def getAverageElevationFromCorner(c1: (Int, Int), c2: (Int, Int)): Int =
    {
        Math.floor((tileRepository.getTileElevationByXY(c1) + tileRepository.getTileElevationByXY(c2)) /2).toInt;
    }

    private def visitOne(pos: (Int, Int)): Unit =
    {
        val distance = MathLib.distance(start, pos);
        val elevation: Int = tileRepository.getTileElevationByXY(pos);

        this.sumConcealment += getConcealmentFromTile(pos, 1.0);
        this.getTerrainConcealmentFromTile(elevation, distance);
    }

    private def getConcealmentFromTile(pos: (Int, Int), multi: Double): Int =
    {
        val distance = MathLib.distance(start, pos);
        var uMulti = multi;
        val (concealment, element, tileElevation, height, unique) = tileRepository.getTileConcealment(pos);

        if (element == 0)
            return 0;

        if (unique == true && encountered.contains(element))
            return 0;

        if (unique == true)
        {
            uMulti = 1.0;
            encountered :+= element;
        }

        val elevation: Double = startElevation + distance * elevationPerTileToFloor;

        if (tileElevation + height > elevation)
            return (concealment*uMulti).toInt;

        0
    }

    private def getTerrainConcealmentFromTile(elevation: Int, distance: Double): Unit =
    {
        val floorElevation: Double = startElevation + distance * elevationPerTileToFloor;
        val waistElevation: Double = startElevation + distance * elevationPerTileToWaist;

        var concealment = 0;
        if (elevation > floorElevation)
        {
            if (elevation > waistElevation)
            {
                concealment = 100;
            }
            concealment = 50;
        }

        if (this.terrainConcealment < concealment)
            this.terrainConcealment = concealment;
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
        while(path && (sumConcealment+terrainConcealment) < 100)
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