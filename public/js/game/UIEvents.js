window.UIEvents = {

    selectedUnit: null,
    overTile: null,

    onGameTileMouseover: function(tile)
    {
        if (UIEvents.overTile == tile)
        {
            return;
        }
        else
        {
            UIEvents.onGameTileMouseout(UIEvents.overTile);
            UIEvents.overTile = tile;

            if (tile.subscribedUnit)
            {
                tile.subscribedUnit.icon.mouseover();
                jQuery(".webglCanvas").addClass('pointer')
                tooltip.show(tile.subscribedUnit);
            }
        }
    },

    onGameTileMouseout: function(tile)
    {
        if (tile && tile.subscribedUnit)
        {
            tile.subscribedUnit.icon.mouseout();
        }
        tooltip.hide();
        jQuery(".webglCanvas").removeClass('pointer')
    },

    onGameTileClicked: function(tile, right)
    {
        var unit = UIEvents.selectedUnit;
        if (unit && right)
        {
            unit.lookAt(tile.position);
            LineOfSight.calculateLosForUnit(unit);
        }
        else if (unit && !right)
        {
            // unit.setPosition(tile.position);
            LineOfSight.clearLineOfSight();
            unit.moveTo(tile.position);
        }
    },

    onUnitClicked: function(unit, right)
    {
        if (unit.owner != window.playerid)
        {
            return;
        }

        if (UIEvents.selectedUnit)
            UIEvents.selectedUnit.icon.deselect();

        UIEvents.selectedUnit = unit;
        unit.icon.select();

        console.log("selected unit: " + unit.id)
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

