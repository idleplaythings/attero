
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