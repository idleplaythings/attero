window.UnitManager =
{
    createFromString: function(units)
    {
        console.log(units);
        var units = units.split(";");
        window.units = Array();

        for (var i in units)
        {
            var details = units[i].split(",");
            console.log("unittype: " + details[1] + " owner: " + details[2]);

            var className = UnitManager.typeDefinitions[details[1]];
            var id = details[0];
            args =
            {
                id: id,
                owner:details[2],
                position:{x:details[3], y:details[4]},
                azimuth:details[5],
                turretAzimuth:details[6],
                membertypes: Array(0,1,2,3,4,5,6,7,8,9)
            };

            var unit = new window[className](args);
            unit.createIcon();
            window.units[id] = unit;
        }
    },

    typeDefinitions: {
        1: "GeInfantry",
        2: "StugIII"
    }
}