var LoadMenu = function LoadMenu(dispatcher, saveLoad)
{
    Confirm.call( this, dispatcher);
    this.saveLoad = saveLoad;

    this.prepare();
    this.setMessage("Load map", "Choose map to load");
    this.setOk($.proxy(this.loadMap, this));
    this.setCancel(null);
};

LoadMenu.prototype = Object.create( Confirm.prototype );

LoadMenu.prototype.loadMap = function()
{
    this.saveLoad.loadMap();
};

LoadMenu.prototype.remove = function()
{
    this.element.hide();
    this.overlay.hide();

    return this;
};