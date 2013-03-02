package models.units.strategies;

import models.units.states.MoveState
import models.tiles.ActiveGameTile
import models.MathLib

class InfantryMoveStrategy(movementPointsBase: Double)
    extends MoveStrategy(movementPointsBase)
{
    def canMove(state:MoveState, tile:ActiveGameTile): Boolean =
    {
        //TODO: Check that target terrain is passable
        getCurrentMovePointsLeft(state) >= this.getMovementPointsCost(state, tile)
    }

    def move(state:MoveState, tile:ActiveGameTile, turretFacing: Int, facing: Int): Unit =
    {
        state.setCurrentMovePointsUsed(
            state.getCurrentMovePointsUsed + this.getMovementPointsCost(state, tile));

        state.setPosition(tile.getPosition);
        state.setTurretAzimuth(turretFacing);
        state.setAzimuth(facing);
    }

    def getMovementPointsCost(state:MoveState, tile:ActiveGameTile): Double =
    {
        val distance = MathLib.distance(state.getPosition, tile.getPosition)
        val difficulty = tile.getMovementDifficulty

        (1 + difficulty * 0.01) * distance
    }
}