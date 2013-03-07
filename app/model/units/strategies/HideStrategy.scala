package models.units.strategies;

import models.units.states.MoveState
import models.units._

abstract class HideStrategy( val hideSkill: Int )
{
    def getHiding(hider: GameUnit): Int;
}

class SimpleHideStrategy( hideSkill: Int ) extends HideStrategy(hideSkill)
{
    def getHiding(hider: GameUnit): Int =
    {
        hideSkill
    }
}

