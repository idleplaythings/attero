var LoadMenu = function LoadMenu(dispatcher, saveLoad)
{
    Confirm.call( this, dispatcher);
    this.saveLoad = saveLoad;

    this.prepare();
    this.element.addClass('loadmapmenu');
    this.setMessage("Load map", null);
    //this.setOk($.proxy(this.loadMap, this));
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

LoadMenu.prototype.populateMapList = function(data)
{
    $('.maplist', this.element).remove();

    var maplist = $('<div class="maplist"></div>');
    for (var i in data)
    {
        $('<div class="mapname" data-mapid="'+data[i].id+'">'+data[i].name+'</div>').on('click', $.proxy(this.onMapNameClicked, this)).appendTo(maplist);
    }

    maplist.appendTo(this.element.find('.msgcontainer'));
};

LoadMenu.prototype.onMapNameClicked = function(event)
{
    this.remove();

    var element = $(event.srcElement);
    var id = element.data("mapid");
    this.saveLoad.loadMap(id);
};

LoadMenu.prototype.show = function(data)
{
    this.populateMapList(data);
    time = 250;
    this.overlay.show();
    this.element.fadeIn(time);

    return this;
};