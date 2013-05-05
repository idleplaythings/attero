package models;

import models.repositories._
import models.raytracing._;
import models.units._

class MutualUnitSpotting(unitA: GameUnit, unitB: GameUnit, tileRepository: TileRepository)
{
    private val unitheight: Double = 1.5;
    private val degradation: Double = 0.5;

    private var aSpotted = false;
    private var bSpotted = false;

    def wasSpotted(unit:GameUnit): Boolean =
    {
        (unitA.id == unit.id && aSpotted) || (unitB.id == unit.id && bSpotted)
    }

    private def resolve(): Unit =
    {
        var route: List[Array[TileDetailsForRaytrace]] =
        new BresenhamRoute(unitA.getPosition, unitB.getPosition, tileRepository).getRouteWithTileDetails;

        val partialUnitHeight: Double = 0;
        val fullUnitHeight: Double = 0.75;

        val concealment = new Raytrace(unitheight, degradation, route, partialUnitHeight, fullUnitHeight).run;

        var enemiesSpottedThis: List[GameUnit] = List.empty[GameUnit];

        if (concealment < 100)
        {
            if (unitA.canSpot(unitB, concealment))
            {
                bSpotted = true;
            }

            if (unitB.canSpot(unitA, concealment))
            {
                aSpotted = true;
            }
        }
    }
}