window.FogOfWar = 
{
    uniforms: null,
    scene: new THREE.Scene(),
    mesh:null,
    material:null,
    opacity:0.5,
    
    init: function()
    {
        var tileRowCount = TileGrid.tileRowCount;
        var subSegments = TileGrid.getSubTextureCount();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = TileGrid.tileRowCount/subSegmentSize;
        
        var vertShader = document.getElementById('vertexShader').innerHTML;
        var fragShader = document.getElementById('fragmentShader').innerHTML;

        FogOfWar.setUniforms();
        
        var y = tileRowCount/2 - subSegmentSize/2;
        var x = tileRowCount/2 - subSegmentSize/2;

        var geometry = new THREE.PlaneGeometry( 
                    tileRowCount+0.5, tileRowCount+0.5, 1, 1 );
                    
        geometry.dynamic = true 

        FogOfWar.material = new THREE.ShaderMaterial({
            uniforms: FogOfWar.uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            transparent:true,
            depthTest:false,
            depthWrite:false,
            opacity:0.5,
            //wireframe:true
        });

        FogOfWar.mesh = new THREE.Mesh( 
            geometry, 
            FogOfWar.material);

        FogOfWar.mesh.position = new THREE.Vector3(x, -y, 2);

        FogOfWar.scene.add(FogOfWar.mesh);
        
    },
    
    setUniforms: function()
    {
        var fogtexture = THREE.ImageUtils.loadTexture("resource/fogofwar16inverseB.png");
        fogtexture.magFilter = THREE.NearestFilter;
        fogtexture.minFilter = THREE.NearestMipMapNearestFilter;
        
        var subSegments = TileGrid.getSubTextureCount();
        var tileRowCount = TileGrid.tileRowCount;

        FogOfWar.uniforms = {
            fogtexture: { type: "t", value: fogtexture },
            tilewidth: {type: "f", value: 1/LineOfSight.rowcount},
            tileheight: {type: "f", value: 1/LineOfSight.rowcount},
            tilemap: {type: "t", value: LineOfSight.getTilemap()},
            tilesize: {type: "i", value: 64},
            opacity: {type: "f", value: FogOfWar.opacity}

        };
    },
    
    updateLosStatus: function()
    {
        FogOfWar.uniforms.tilemap.value = LineOfSight.getTilemap();
        FogOfWar.material.needsUpdate = true;
    },
    
    getTilemap: function()
    {
        var size = TileGrid.tileRowCount;
        var finalCanvas = 
            $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
        //$(finalCanvas).appendTo('#texturecontainer');
        var finalContext = finalCanvas.getContext("2d");
        var imageData = {
            data : new Uint8Array(finalContext.getImageData(0,0,size, size).data.buffer),
            height: size,
            width: size
        };
        
        for (var i in window.tiles)
        {
            var tile = window.tiles[i];
            var pixels = i*4; 
            var r = pixels;
            var g = pixels+1;
            var b = pixels+2;
            var a = pixels+3;
            
            var tileinfo = tile.getLosTexture();
            
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
    
    calculateLosTextures: function()
    {
        for (var i in window.tiles)
        {
            var tile = window.tiles[i];
            
            if ( ! tile.inLOS)
            {
                tile.losTexture = {x:3, y:0};
                continue;
            }
            
            var tiles = TileGrid.getDirectAdjacentTilesInArray(tile);
            var number = Array(4);
            //console.dir(tiles);
            for (var a in tiles)
            {
                if (a === 4)
                    continue;
                
                if ( ! tiles[a])
                {
                    number[a] = 1;
                    continue;
                }
                
                number[a] = tiles[a].inLOS ? 1 : 0;
            }
            number = number.join("");
            number = parseInt(number, 2)
            tile.losTexture = FogOfWar.getShadowTexture(number);
        }
    },
    
    getShadowTexture: function(number)
    {
        var x = number % 4;
        var y = 3-Math.floor(number / 4);
        //if (number != 15)
        
        if (number === 15)
            return {x:255, y:255};
        
        return {x:x, y:y};
    }
};