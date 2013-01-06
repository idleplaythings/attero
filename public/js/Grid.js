window.Grid = 
{
    scene: new THREE.Scene(),
    mesh:null,
    material:null,
    opacity:0.05,
    
    init: function()
    {
        var tileRowCount = TileGrid.tileRowCount;
        var subSegments = TileGrid.getSubTextureCount();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = TileGrid.tileRowCount/subSegmentSize;

        var y = (tileRowCount/2 - subSegmentSize/2);//
        var x = (tileRowCount/2 - subSegmentSize/2);//

        var count = (tileRowCount*2)+1;
        var geometry = new THREE.PlaneGeometry( 
                    tileRowCount+0.5, tileRowCount+0.5, count, count );
                    
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