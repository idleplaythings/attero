package models.units.strategies;

import models.units.GameUnit;
import models.units.states.MoveState
import models.tiles.ActiveGameTile

abstract class SpotStrategy( val spottingSkill: Int )
{
    def canSpot(spotter: GameUnit, target: GameUnit, concealment: Int ): Boolean;
}

class SimpleSpotStrategy( spottingSkill: Int ) extends SpotStrategy(spottingSkill)
{
    def canSpot(spotter: GameUnit, target: GameUnit, concealment: Int ): Boolean =
    {
        spottingSkill >= concealment + target.getHiding
    }
}