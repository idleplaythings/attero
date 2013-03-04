package models.units;

import models._
import models.tiles.ActiveGameTile
import models.units.states.MoveState
import models.units.strategies.MoveStrategy

trait Movable
{
    private var moveState: MoveState = _;
    def getMoveState: MoveState = moveState;
    def setMoveState(state: MoveState) = {moveState = state}

    def getPosition: (Int, Int) = moveState.getPosition

    private var moveStrategy: MoveStrategy = _;
    def setMoveStrategy(strategy: MoveStrategy) = { moveStrategy = strategy}

    def canMove(tile:ActiveGameTile): Boolean =
    {
        moveStrategy.canMove(moveState, tile);
    }

    def move(tile:ActiveGameTile, turretFacing: Int, facing: Int): Unit =
    {
        moveStrategy.move(moveState, tile, turretFacing, facing);
    }
}