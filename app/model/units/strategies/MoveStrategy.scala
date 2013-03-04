package models.units.strategies;

import models.units.states.MoveState
import models.tiles.ActiveGameTile

abstract class MoveStrategy( val movementPointsBase: Double )
{
    def canMove(state:MoveState, tile:ActiveGameTile): Boolean;

    def move(state:MoveState, tile:ActiveGameTile, turretFacing: Int, facing: Int): Unit;

    protected def getCurrentMovePointsLeft(state: MoveState): Double =
    {
        movementPointsBase - state.getCurrentMovePointsUsed;
    }
}