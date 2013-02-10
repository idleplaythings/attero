window.UIEvents = {

    selectedUnit: null,

    onGameTileClicked: function(tile, right)
    {
        var unit = UIEvents.selectedUnit;
        if (unit && right)
        {
            unit.lookAt(tile.position);
            LineOfSight.calculateLosForUnit(unit);
            console.log("losConcealment: " + tile.losConcealment);
        }
        else if (unit && !right)
        {
            unit.setPosition(tile.position);
            LineOfSight.calculateLosForUnit(unit);
        }
    },

    onUnitClicked: function(unit, right)
    {
        UIEvents.selectedUnit = unit;
        LineOfSight.calculateLosForUnit(unit);
    },

    onGridClicked: function(x,y, right)
    {
        var tile = TileGrid.gridCordinatesToTile({x:x, y:y});

        if (!tile)
            return;

        if (tile.subscribedUnit)
            UIEvents.onUnitClicked(tile.subscribedUnit, right);
        else
            UIEvents.onGameTileClicked(tile, right);
    }
}

