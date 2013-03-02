package models.units;

import models.units.strategies.HideStrategy
import models.tiles.ActiveGameTile

trait Spottable
{
    private var hideStrategy: HideStrategy = _;
    def setHideStrategy(strategy: HideStrategy) = { hideStrategy = strategy}

    def getHiding(tile: ActiveGameTile): Int =
    {
        hideStrategy.getHiding(tile);
    }
}