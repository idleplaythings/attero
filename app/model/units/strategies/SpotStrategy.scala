package models.units.strategies;

import models.units.GameUnit;
import models.units.states.MoveState
import models.tiles.ActiveGameTile
import models.Raycast

abstract class SpotStrategy( val spottingSkill: Int )
{
    def canSpot(spotter: GameUnit, target: GameUnit, route: Raycast): Boolean;
}