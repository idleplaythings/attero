package models.units.strategies;

import models.units.GameUnit
import models.units.states.MoveState
import models.tiles.ActiveGameTile
import models.MathLib

class InfantryMoveStrategy(movementPointsBase: Double)
    extends MoveStrategy(movementPointsBase)
{
    def canMove(gameUnit: GameUnit, tile:ActiveGameTile): Boolean =
    {
        //TODO: Check that target terrain is passable
        var state = gameUnit.getMoveState;
        getCurrentMovePointsLeft(state) >= this.getMovementPointsCost(gameUnit, tile)
    }

    def move(gameUnit: GameUnit, tile:ActiveGameTile, turretFacing: Int, facing: Int): Unit =
    {
        var state = gameUnit.getMoveState;
        state.setCurrentMovePointsUsed(
            state.getCurrentMovePointsUsed + this.getMovementPointsCost(gameUnit, tile));

        state.setTurretAzimuth(turretFacing);
        state.setAzimuth(facing);
        gameUnit.setPosition(tile.getPosition);
    }

    def getMovementPointsCost(gameUnit: GameUnit, tile:ActiveGameTile): Double =
    {
        val distance = MathLib.distance(gameUnit.getPosition, tile.getPosition)
        val difficulty = tile.getMovementDifficulty

        (1 + difficulty * 0.01) * distance
    }
}