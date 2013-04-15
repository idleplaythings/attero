window.LineOfSight =
{
    visibilityDegradationPerTile: 0.5,
    distance: 200,
    degreeIncrement: 0.25,
    unitheight: 0.5,
    cornerWeight: 0.5,

    clearLineOfSight: function()
    {
        for (var i in TileGrid.gameTiles)
        {
            var tile = TileGrid.gameTiles[i];
            tile.losConcealment = 0;
        }
        FogOfWar.updateLosStatus();
    },

    calculateLosForUnit: function(unit)
    {
        for (var i in TileGrid.gameTiles)
        {
            var tile = TileGrid.gameTiles[i];
            tile.losConcealment = 100;
        }

        LineOfSight.raytraceAround(unit);
        FogOfWar.updateLosStatus();
    },

    raytraceAround: function(unit)
    {
        var startTime = (new Date()).getTime();

        var unittile = TileGrid.getGameTileByXY(unit.position.x,unit.position.y);
        unittile.losConcealment = 0;
        var startElevation = unittile.elevation;
        var unitheight = LineOfSight.unitheight;

        for (var i = 0; i < 360; i += LineOfSight.degreeIncrement)
        {
            //var i = unit.azimuth;
            var pos = MathLib.getPointInDirection(LineOfSight.distance, i, unit.position.x, unit.position.y );

            var ray = new Raytrace(unit.position, pos);
            ray.run();
        }

        var endTime = (new Date()).getTime();
        console.log("LOS TOOK: " + (endTime - startTime) );

    },

    getTilemap: function()
    {
        var mapDimensions = TileGrid.getMapSizeInGameTiles();
        var size = mapDimensions.width;

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

            imageData.data[r] = 0;
            imageData.data[g] = 0;
            imageData.data[b] = tile.getLosConcealmentInByteScale();
            imageData.data[a] = 255;
        }
        //console.dir(imageData.data);
        var tilemap = new THREE.DataTexture(null, size, size);
        tilemap.image = imageData;


        //var tilemap = THREE.ImageUtils.loadTexture("/assets/resource/tilemap.png");
        //tilemap.magFilter = THREE.NearestFilter;
        //tilemap.minFilter = THREE.NearestMipMapNearestFilter;
        tilemap.needsUpdate = true;

        return tilemap;
    },
}

