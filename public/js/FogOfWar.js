window.FogOfWar =
{
    uniforms: null,
    scene: new THREE.Scene(),
    mesh:null,
    material:null,
    opacity:0.5,

    init: function()
    {
        console.log("FogOfWar init");

        var mapDimensions = TileGrid.getMapSizeIn3d();
        var width = mapDimensions.width +0.5;
        var height = mapDimensions.height + 0.5;

        var y =width/2 -0.25;//
        var x =height/2 -0.25;//


        var vertShader = document.getElementById('fogvertexShader').innerHTML;
        var fragShader = document.getElementById('fogfragmentShader2').innerHTML;

        FogOfWar.setUniforms();

        var geometry = new THREE.PlaneGeometry(
                    width, height, 1, 1 );

        geometry.dynamic = true

        FogOfWar.material = new THREE.ShaderMaterial({
            uniforms: FogOfWar.uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            transparent:true,
            depthTest:false,
            depthWrite:false,
            opacity:0.5
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
        //var fogtexture = THREE.ImageUtils.loadTexture("/assets/resource/fogofwar16inverse.png");
        //fogtexture.magFilter = THREE.NearestFilter;
        //fogtexture.minFilter = THREE.NearestMipMapNearestFilter;

        var mapDimensions = TileGrid.getMapSizeIn3d();
        var width = mapDimensions.width;
        var height = mapDimensions.height;

        FogOfWar.uniforms = {
            xStep: {type: "f", value: 1/width/20},
            yStep: {type: "f", value: 1/height/20},
            tilemap: {type: "t", value: LineOfSight.getTilemap()},

        };
    /*
        FogOfWar.uniforms = {
            fogtexture: { type: "t", value: fogtexture },
            tilewidth: {type: "f", value: 1/width},
            tileheight: {type: "f", value: 1/height},
            tilemap: {type: "t", value: LineOfSight.getTilemap()},
            tilesize: {type: "i", value: 64},
            opacity: {type: "f", value: FogOfWar.opacity}

        };

        */
    },

    updateLosStatus: function()
    {
        FogOfWar.uniforms.tilemap.value = LineOfSight.getTilemap();
        FogOfWar.material.needsUpdate = true;
    },
};