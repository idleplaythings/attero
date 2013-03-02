package models.units;

import models.units.strategies.SpotStrategy

trait Spotter
{
    private var spotStrategy: SpotStrategy = _;
    def setSpotStrategy(strategy: SpotStrategy) = { spotStrategy = strategy}

    def canSpot(target:GameUnit, concealment: Int): Boolean =
    {
        spotStrategy.canSpot(target, concealment);
    }
}