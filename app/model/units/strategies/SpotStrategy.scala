package models.units.strategies;

import models.units.GameUnit;
import models.units.states.MoveState
import models.tiles.ActiveGameTile

abstract class SpotStrategy( val spottingSkill: Int )
{
    def canSpot(target: GameUnit, concealment: Int): Boolean;
}