window.LineOfSight =
{
    visibilityDegradationPerTile: 1,
    distance: 200,
    degreeIncrement: 0.25,

    clearLineOfSight: function()
    {
        for (var i in TileGrid.gameTiles)
        {
            var tile = TileGrid.gameTiles[i];
            tile.inLOS = true;
            tile.losTexture= {x:255, y:255};
        }
        FogOfWar.updateLosStatus();
    },

    calculateLosForUnit: function(unit)
    {
        for (var i in TileGrid.gameTiles)
        {
            var tile = TileGrid.gameTiles[i];
            tile.inLOS = false;
            tile.losTexture= {x:3, y:0};
        }

        LineOfSight.raytraceAround(unit);
        LineOfSight.calculateTileTypes();
        FogOfWar.updateLosStatus();
    },

    raytraceAround: function(unit)
    {
        var targets = Array();

        TileGrid.getGameTileByXY(unit.position.x,unit.position.y).inLOS = true;

        for (var i = 0; i < 360; i += LineOfSight.degreeIncrement)
        {
            //var i = unit.azimuth;
            var pos = MathLib.getPointInDirection(LineOfSight.distance, i, unit.position.x, unit.position.y );

            var sumConcealment = 0;
            var degradation = 0;

            MathLib.raytrace(unit.position, pos,
                function(x,y,weight)
                {
                    var tile = TileGrid.getGameTileByXY(x,y);
                    if (!tile)
                        return;

                    if (weight == 1 && (sumConcealment+degradation) < 90)
                        tile.inLOS = true;

                    if (weight == 1)
                        degradation = MathLib.distance(unit.position, {x:x, y:y}) * LineOfSight.visibilityDegradationPerTile;

                    sumConcealment += tile.concealment*weight;
                });
        }


    },

    calculateTileTypes: function()
    {
        for (var i in TileGrid.gameTiles)
        {
            var tile = TileGrid.gameTiles[i];

            if ( ! tile.inLOS)
            {
                tile.losTexture= {x:3, y:0};
                continue;
            }

            var number = LineOfSight.getDirectNeighbours(i);
            number = number.join("");
            //console.log(number);
            number = parseInt(number, 2)
            tile.losTexture = LineOfSight.getShadowCoordinates(number);
        }
    },

    getDirectNeighbours: function(count)
    {
        var tiles = Array(4);
        var rowcount = (TileGrid.tileRowCount*2)+1
        tiles[0] = LineOfSight.getGameTileLosByCount(count, -rowcount);
        tiles[1] = LineOfSight.getGameTileLosByCount(count, -1);
        tiles[2] = LineOfSight.getGameTileLosByCount(count, +1);
        tiles[3] = LineOfSight.getGameTileLosByCount(count, +rowcount);

        return tiles;
    },

    getGameTileLosByCount: function(count, add)
    {
        var i = parseInt(count)+add;

        //console.log("i: " + i +" count: " + count + " add: " + add);
        if (TileGrid.gameTiles[i])
        {
            return TileGrid.gameTiles[i].inLOS ? 1 : 0;
        }
        return 0;
    },

    getTilemap: function()
    {
        var size = (TileGrid.tileRowCount*2)+1;
        var finalCanvas =
            $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
        //$(finalCanvas).appendTo('#texturecontainer');
        var finalContext = finalCanvas.getContext("2d");
        var imageData = {
            data : new Uint8Array(finalContext.getImageData(0,0,size, size).data.buffer),
            height: size,
            width: size
        };

        for (var i in TileGrid.gameTiles)
        {
            var tile = TileGrid.gameTiles[i];
            var pixels = i*4;
            var r = pixels;
            var g = pixels+1;
            var b = pixels+2;
            var a = pixels+3;

            imageData.data[r] = tile.losTexture.x;
            imageData.data[g] = tile.losTexture.y;
            imageData.data[b] = 0;
            imageData.data[a] = 255;
        }
        //console.dir(imageData.data);
        var tilemap = new THREE.DataTexture(null, size, size);
        tilemap.image = imageData;


        //var tilemap = THREE.ImageUtils.loadTexture("/assets/resource/tilemap.png");
        tilemap.magFilter = THREE.NearestFilter;
        tilemap.minFilter = THREE.NearestMipMapNearestFilter;
        tilemap.needsUpdate = true;

        return tilemap;
    },

    getShadowCoordinates: function(number)
    {
        if (number === 15)
            return {x:255, y:255};

        var x = number % 4;
        var y = 3-Math.floor(number / 4);
        //if (number != 15)
        //console.log("returning "+x+","+y );
        return {x:x, y:y};
    }
}

