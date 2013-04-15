window.Grid =
{
    scene: new THREE.Scene(),
    mesh:null,
    material:null,
    opacity:0.05,

    init: function()
    {
        var mapDimensions = TileGrid.getMapSizeIn3d();
        var width = mapDimensions.width +0.5;
        var height = mapDimensions.height + 0.5;

        var subSegments = TileGrid.getSubTextureCount();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = mapDimensions.width/subSegmentSize;

        var y =width/2 - 0.25;//
        var x =height/2 - 0.25;//

        var mapDimensionsInGameTiles = TileGrid.getMapSizeInGameTiles();
        var wcount = mapDimensionsInGameTiles.width;
        var hcount = mapDimensionsInGameTiles.height;
        var geometry = new THREE.PlaneGeometry(
                    width, height, wcount, hcount );

        Grid.material = new THREE.MeshBasicMaterial(
        {
            transparent:true,
            wireframe:true,
            color:0xFFFFFF,
            opacity:Grid.opacity,
            depthTest:false,
            depthWrite:false
        });

        Grid.mesh = new THREE.Mesh(
            geometry,
            Grid.material);

        Grid.mesh.position = new THREE.Vector3(x, -y, 2);

        Grid.scene.add(Grid.mesh);

    },

    setOpacity: function(opacity)
    {
        Grid.material.opacity = opacity;
    }
};