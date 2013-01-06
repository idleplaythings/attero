
    window.Graphics = {
 
    width: 1000,
    height: 800,
    camera: null,
    cameraPos: {x:0,y:0},
    scene: new THREE.Scene(),
    renderer: null,
    zoom: 1,
    ambientLightColor: 0xffffff,
    light: null,
    
    init: function()
    {
        var width = window.innerWidth;
        var height = window.innerHeight;
        Graphics.width = width;
        Graphics.height = height;
        var zoom = Graphics.zoom;
        
        var camera = new THREE.OrthographicCamera( width / (-80*zoom), width / (80*zoom), height / (80*zoom), height / (-80*zoom), 0.01, 1000 );
        
        var gridWidth = TileGrid.getSubTileGridWidht();
        
        var x = (width - gridWidth);
        var y = (height - gridWidth);
        
        camera.position.z = 200;
        camera.position.x = x/80;//width/160 - 0.5;//4.5;
        camera.position.y = -y/80;//-height/160 + 0.5;//-4.5;
        
        Graphics.cameraPos = {x:camera.position.x, y:camera.position.y};
        Graphics.camera = camera;
        Graphics.scene.add( camera );

        var ambientLight = new THREE.AmbientLight(Graphics.ambientLightColor);
        Graphics.scene.add(ambientLight);

        Graphics.renderer = new THREE.WebGLRenderer();
        Graphics.renderer.setSize( width, height );
        Graphics.renderer.autoClear = false;

        $( Graphics.renderer.domElement ).addClass("webglCanvas").appendTo("body");
    },
    
    animate: function() {

        requestAnimationFrame( Graphics.animate );
        Graphics.render();

    },

    render: function() {
        Graphics.renderer.clear();
        Graphics.renderer.render( WaterLayer.scene, Graphics.camera );
        Graphics.renderer.render( Graphics.scene, Graphics.camera );
        Graphics.renderer.render( FogOfWar.scene, Graphics.camera );
        Graphics.renderer.render( Grid.scene, Graphics.camera );
    },
    
    moveCamera: function (pos){
        
        Graphics.camera.position.x = Graphics.cameraPos.x - pos.x/80/Graphics.zoom;
        Graphics.camera.position.y = Graphics.cameraPos.y + pos.y/80/Graphics.zoom;
        
        WaterLayer.light.position.x = Graphics.cameraPos.x - pos.x/80/Graphics.zoom;
        WaterLayer.light.position.y = Graphics.cameraPos.y + pos.y/80/Graphics.zoom;
    },
};
