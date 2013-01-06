window.Landscaping = 
{
    selectedTexture: 1,
    selectedElement: null,
    selectedBrush: 1,
    selectedBrushSize: 1,
    updatedTiles: Array(),
    
    onTileClicked: function(tile)
    {
        Landscaping.updatedTiles = Array();
        switch (Landscaping.selectedBrush)
        {
            case 1:
                if (Landscaping.selectedElement)
                    Landscaping.changeTexture(tile, 'setSubElementForTile');
                else
                    Landscaping.changeTexture(tile, 'setSubTextureForTile');
                break;
            case 2:
                Landscaping.changeTexture(tile, 'removeSubTextureFromTile');
                break;
            case 3:
                Landscaping.changeElevation(tile, 1);
                break;
            case 4:
                Landscaping.changeElevation(tile, -1);
                break;
        }
        
        Landscaping.updateTiles();
    },
    
    applyLargeSpray: function(callfunction, tile){
        
        var x = tile.position.x -2;
        var y = tile.position.y -2;
        
        for (var dy = y;dy<y+5;dy++){
            for (var dx = x;dx<x+5;dx++){
                var oTile = TileGrid.getGameTileByXY(dx, dy);
                if (!oTile)
                    continue;

                if (Math.random() <= 0.1)
                    Landscaping.applySmallBrush(callfunction, oTile);
            }
        }
    },
    
    applyLargeBrush: function(callfunction, tile){
        
        
        var x = tile.position.x -1;
        var y = tile.position.y -1;
        
        for (var dy = y;dy<y+3;dy++){
            for (var dx = x;dx<x+3;dx++){
                var oTile = TileGrid.getGameTileByXY(dx, dy);
                if (!oTile)
                    continue;
                
                Landscaping.applyMediumBrush(callfunction, oTile);
            }
        }
        
        
    },
    
    applyMediumBrush: function(callfunction, tile){
        
        var tiles = tile.getAdjacentGameTilesInArray();
        tiles.push(tile);
        
        for (var i in tiles)
        {
            Landscaping.applySmallBrush(callfunction, tiles[i]);
        }
        
        
    },
    
    applySmallBrush: function(callfunction, tile)
    {
        var selected, element, maskid, offset;
            
        if ( Landscaping.selectedTexture )
        {
            selected = Landscaping.selectedTexture;
            element = window.availableTextures[selected];
            maskid = element.getRandomMask();
            offset = element.getRandomOffset();
        }
        else if ( Landscaping.selectedElement )
        {
            selected = Landscaping.selectedElement;
            element = window.availableTileElements[selected];
            offset = element.getRandomOffset();
        }
        
        Landscaping.callFunction(callfunction, tile, selected, maskid, offset);
    },
    
    callFunction: function(callfunction, tile, selected, maskid, offset)
    {
        Landscaping[callfunction](tile, selected, maskid, offset);
    },
    
    changeTexture: function(tile, callfunction)
    {
        switch (Landscaping.selectedBrushSize)
        {
            case 1:
                Landscaping.applySmallBrush(
                    callfunction, tile);
                break;
            case 2:
                Landscaping.applyMediumBrush(
                    callfunction, tile);
                break;
            case 3:
                Landscaping.applyLargeBrush(
                    callfunction, tile);
                break;
            case 4:
                Landscaping.applyLargeSpray(
                    callfunction, tile);
                break
        }
    },
    
    removeSubTextureFromTile: function(tile, element, mask, offset)
    {
        tile.subElement = 0;
        tile.subElementOffset = 0;
        
        Landscaping.addTileToBeUpdated(tile);
    },
    
    setSubElementForTile: function(tile, element, mask, offset)
    {
        window.availableTileElements[element].addToTile(tile, offset);
        
        Landscaping.addTileToBeUpdated(tile);
    },
    
    setSubTextureForTile: function(tile, texture, mask, offset)
    {
        window.availableTextures[texture].addToTile(tile, mask, offset);
        
        Landscaping.addTileToBeUpdated(tile);
    },
    
    changeTileElement: function(tile)
    {
        tile.element = Landscaping.selectedElement;
        tile.elementOffset = window.availableTileElements[tile.element].getRandomOffset();
        
        Landscaping.addTileToBeUpdated(tile);
    },
    
    changeElevation: function(tile, change)
    {
        var tiles = tile.getAdjacentGameTilesInArray();

        var orginalElevation = tile.elevation;
        var targetElevation = orginalElevation + change;
        
        console.log("te: " + targetElevation + " oe: " + orginalElevation + " c: " + change);
        for (var i in tiles)
        {
            var t = tiles[i];
            var tElevation = t.elevation;
            
            if (Math.abs(tElevation - targetElevation) > 1)
            {
                console.log("Elevation not possible");
                return false;
            }
            
        }
        tile.elevation = targetElevation;
        Landscaping.addTileToBeUpdated(tile);
        
        for (var i in tiles)
        {
            var t = tiles[i];
            t.hasElevationShadow = true;
            Landscaping.addTileToBeUpdated(t);
        }
    },
    
    updateTiles: function()
    {
        for (var i in Landscaping.updatedTiles)
        {
            var tile = Landscaping.updatedTiles[i];
            tile.createTexture();
            TileGrid.updateTexture(tile);
        }
        
    },
    
    addTileToBeUpdated: function(gametile)
    {
        var tiles = gametile.getTilesTouchedByGameTile();
        
        
        for (var a in tiles)
        {
            var tile = tiles[a];
            if (!tile)
               continue;
           
            var found = false;
            
            for (var i in Landscaping.updatedTiles)
            {
                var oTile = Landscaping.updatedTiles[i];
                if (oTile.position.x == tile.position.x && oTile.position.y == tile.position.y)
                    found = true;
            }
            
            if (!found)
               Landscaping.updatedTiles.push(tile); 
        }
    }
}