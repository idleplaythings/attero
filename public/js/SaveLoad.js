var SaveLoad = function(dispatcher)
{
    this.loadMenu = new LoadMenu(dispatcher, this);
    this.saveMenu = new SaveMenu(dispatcher, this);

    dispatcher.attach(new EventListener("LoadMapEvent", $.proxy(this.onLoad, this)));
    dispatcher.attach(new EventListener("SaveMapEvent", $.proxy(this.onSave, this)));
};

SaveLoad.prototype.onSave = function()
{
    this.saveMenu.show();
};

SaveLoad.prototype.createGame = function(unitcount, mapid)
{
    if (!mapid || !unitcount)
        throw "You need to give a unitcount and map id.";

    var data = TileGrid.serialize();
    data = {mapid: mapid, unitcount: unitcount};
    var json = JSON.stringify(data);
    this.submitCreateAjax(json);
};

SaveLoad.prototype.submitCreateAjax = function(data)
{
  $.ajax({
        type : 'POST',
        url : '/creategame',
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        data: data,
        success : this.successSubmit,
        error : this.errorAjax
    });
};

SaveLoad.prototype.onLoad = function()
{
    $.ajax({
        type : 'GET',
        url : '/mapnames',
        dataType : 'json',
        data: {},
        success : $.proxy(this.onMapNamesLoaded, this),
        error : this.errorAjax
    });
};

SaveLoad.prototype.onMapNamesLoaded = function(data)
{
    console.log(data);
    this.loadMenu.show(data);
};

SaveLoad.prototype.loadMap = function(id)
{
    if (typeof id == "undefined")
        throw "You need to give a id for the map.";

    ResourceLoader.addLoadable(new LoadMap(id));
    location.hash = id;
    ResourceLoader.run();
};

SaveLoad.prototype.successSubmit = function(data)
{
    console.dir(data);
};

SaveLoad.prototype.errorAjax = function(jqXHR, textStatus, errorThrown){
    console.dir(jqXHR);
    console.dir(errorThrown);
    window.confirm.exception({error:"AJAX error: " +textStatus} , function(){});
};
