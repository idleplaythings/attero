window.UIEvents = {
    
    onTileClicked: function(tile, x, y)
    {
        console.log("tile: " + tile.position.x + "," + tile.position.x );
        
        LineOfSight.calculateTileTypes();
        //FogOfWar.calculateLosTextures()
        FogOfWar.updateLosStatus();
    },
    
    onGridClicked: function(x,y)
    {
        //console.log(x+","+y);
        var i = Math.floor(y/13)*TileGrid.tileRowCount*3 + Math.floor(x/13);
        
        LineOfSight.tiles[i] = LineOfSight.tiles[i] ? 0 : 1;
        
        //console.log("grid " +x+","+y);
        
        LineOfSight.calculateTileTypes();
        //FogOfWar.calculateLosTextures()
        FogOfWar.updateLosStatus();
    },
}

