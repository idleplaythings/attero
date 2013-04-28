var Unit = function(args)
{
    if (!args.id) {
        throw "Unit must have an Id";
    }

    if (!args.position) {
        throw "Unit has to have position defined";
    }

    this.id = args.id;
    this.setPosition(args.position);
    this.owner = args.owner;
    this.setIconPosition(this.position);
    this.azimuth = args.azimuth || 0;

    this.icon = null;
    this.texturedata = null;

    this.iconSprite = null;
    this.underIconSprite = null;
};

Unit.prototype.getAzimuth = function()
{
    return this.azimuth;
}

Unit.prototype.getTurretFacing = function()
{
    return this.azimuth;
}

Unit.prototype.lookAt = function(target)
{
    var azimuth;
    if (target.x && target.y)
    {
        azimuth = MathLib.getAzimuthFromTarget(this.position, target);
    }
    else
    {
        azimuth = target;
    }

    this.setAzimuth(azimuth);
};

Unit.prototype.faceTurretAt = function(target)
{
    //TODO: need turrets
};

Unit.prototype.setAzimuth = function(azimuth)
{
    this.azimuth = azimuth;
    this.icon.setAzimuth(azimuth);
};

Unit.prototype.moveTo = function(position)
{
    this.lookAt(position);

    var move = new MoveOrder(this, position);
    move.execute();

    GameEventDispatcher.dispatch(new MoveEvent("player", this, move.route));
};

Unit.prototype.debugMoveTo = function(position)
{
    console.log("ATTENTION: This is a debug move. No message to server sent. Game is now desyched!");
    this.lookAt(position);
    this.setPosition(position);
    this.setIconPosition(position);
};

Unit.prototype.setPosition = function(position)
{
    position.x = parseInt(position.x, 10);
    position.y = parseInt(position.y, 10);

    if (this.position)
        TileGrid.getGameTileByXY(this.position.x, this.position.y).unSubscribeUnitToTile(this);

    this.position = position;
    TileGrid.getGameTileByXY(this.position.x, this.position.y).subscribeUnitToTile(this);
};

Unit.prototype.setIconPosition = function(position)
{
    if (this.icon)
    {
        var pos = TileGrid.gameCordinatesTo3d(position);
        this.icon.group.position = new THREE.Vector3(pos.x, -pos.y, 3);
    }
}

Unit.prototype.setIconScale = function(scale)
{
    this.icon.setIconScale(scale);
}

Unit.prototype.createIcon = function()
{
    this.icon.createIcon();
    this.icon.setAzimuth(this.azimuth);

    var pos = TileGrid.gameCordinatesTo3d(this.position);

    if (this.owner == window.playerid)
        this.icon.setFriendly();
    else
        this.icon.setEnemy();



    this.icon.group.position = new THREE.Vector3(pos.x, -pos.y, 3);
    this.setIconScale(window.UnitManager.getIconScale(1));
    Grid.scene.add(this.icon.group);
};

Unit.prototype.showIcon = function()
{
    this.icon.show();
}

Unit.prototype.hideIcon = function()
{
    this.icon.hide();
}




var InfantryUnit = function(args)
{
    Unit.call( this, args);
    if (! args.membertypes)
        throw "InfantryUnit needs args.membertypes";

    this.membertypes = args.membertypes;
};

InfantryUnit.prototype = Object.create( Unit.prototype );





var VehicleUnit = function(args)
{
    Unit.call( this, args);
};

VehicleUnit.prototype = Object.create( Unit.prototype );




var GeInfantry = function(args)
{
    InfantryUnit.call( this, args);
    this.icon = new InfantryUnitIcon(this, window.unitTilesets["ge_infantry"], this.membertypes);
};

GeInfantry.prototype = Object.create( InfantryUnit.prototype );




var StugIII = function(args)
{
    VehicleUnit.call( this, args);
    this.icon = new VehicleUnitIcon(this, window.unitTilesets["ge_tanks"], 0);
};

StugIII.prototype = Object.create( VehicleUnit.prototype );
