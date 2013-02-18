window.UnitManager =
{
    createFromString: function(units)
    {
        return;

        var units = units.split(";");
        window.units = Array();

        for (var i in units)
        {
            var details = units[i].split(",");
            var className = UnitManager.typeDefinitions[details[1]];
            var id = details[0];
            args =
            {
                id: id,
                position:{x:details[7], y:details[8]}
            };


            window.units[id] = new window[className](args);
        }
    },

    typeDefinitions: {
        1: "StugIII"
    }
}