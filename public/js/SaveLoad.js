var SaveLoad =
{
	saveMap: function(name)
	{

		if (!name)
			throw "You need to give a name for the map.";

		var data = TileGrid.serialize();
		data.name = name;
		var json = JSON.stringify(data);
		SaveLoad.submitAjax(json, "POST");
	},

	submitAjax: function(data, method)
	{
		$.ajax({
            type : method,
            url : '/gamemap',
            contentType: 'application/json; charset=UTF-8',
            dataType : 'json',
            data: data,
            success : SaveLoad.successSubmit,
            error : SaveLoad.errorAjax
        });
	},

    loadMap: function(id)
    {

        if (typeof id == "undefined")
            throw "You need to give a id for the map.";

        var data = {"mapid": id};
        var json = JSON.stringify(data);
        SaveLoad.submitAjax(json, "GET");
    },

	successSubmit: function(data){
        console.dir(data);
    },

	errorAjax: function(jqXHR, textStatus, errorThrown){
        console.dir(jqXHR);
        console.dir(errorThrown);
        window.confirm.exception({error:"AJAX error: " +textStatus} , function(){});
    }
}