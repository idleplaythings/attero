
    window.Graphics = {

    width: 1000,
    height: 800,
    camera: null,
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
        camera.position.x = (width/2)/40;
        camera.position.y = (-height/2)/40;

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
        AnimationHandler.tick();
        Graphics.render();

    },

    render: function() {
        Graphics.renderer.clear();
        Graphics.renderer.render( WaterLayer.scene, Graphics.camera );
        Graphics.renderer.render( Graphics.scene, Graphics.camera );
        Graphics.renderer.render( FogOfWar.scene, Graphics.camera );
        Graphics.renderer.render( Grid.scene, Graphics.camera );
    },

    zoomCamera: function(zoom)
    {
        var width = window.innerWidth;
        var height = window.innerHeight;
        Graphics.zoom = parseFloat(zoom.toFixed(1));

        Graphics.camera.left = width / (-80*zoom);
        Graphics.camera.right = width / (80*zoom);
        Graphics.camera.top = height / (80*zoom);
        Graphics.camera.bottom = height / (-80*zoom);

        Graphics.camera.updateProjectionMatrix();
    },

    moveCamera: function (pos){

        Graphics.camera.position.x -= pos.x/40;
        Graphics.camera.position.y += pos.y/40;

        WaterLayer.light.position.x = Graphics.camera.position.x;
        WaterLayer.light.position.y = Graphics.camera.position.y;
    },

    camPos: function()
    {
        //TODO: add zoom multipliers
        return {x: Graphics.camera.position.x*40, y:Graphics.camera.position.y*40};
    }
};
