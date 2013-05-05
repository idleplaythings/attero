package models.units.strategies;

import models.units.GameUnit
import models.units.states.MoveState
import models.tiles.ActiveGameTile

abstract class MoveStrategy( val movementPointsBase: Double )
{
    def canMove(gameUnit: GameUnit, tile:ActiveGameTile): Boolean;

    def move(gameUnit: GameUnit, tile:ActiveGameTile, turretFacing: Int, facing: Int): Unit;

    def renew(gameUnit: GameUnit): Unit;

    protected def getCurrentMovePointsLeft(state: MoveState): Double =
    {
        movementPointsBase - state.getCurrentMovePointsUsed;
    }
}