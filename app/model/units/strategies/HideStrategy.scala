package models.units.strategies;

import models.units.states.MoveState
import models.tiles.ActiveGameTile

abstract class HideStrategy( val hideSkill: Int )
{
    def getHiding(tile: ActiveGameTile): Int;
}