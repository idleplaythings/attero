window.WaterLayer =
{
    scene: new THREE.Scene(),
    light:null,

    init: function()
    {
        var subSegments = TileGrid.getSubTextureCount();
        var subSegmentSize = TileGrid.subSegmentSize;
        var subSegmentsPerLine = TileGrid.getMapSizeIn3d().width/subSegmentSize;

        //console.log("subSegments: " + subSegments);
        for (var i=0; i<subSegments; i++ )
        {
            var y = Math.floor(i/subSegmentsPerLine)*subSegmentSize + subSegmentSize/2;
            var x = (i % subSegmentsPerLine)*subSegmentSize + subSegmentSize/2;

            var geometry = new THREE.PlaneGeometry(
                        subSegmentSize, subSegmentSize, 1, 1 );


            var mesh = new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial(
                    {
                        transparent: true,
                        //wireframe:true,
                        shininess:1,
                        metal:true,
                        color:0x88d1ec,
                        depthTest:false,
                        depthWrite:false
                    }));

            mesh.position = new THREE.Vector3(x, -y, -10);

            WaterLayer.scene.add(mesh);
        }

        WaterLayer.light = new THREE.PointLight( 0xfffaac, 1, 10);
        WaterLayer.light.position.set( 0, 0, -2 );
        WaterLayer.scene.add( WaterLayer.light );

        var light = new THREE.PointLight( 0xfffaac, 1, 1000);
        light.position.set( 0, 0, 100 );
        WaterLayer.scene.add( light );

        WaterLayer.scene.add(Graphics.camera);
    }
};