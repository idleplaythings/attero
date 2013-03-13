var Graphics = function(dispatcher){

    this.width = 1000;
    this.height = 800;
    this.camera = null;
    this.scene = new THREE.Scene();
    this.renderer = null,
    this.ambientLightColor = 0xffffff,
    this.light = null;

    this.dispatcher = dispatcher;

    this.dispatcher.attach(new EventListener("ScrollEvent", $.proxy(this.onScroll, this)));
    this.dispatcher.attach(new EventListener("ZoomEvent", $.proxy(this.onZoom, this)));
};

Graphics.prototype.constructor = Graphics;

Graphics.prototype.init = function()
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.width = width;
    this.height = height;
    var zoom = 1;

    var camera = new THREE.OrthographicCamera( width / (-80*zoom), width / (80*zoom), height / (80*zoom), height / (-80*zoom), 0.01, 1000 );

    var gridWidth = TileGrid.getSubTileGridWidht();

    camera.position.z = 200;

    this.camera = camera;
    this.scene.add( camera );

    var ambientLight = new THREE.AmbientLight(Graphics.ambientLightColor);
    this.scene.add(ambientLight);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( width, height );
    this.renderer.autoClear = false;

    $(this.renderer.domElement ).addClass("webglCanvas").appendTo("body");
};

Graphics.prototype.animate = function()
{
    requestAnimationFrame( Graphics.animate );
    AnimationHandler.tick();
    Graphics.render();

};

Graphics.prototype.render = function()
{
    this.renderer.clear();
    this.renderer.render( WaterLayer.scene, Graphics.camera );
    this.renderer.render( this.scene, Graphics.camera );
    this.renderer.render( FogOfWar.scene, Graphics.camera );
    this.renderer.render( Grid.scene, Graphics.camera );
};

Graphics.prototype.zoomCamera = function(zoom)
{
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.camera.left = width / (-80*zoom);
    this.camera.right = width / (80*zoom);
    this.camera.top = height / (80*zoom);
    this.camera.bottom = height / (-80*zoom);

    //UnitHelper.updateZoom(zoom);

    this.camera.updateProjectionMatrix();
};

Graphics.prototype.moveCameraToPosition = function(pos)
{
    this.camera.position.x = pos.x;
    this.camera.position.y = -pos.y;

    WaterLayer.light.position.x = this.camera.position.x;
    WaterLayer.light.position.y = this.camera.position.y;
};

Graphics.prototype.onScroll = function(event)
{
    if (event.position)
        this.moveCamera(event.position);
};

Graphics.prototype.onZoom = function(event)
{
    if (event.zoom)
        this.zoomCamera(event.zoom);
};

Graphics.prototype.moveCamera = function(pos)
{
    this.camera.position.x = pos.x/40;
    this.camera.position.y = pos.y/40;

    WaterLayer.light.position.x = this.camera.position.x;
    WaterLayer.light.position.y = this.camera.position.y;
};

Graphics.prototype.camPos = function()
{
    return {x: this.camera.position.x*40, y:this.camera.position.y*40};
};
