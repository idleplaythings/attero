var SaveLoad =
{
  	saveMap: function(name)
  	{

  		if (!name)
  			throw "You need to give a name for the map.";

  		var data = TileGrid.serialize();
  		data.name = name;
  		var json = JSON.stringify(data);
  		SaveLoad.submitSaveAjax(json);
  	},

  	submitSaveAjax: function(data)
  	{
  		$.ajax({
              type : 'POST',
              url : '/gamemap',
              contentType: 'application/json; charset=UTF-8',
              dataType : 'json',
              data: data,
              success : SaveLoad.successSubmit,
              error : SaveLoad.errorAjax
          });
  	},

    createGame: function(unitcount, mapid)
    {

      if (!mapid || !unitcount)
        throw "You need to give a unitcount and map id.";

      var data = TileGrid.serialize();
      data = {mapid: mapid, unitcount: unitcount};
      var json = JSON.stringify(data);
      SaveLoad.submitCreateAjax(json);
    },

    submitCreateAjax: function(data)
    {
      $.ajax({
              type : 'POST',
              url : '/creategame',
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

        SaveLoad.submitLoadAjax(id);
    },

    submitLoadAjax: function(id)
    {
        $.ajax({
            type : 'GET',
            url : '/gamemap/'+id,
            dataType : 'json',
            data: {},
            success : SaveLoad.successSubmit,
            error : SaveLoad.errorAjax
        });
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