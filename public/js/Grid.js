window.Grid =
{
    scene: new THREE.Scene(),
    mesh:null,
    material:null,
    opacity:0.50,

    init: function()
    {
        var width = TileGrid.tileRowCount +0.5;
        var height = TileGrid.tileColumnCount + 0.5;

        var subSegments = TileGrid.getSubTextureCount();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = TileGrid.tileRowCount/subSegmentSize;

        var y =width/2 - 0.25;//
        var x =height/2 - 0.25;//

        var wcount = (TileGrid.tileRowCount*2)+1;
        var hcount = (TileGrid.tileColumnCount*2)+1;
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

    }
};