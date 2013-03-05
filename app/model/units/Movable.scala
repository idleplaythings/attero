package models.units;

import models._
import models.tiles.ActiveGameTile
import models.units.states.MoveState
import models.units.strategies.MoveStrategy

trait Movable
{
    def getMoveState: MoveState;

    private var moveStrategy: MoveStrategy = _;
    def setMoveStrategy(strategy: MoveStrategy) = { moveStrategy = strategy}

    def canMove(tile:ActiveGameTile): Boolean =
    {
        moveStrategy.canMove(this.asInstanceOf[GameUnit], tile);
    }

    def move(tile:ActiveGameTile, turretFacing: Int, facing: Int): Unit =
    {
        moveStrategy.move(this.asInstanceOf[GameUnit], tile, turretFacing, facing);
    }
}