package models.units;

import models.units.strategies.SpotStrategy
import models.Raycast

trait Spotter
{
    private var spotStrategy: SpotStrategy = _;
    def setSpotStrategy(strategy: SpotStrategy) = { spotStrategy = strategy}

    def canSpot(target:GameUnit, route: Raycast): Boolean =
    {
        spotStrategy.canSpot(this.asInstanceOf[GameUnit], target, route);
    }
}