
function Loadable(what, list)
{
    this.what = what;
    this.members = list;
    this.loadedIndex = null;
    this.done = false;
}

Loadable.prototype = {

	constructor: Loadable,

    load: function(){}

};

var LoadMap = function(id)
{
    this.id = id;
    Loadable.call( this, "Map", Array(id) );
};

LoadMap.prototype = Object.create( Loadable.prototype );

LoadMap.prototype.load = function()
{
    ResourceLoader.createOverlay(this);
    this.done = true;
    this.submitLoadAjax(this.id);
};

LoadMap.prototype.submitLoadAjax = function(id)
{
    $.ajax({
        type : 'GET',
        url : '/gamemap/'+id,
        dataType : 'json',
        data: {},
        success : $.proxy(this.successLoad, this),
        error : $.proxy(this.errorLoad, this)
    });
};

LoadMap.prototype.successLoad = function(data)
{
    ResourceLoader.onResourceLoaded( null );

    TileGrid.createFromJson(data);
    ResourceLoader.loadTiles(this.onLoaded);
    ResourceLoader.startBatch();
};

LoadMap.prototype.errorLoad = function(data)
{
    ResourceLoader.remove();
};

LoadMap.prototype.onLoaded = function()
{
    ResourceLoader.remove();
};

var LoadTiles = function(list)
{
    var what = "Tiles";
    Loadable.call( this, what, list );
}

LoadTiles.prototype = Object.create( Loadable.prototype );

LoadTiles.prototype.load = function ()
{
    if (this.done)
        return;

    var l = this.members.length;
    if (this.loadedIndex != null)
        l = this.loadedIndex;

    while (l--)
    {
        this.members[l].init();
        ResourceLoader.onResourceLoaded( null );

        if (l==0){
            setTimeout(ResourceLoader.startBatch, 10);
            this.done = true;
            return;
        }


        if (l%100 == 0){
            this.loadedIndex = l;
            ResourceLoader.createOverlay(this);
            setTimeout(ResourceLoader.startBatch, 2);
            return;
        }
    }


};

var LoadTileGrid = function()
{
    var what = "Tile grid";
    Loadable.call( this, what, Array[1] );
}

LoadTileGrid.prototype = Object.create( Loadable.prototype );

LoadTileGrid.prototype.load = function ()
{
    if (this.done)
        return;

    ResourceLoader.createOverlay(this);
    this.done = true;
    setTimeout(TileGrid.init, 10);


};