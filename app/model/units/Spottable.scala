package models.units;

import models.units.strategies.HideStrategy
import models.tiles.ActiveGameTile

trait Spottable
{
    private var hideStrategy: HideStrategy = _;
    def setHideStrategy(strategy: HideStrategy) = { hideStrategy = strategy}

    def getHiding(): Int =
    {
        hideStrategy.getHiding(this.asInstanceOf[GameUnit]);
    }
}