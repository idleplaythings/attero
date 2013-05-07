package models.raytracing;

import models.repositories.TileRepository
import models.tiles._

class BresenhamRoute(
    val start: (Int, Int),
    val target: (Int, Int),
    val tileRepository: TileRepository)
{
    private lazy val route: List[Array[(Int, Int)]] = bresenham;

    def getRoute: List[Array[(Int, Int)]] = route;

    def getRouteWithTileDetails: List[Array[TileDetailsForRaytrace]] =
    {
        route.map(_.map(tileRepository.getTileDetailsForRaytrace(_)));
    }

    private def bresenham: List[Array[(Int, Int)]] =
    {
        var route: List[Array[(Int, Int)]] = List.empty[Array[(Int, Int)]];

        var (x0, y0) = this.start;
        var (x1, y1) = this.target;

        var dx:Int = math.abs(x1-x0);
        var dy:Int = math.abs(y1-y0);
        var sx:Int = -1;
        if (x0 < x1)
            sx = 1 ;

        var sy:Int = -1;
        if (y0 < y1)
            sy =1;

        var err:Int = dx-dy;

        route :+= Array((x0, y0));

        while((x0 != x1) || (y0 != y1))
        {
            var e2:Int = 2*err;

            if (e2 > -dy && e2 < dx)
            {
                route :+= Array((x0+sx, y0), (x0, y0+sy));
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

            route :+= Array((x0, y0));
        }

        route;
    }
}
