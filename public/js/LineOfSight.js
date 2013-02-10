window.LineOfSight =
{
    visibilityDegradationPerTile: 1,
    distance: 200,
    degreeIncrement: 0.25,
    unitheight: 0.5,
    cornerWeight: 0.3,

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
        var targets = Array();

        var unittile = TileGrid.getGameTileByXY(unit.position.x,unit.position.y);
        unittile.losConcealment = 0;
        var startElevation = unittile.elevation;
        var unitheight = LineOfSight.unitheight;

        for (var i = 0; i < 360; i += LineOfSight.degreeIncrement)
        {
            //var i = unit.azimuth;
            var pos = MathLib.getPointInDirection(LineOfSight.distance, i, unit.position.x, unit.position.y );

            var sumConcealment = 0;
            var degradation = 0;
            var angleTreshold = null;
            var currentElevation = startElevation;

            MathLib.bresenhamRaytrace(unit.position, pos, LineOfSight.cornerWeight,
                function(x, y, weight)
                {
                    var tile = TileGrid.getGameTileByXY(x,y);
                    if (!tile)
                        return;

                    var distance = Math.floor(MathLib.distance(unit.position, {x:x, y:y}));

                    if (weight == 1)
                    {
                        tile.setLosConcealment(sumConcealment+degradation);

                        var elevationDifference = tile.elevation - (startElevation+unitheight);
                        var newangleTreshold = MathLib.calculateAngle(elevationDifference, distance);
                        if (angleTreshold === null || newangleTreshold > angleTreshold)
                        {
                            angleTreshold = newangleTreshold;
                            //console.log("new angletreshold: " + angleTreshold + " distance: " + distance + "elevation diffrence: " + elevationDifference);
                        }

                        if (tile.losConcealment < 100)
                        {
                            var elevationDifference = tile.elevation - startElevation;
                            //console.log(+ MathLib.calculateAngle(elevationDifference, distance)+ " distance: " + distance+ "elevation diffrence: " + elevationDifference);

                            if (MathLib.calculateAngle(elevationDifference, distance)<angleTreshold)
                                tile.losConcealment = 100;
                        }

                        degradation = distance * LineOfSight.visibilityDegradationPerTile;
                    }

                    sumConcealment += tile.concealment*weight;

                });
        }

        var endTime = (new Date()).getTime();
        console.log("LOS TOOK: " + (endTime - startTime) );

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

