window.LineOfSight =
{
    tiles:null,
    tiletypes: Array(),
    tilecount:0,
    rowcount:0,
    
    init: function()
    {
        LineOfSight.rowcount = (TileGrid.tileRowCount*2)+1;
        LineOfSight.count = (Math.pow(LineOfSight.rowcount));
        
        var count = LineOfSight.count;
        
        while (count--)
        {
            TileGrid.gameTiles[count].inLOS = Math.round(Math.random());
        }
        
        LineOfSight.calculateTileTypes();
    },
    
    calculateTileTypes: function()
    {
        var count = LineOfSight.count;
        
        while (count--)
        {
            var inLos = TileGrid.gameTiles[count].inLOS;
            if ( ! inLos)
            {
                TileGrid.gameTiles[count].losTexture= {x:3, y:0};
                continue;
            }
            
            var number = LineOfSight.getDirectNeighbours(count);
            number = number.join("");
            number = parseInt(number, 2)
            TileGrid.gameTiles[count].losTexture = FogOfWar.getShadowTexture(number);
        }
    },
    
    getDirectNeighbours: function(count)
    {
        var tiles = Array(4);
        var rowcount = LineOfSight.rowcount;
        tiles[0] = TileGrid.getGameTileByCount(count, -rowcount);
        tiles[1] = TileGrid.getGameTileByCount(count, -1);
        tiles[2] = TileGrid.getGameTileByCount(count, +1);
        tiles[3] = TileGrid.getGameTileByCount(count, +rowcount);
        
        return tiles;
    },
    
    getTilemap: function()
    {
        var size = LineOfSight.rowcount;
        var finalCanvas = 
            $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
        //$(finalCanvas).appendTo('#texturecontainer');
        var finalContext = finalCanvas.getContext("2d");
        var imageData = {
            data : new Uint8Array(finalContext.getImageData(0,0,size, size).data.buffer),
            height: size,
            width: size
        };
        
        var count = LineOfSight.count;
        while (count--)
        {
            var pixels = count*4; 
            var r = pixels-4;
            var g = pixels-3;
            var b = pixels-2;
            var a = pixels-1;
            
            var tileinfo = TileGrid.gameTiles[count].losTexture;
            
            imageData.data[r] = tileinfo.x;
            imageData.data[g] = tileinfo.y;
        }
        var tilemap = new THREE.DataTexture(null, size, size);
        tilemap.image = imageData;
        
        
        //var tilemap = THREE.ImageUtils.loadTexture("resource/tilemap.png");
        tilemap.magFilter = THREE.NearestFilter;
        tilemap.minFilter = THREE.NearestMipMapNearestFilter;
        tilemap.needsUpdate = true;
        
        return tilemap;
    },
}

