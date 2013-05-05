package models.raytracing;

import models.MathLib;

class Raytrace(
    val unitheight: Double,
    val degradation: Double,
    var route: List[Array[TileDetailsForRaytrace]],
    val partialUnitHeight: Double,
    val fullUnitHeight: Double)
{
    val start: TileDetailsForRaytrace = route.head(0);

    route = route.drop(1);

    val target: TileDetailsForRaytrace = route.last(0);

    val observerEyeElevation: Double = start.elevation + unitheight;

    val distance: Double = MathLib.distance(start.position, target.position);

    val elevationPerTileToPartial: Double = ((target.elevation+partialUnitHeight) - observerEyeElevation) / distance;
    val elevationPerTileToFull: Double = ((target.elevation+fullUnitHeight) - observerEyeElevation) / distance;

    var encounteredElements: List[Int] = List.empty[Int];

    var concealment: Int = Math.floor(distance * degradation).toInt;
    var terrainConcealment: Int = 0;

    def sumConcealment: Int = this.concealment + this.terrainConcealment;


    def run =
    {
        this.route.forall({ step: Array[TileDetailsForRaytrace] =>

            step match {
                case step if step.length == 2 => visitCorner(step);
                case _ => visit(_);
            }

            sumConcealment < 100
        });

        sumConcealment
    }

    private def visit(tiles: Array[TileDetailsForRaytrace]): Unit =
    {
        val tile = tiles(0);

        this.concealment += getConcealmentFromTile(tile, 1.0);
        this.terrainConcealment = getTerrainConcealmentFromTile(
            MathLib.distance(this.start.position, tile.position),
            tile.elevation);
    }

    private def visitCorner(tiles: Array[TileDetailsForRaytrace]) : Unit =
    {
        val tileA = tiles(0);
        val tileB = tiles(1);

        this.concealment += getConcealmentFromTile(tileA, 0.2);
        this.concealment += getConcealmentFromTile(tileB, 0.2);

        val cornerPos: (Int, Int) = (
            (tileA.position._1 + tileB.position._1) / 2,
            (tileA.position._2 + tileB.position._2) / 2
        );

        val distance: Double = MathLib.distance(this.start.position, cornerPos);
        val elevation: Int = Math.floor((tileA.elevation + tileB.elevation) / 2).toInt;

        this.terrainConcealment = getTerrainConcealmentFromTile(distance, elevation);
    }

    private def getConcealmentFromTile(tile: TileDetailsForRaytrace, concealmentMultiplier: Double): Int =
    {
        var multi = concealmentMultiplier;
        val distance = MathLib.distance(this.start.position, tile.position);
        val sightCutoutToPartial = this.observerEyeElevation + distance * this.elevationPerTileToPartial;
        val sightCutoutToFull = this.observerEyeElevation + distance * this.elevationPerTileToFull;

        if (tile.elevation + tile.height > sightCutoutToPartial)
        {
            if (tile.unique && this.encounteredElements.contains(tile.element))
                return 0;

            if (tile.unique)
            {
                multi = 1.0;
                this.encounteredElements :+= tile.element;
            }

            return Math.floor(tile.concealment*multi).toInt;
        }

        return 0;
    }

    private def getTerrainConcealmentFromTile(distance: Double, elevation: Int) : Int =
    {
        val sightCutoutToPartial = this.observerEyeElevation + distance * this.elevationPerTileToPartial;
        val sightCutoutToFull = this.observerEyeElevation + distance * this.elevationPerTileToFull;

        var concealment = 0;

        if (elevation > sightCutoutToPartial)
        {
            if (elevation > sightCutoutToFull)
            {
                concealment = 100;
            }
            else
            {
                concealment = 50;
            }
        }

        if (this.terrainConcealment < concealment)
            concealment;
        else
            0
    }
}