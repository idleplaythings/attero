window.TileGrid = {

    context:null,
    width: 201,
    height: 201,
    subSegmentSize: 25,
    THREEMesh: null,
    THREEMeshes: null,
    THREETextures: null,
    textureDatas: Array(),
    tilesBySubSegments: [],
    gameTiles: [],

    serialize: function()
    {
        var sTiles = Array();
        for (var i in TileGrid.gameTiles)
        {
            sTiles.push(TileGrid.gameTiles[i].serialize());
        }

        sTiles = sTiles.join(";");

        var data =
        {
            width: TileGrid.width,
            height: TileGrid.height,
            tiles: sTiles
        };

        return data;
    },

    getMapSizeInGameTiles: function()
    {
        return {
            width: TileGrid.width,
            height: TileGrid.height
        };
    },

    getMapSizeIn3d: function()
    {
        return {
            width: (TileGrid.width-1)/2,
            height: (TileGrid.height-1)/2
        };
    },

    onGridClicked: function(event)
    {
        var x = event.pageX - this.offsetLeft;
        var y = event.pageY - this.offsetTop;
        TileGrid.doGridClicked(x, y, false);
    },

    doGridClicked: function(x, y, right)
    {
        var width = window.innerWidth/2;
        var height = window.innerHeight/2;

        var camPos = Graphics.camPosInWindow();

        x -= width - (camPos.x*Graphics.zoom);
        y -= height + (camPos.y*Graphics.zoom);

        x /= Graphics.zoom;
        y /= Graphics.zoom;

        UIEvents.onGridClicked(x,y, right);
    },

    gridToViewPortCoordinates: function(pos)
    {
        var x = pos.x;
        var y = pos.y;

        var width = (window.innerWidth/2)*Graphics.zoom;
        var height = (window.innerHeight/2);

        var camPos = Graphics.camPosInWindow();

        x *= 20;
        y *= 20;

        x +=  (width - camPos.x*Graphics.zoom);
        y +=  (height + camPos.y);

        x /= Graphics.zoom;
        y /= Graphics.zoom;

        return {x:x, y:y};
    },

    gridCordinatesToTile: function(pos)
    {
        var x = pos.x;
        var y = pos.y;

        //console.log("clicked " + x +","+ y);
        var tileSize = 20;

        var mapDimensions = TileGrid.getMapSizeInGameTiles();
        var width = mapDimensions.width;

        var i = Math.floor((y+10)/tileSize)*(width) + Math.floor((x+10)/tileSize);

        return TileGrid.gameTiles[i];
    },

    gameCordinatesTo3d: function(pos)
    {
        var x = (pos.x / 2);
        var y = (pos.y / 2);

        return {x:x, y:y};
    },

    getTileGridWidht: function()
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        return mapDimensions.width*40;
    },

    getSubTileGridWidht: function()
    {
        return TileGrid.subSegmentSize*40;
    },

    getTileGridMesh: function()
    {

        var mapDimensions = TileGrid.getMapSizeIn3d();

        var scale = 1;
        var rowCount = mapDimensions.width;
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = mapDimensions.width/subSegmentSize;

        if (!this.THREETextures)
        {
            this.THREETextures = Array();
            for (var i in this.textureDatas)
            {
                var tex = new THREE.DataTexture(null, subSegmentSize * 40, subSegmentSize * 40);
                tex.image = this.textureDatas[i];
                tex.needsUpdate = true;
                this.THREETextures[i] = tex;
            }
        }

        if (!this.THREEMeshes)
        {
            this.THREEMeshes = Array();

            for (var a in this.textureDatas)
            {
                var y = Math.floor(a/subSegmentsPerLine)*subSegmentSize + subSegmentSize/2;
                var x = (a % subSegmentsPerLine)*subSegmentSize + subSegmentSize/2;
                var mesh;
                var geometry = new THREE.PlaneGeometry(
                    subSegmentSize, subSegmentSize, 1, 1 );

                //mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {map:THREE.ImageUtils.loadTexture("textures/grass1.png")}));
                mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({
                    map:this.THREETextures[a],
                    transparent: true,
                    reflectivity:0,
                    depthTest:false,
                    depthWrite:false
                }));
                mesh.scale = new THREE.Vector3(scale, scale, scale);
                //mesh.rotation.x = (90 / (180.0 / Math.PI));
                mesh.position = new THREE.Vector3(x, -y, 0);
                this.THREEMeshes[a] = mesh;
            }

        }

        return this.THREEMeshes;
    },

    getSubTextureCount: function()
    {
        return TileGrid.getTileCount()/Math.pow(TileGrid.subSegmentSize, 2);
    },

    createTexture: function()
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        var subSegments = TileGrid.getSubTextureCount();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = mapDimensions.width/subSegmentSize;

        //console.log("subSegments: " + subSegments);
        for (var i=0; i<subSegments; i++ )
        {
            TileGrid.tilesBySubSegments[i] = Array();
            var suby = Math.floor(i/subSegmentsPerLine);
            var subx = i % subSegmentsPerLine;

            var size = subSegmentSize * 40;
            var finalCanvas =
                $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
            //$(finalCanvas).appendTo('#texturecontainer');
            var finalContext = finalCanvas.getContext("2d");

            var l = window.tiles.length;
            while (l--)
            {
                var tile = window.tiles[l];
                var x = tile.position.x;
                var y = tile.position.y;

                if (x>= subx*subSegmentSize && x < (subx+1)*subSegmentSize
                    && y>=suby*subSegmentSize && y < (suby+1)*subSegmentSize)
                {
                    TileGrid.tilesBySubSegments[i].push(tile);
                    var tx = x - subx*subSegmentSize;
                    var ty = y - suby*subSegmentSize;
                    finalContext.putImageData(
                    tile.textureData, tx*40, ty*40, 0, 0, 40, 40);
                }

            }

            //TileGrid.textureDatas[i] = finalContext.getImageData(0, 0, size, size);
            //console.dir(finalContext.getImageData(0,0,size, size).data.buffer);
            TileGrid.textureDatas[i] = {
                data : new Uint8Array(
                    finalContext.getImageData(0,0,size, size).data.buffer),
                height: size,
                width: size
            };
        }
    },

    updateTexture: function(tile)
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = mapDimensions.width/subSegmentSize;

        var x = tile.position.x;
        var y = tile.position.y;

        var suby = Math.floor(y/subSegmentSize);
        var subx = Math.floor(x/subSegmentSize);
        var sub = suby*subSegmentsPerLine +  subx;


        x -= subx*subSegmentSize;
        y -= suby*subSegmentSize;

        ImageManipulation.addImageDataToGridTexture(
            TileGrid.textureDatas[sub],
            tile.textureData,
            x*40,
            y*40,
            TileGrid.subSegmentSize * 40,
            40,
            false
        );

        this.THREETextures[sub].image = TileGrid.textureDatas[sub];
        this.THREETextures[sub].needsUpdate = true;
    },

    getTileCount: function()
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        return mapDimensions.width * mapDimensions.height;
    },

    getGameTileCount: function()
    {
        var mapDimensions = TileGrid.getMapSizeInGameTiles();
        return mapDimensions.width * mapDimensions.height;
    },

    getContext: function()
    {
        if (!TileGrid.context)
            TileGrid.context = document.getElementById("grid").getContext("2d");

        return TileGrid.context;

    },

    removeTileGrid: function()
    {
        var meshes = TileGrid.getTileGridMesh();
        for (var i in meshes)
        {
            Graphics.scene.remove(meshes[i]);
        }

        TileGrid.THREEMesh = null;
        TileGrid.THREEMeshes = null;
        TileGrid.THREETextures = null;
        TileGrid.textureDatas = [];
        TileGrid.tilesBySubSegments = [];
    },

    init: function()
    {

        TileGrid.removeTileGrid();
        TileGrid.createTexture();

        var meshes = TileGrid.getTileGridMesh();
        for (var i in meshes)
        {
            Graphics.scene.add(meshes[i]);
        }
    },

    createFromJson: function(json)
    {
        TileGrid.width = json.width;
        TileGrid.height = json.height;

        TileGrid.createGametilesFromJson(json.tiles);
    },

    createGametilesFromJson: function(tiles)
    {
        var mapDimensions = TileGrid.getMapSizeInGameTiles();

        var tiles = tiles.split(";");
        TileGrid.gameTiles = Array();

        var gameTileCount = TileGrid.getGameTileCount();
        var gameTileRowCount = mapDimensions.width;
        for (var i =0; i<gameTileCount;i++)
        {
            var x = i % gameTileRowCount;
            var y = Math.floor(i / gameTileRowCount);
            var details = tiles[i].split(",");

            args =
            {
                position:{x:x, y:y},
                subTexture: details[0],
                subTextureOffset: details[1],
                subTextureMask: details[2],
                elevation: parseInt(details[3]),
                subElement: details[4],
                subElementOffset: details[5],
                subElementVariance: details[6],
                subElementAngle: details[7]
            };


            TileGrid.gameTiles[i] = new GameTile(args);
        }
    },

    createDefaultGameTiles: function()
    {
        var mapDimensions = TileGrid.getMapSizeInGameTiles();
        TileGrid.gameTiles = Array();

        var gameTileCount = TileGrid.getGameTileCount();
        var gameTileRowCount = mapDimensions.width;
        for (var i =0; i<gameTileCount;i++)
        {
            var x = i % gameTileRowCount;
            var y = Math.floor(i / gameTileRowCount);

            var tile = new GameTile({position:{x:x, y:y}});
            tile.randomizeTile();
            TileGrid.gameTiles[i] = tile;
        }
    },

    initTiles: function()
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        window.tiles = Array();

        var tileCount = TileGrid.getTileCount();
        while( tileCount-- )
        {
            var x = (tileCount+1) % mapDimensions.width;
            var y = Math.floor(tileCount / mapDimensions.width);
            var i = y*mapDimensions.width + x;

            window.tiles[i] = new Tile(x, y);
        }
    },

    getTileByXY: function(x, y)
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        var i = y*mapDimensions.width + x;
        if (!window.tiles[i])
        {
            //console.log("Tile not found: i: " + i + "("+x+","+y+")");
            return null;
        }

        return window.tiles[i];
    },

    getGameTileByXY: function(x, y)
    {
        var mapDimensions = TileGrid.getMapSizeInGameTiles();
        if (x < 0 || y < 0)
            return null;

        if (x > mapDimensions.width || y > mapDimensions.height)
            return null;

        var i = y*mapDimensions.width + x;
        if (!TileGrid.gameTiles[i])
        {
            //console.log("Gametile not found: i: " + i + "("+x+","+y+")");
            //throw new Exception("nyt kyllä");
            return null;
        }

        return TileGrid.gameTiles[i];
    },

    getElevationDifference: function(tile, x, y)
    {
        var otherTile = TileGrid.getTileByXY(x, y);
        if (!otherTile)
            return 0;

        return  otherTile.subTiles[4].elevation - tile.subTiles[4].elevation;
    },

    getElevationDifferenceArray: function(tile)
    {
        var a = Array();
        var x = tile.position.x;
        var y = tile.position.y;

        a[0] = TileGrid.getElevationDifference(tile, x-1, y-1 );
        a[1] = TileGrid.getElevationDifference(tile, x, y-1 );
        a[2] = TileGrid.getElevationDifference(tile, x+1, y-1 );

        a[3] = TileGrid.getElevationDifference(tile, x-1, y );
        a[5] = TileGrid.getElevationDifference(tile, x+1, y );

        a[6] = TileGrid.getElevationDifference(tile, x-1, y+1 );
        a[7] = TileGrid.getElevationDifference(tile, x, y+1 );
        a[8] = TileGrid.getElevationDifference(tile, x+1, y+1 );

        return a;

    },

    getSegmentTiles: function(tile, segment)
    {
        var tiles = Array();
        var segments = Array();
        var x = tile.position.x;
        var y = tile.position.y;

        tiles.push(tile);
        segments.push(segment);

        switch(segment)
        {
            case 0:
                tiles.push(TileGrid.getTileByXY(x-1, y));
                tiles.push(TileGrid.getTileByXY(x-1, y-1));
                tiles.push(TileGrid.getTileByXY(x, y-1));
                segments.push(2, 8, 6);
                break;

            case 1:
                tiles.push(TileGrid.getTileByXY(x, y-1));
                segments.push(7);
                break;

            case 2:
                tiles.push(TileGrid.getTileByXY(x+1, y));
                tiles.push(TileGrid.getTileByXY(x+1, y-1));
                tiles.push(TileGrid.getTileByXY(x, y-1));
                segments.push(0, 6, 8);
                break;

            case 3:
                tiles.push(TileGrid.getTileByXY(x-1, y));
                segments.push(5);
                break;
            case 4:
                break;

            case 5:
                tiles.push(TileGrid.getTileByXY(x+1, y));
                segments.push(3);
                break;

            case 6:
                tiles.push(TileGrid.getTileByXY(x-1, y));
                tiles.push(TileGrid.getTileByXY(x-1, y+1));
                tiles.push(TileGrid.getTileByXY(x, y+1));
                segments.push(8, 2, 0);
                break;

            case 7:
                tiles.push(TileGrid.getTileByXY(x, y+1));
                segments.push(1);
                break;

            case 8:
                tiles.push(TileGrid.getTileByXY(x+1, y));
                tiles.push(TileGrid.getTileByXY(x+1, y+1));
                tiles.push(TileGrid.getTileByXY(x, y+1));
                segments.push(6, 0, 2);
                break;
        }

        return {tiles:tiles, segments:segments};
    },

    getAdjacentTilesInArray: function(tile)
    {
        var x = tile.position.x;
        var y = tile.position.y;
        var tiles = Array();

        tiles.push(TileGrid.getTileByXY(x-1, y-1));
        tiles.push(TileGrid.getTileByXY(x, y-1));
        tiles.push(TileGrid.getTileByXY(x+1, y-1));

        tiles.push(TileGrid.getTileByXY(x+1, y));
        tiles.push(TileGrid.getTileByXY(x+1, y+1));

        tiles.push(TileGrid.getTileByXY(x, y+1));
        tiles.push(TileGrid.getTileByXY(x-1, y+1));
        tiles.push(TileGrid.getTileByXY(x-1, y));

        return tiles;
    },

    getDirectAdjacentTilesInArray: function(tile)
    {
        var x = tile.position.x;
        var y = tile.position.y;
        var tiles = Array();

        //tiles.push(TileGrid.getTileByXY(x-1, y-1));
        tiles.push(TileGrid.getTileByXY(x, y-1));
        //tiles.push(TileGrid.getTileByXY(x+1, y-1));
        tiles.push(TileGrid.getTileByXY(x-1, y));

        tiles.push(TileGrid.getTileByXY(x+1, y));
        //tiles.push(TileGrid.getTileByXY(x+1, y+1));

        tiles.push(TileGrid.getTileByXY(x, y+1));
        //tiles.push(TileGrid.getTileByXY(x-1, y+1));


        return tiles;
    },

    getFromAdjacentTilesArray: function(tiles, i, add)
    {
        //console.dir(tiles);
        //console.log("i: " + i);                 //2
        //console.log("add: " + add);             //4

        //console.log("length: " + tiles.length); //8

        i = parseInt(i);
        add = parseInt(add);

        var newI = 0;
        if (i+add >= tiles.length)
        {
            //console.log(i+add);
            newI = (i+add) - tiles.length;
        }
        else if (i+add < 0)
        {
            //console.log("IF2");
            newI = tiles.length-(i+add);
        }
        else
        {
            //console.log("IF3");
            newI = i+add;
        }
        //console.log("newI: " + newI ) ;         //16

        return newI;

    },

    getAdjacentTilesArrayAngle: function(i)
    {
        if (i === null)
            return 0;

        switch(parseInt(i))
        {
            case 0:
                return 135;

            case 1:
                return 180;

            case 2:
                return 225;

            case 3:
                return 270;

            case 4:
                return 315;

            case 5:
                return 0;

            case 6:
                return 45;

            case 7:
                return 90;

        }
    },

}