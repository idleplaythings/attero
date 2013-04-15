var UnitManager = function UnitManager(dispatcher)
{
    window.units = Array();

    this.typeDefinitions = {
        1: "GeInfantry",
        2: "StugIII"
    };

    this.textureSize = 128;
    this.unitscale = 0.5;

    dispatcher.attach(new EventListener("ZoomEvent", $.proxy(this.onZoom, this)));
};

UnitManager.prototype.onZoom = function(event)
{
    var zoom = event.zoom;
    var scale = this.getIconScale(zoom);

    for (var i in window.units)
    {
        window.units[i].setIconScale(scale);
    }
};

UnitManager.prototype.getIconScale = function(zoom)
{
    var size = window.innerWidth > window.innerHeight ?  window.innerHeight : window.innerWidth;
    return this.textureSize / size * zoom * this.unitscale;
};

UnitManager.prototype.createFromString = function(units)
{
    console.log(units);
    units = units.split(";");
    window.units = Array();

    for (var i in units)
    {
        var unit = this.createUnitFromString(units[i]);
        unit.showIcon();
    }
};



UnitManager.prototype.createUnitFromString = function(unitstring)
{
    var details = unitstring.split(",");
    var className = this.typeDefinitions[details[1]];
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

    return unit;
};

UnitManager.prototype.createFromJsonIfNeeded = function(unitstring)
{
    var details = unitstring.split(",");
    var id = details[0];

    if (window.units[id])
        return window.units[id];

    return this.createUnitFromString(unitstring);
};

