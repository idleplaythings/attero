var SaveLoad = function(dispatcher)
{
    this.loadMenu = new LoadMenu(dispatcher, this);

    dispatcher.attach(new EventListener("LoadMapEvent", $.proxy(this.onLoad, this)));
};

SaveLoad.prototype.saveMap = function(name)
{
	if (!name)
		throw "You need to give a name for the map.";

	var data = TileGrid.serialize();
	data.name = name;
	var json = JSON.stringify(data);
	this.submitSaveAjax(json);
};

SaveLoad.prototype.submitSaveAjax = function(data)
{
    $.ajax({
        type : 'POST',
        url : '/gamemap',
        contentType: 'application/json; charset=UTF-8',
        dataType : 'json',
        data: data,
        success : this.successSubmit,
        error : this.errorAjax
    });
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
    this.loadMenu.show();
};

SaveLoad.prototype.loadMap = function(id)
{
    if (typeof id == "undefined")
        throw "You need to give a id for the map.";

    this.submitLoadAjax(id);
};

SaveLoad.prototype.submitLoadAjax = function(id)
{
    $.ajax({
        type : 'GET',
        url : '/gamemap/'+id,
        dataType : 'json',
        data: {},
        success : this.successLoad,
        error : this.errorAjax
    });
};

SaveLoad.prototype.successLoad = function(data)
{
    TileGrid.createFromJson(data);
    ResourceLoader.loadTiles(this.onLoaded);
};

SaveLoad.prototype.onLoaded = function()
{
    ResourceLoader.remove();
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
