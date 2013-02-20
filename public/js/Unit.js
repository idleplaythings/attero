window.UnitHelper = {
    textureSize: 128
};

window.units = Array();

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
    this.azimuth = args.azimuth || 0;

    this.THREEgeometry = null;
    this.THREEmaterial = null;
    this.THREEmesh = null;
    this.THREEtexture = null;
    this.texturedata = null;
};

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

Unit.prototype.setAzimuth = function(azimuth)
{
    this.azimuth = azimuth;
    if (this.THREEmesh)
    {
        this.THREEmesh.rotation.z = MathLib.degreeToRadian(MathLib.addToAzimuth(360, -this.azimuth));
    }
};

Unit.prototype.moveTo = function(position)
{
    console.log(this);
    ServerConnection.sendMessage({
        type: "Move",
        payload: {
            unitId: this.id,
            currentPosition: {
                x: this.position.x,
                y: this.position.y
            },
            targetPosition: {
                x: position.x,
                y: position.y
            }
        }
    });
    // this.setPosition(position);
};

Unit.prototype.setPosition = function(position)
{
    position.x = parseInt(position.x, 10);
    position.y = parseInt(position.y, 10);

    if (this.position)
        TileGrid.getGameTileByXY(this.position.x, this.position.y).unSubscribeUnitToTile(this);

    this.position = position;
    TileGrid.getGameTileByXY(this.position.x, this.position.y).subscribeUnitToTile(this);

    if (this.THREEmesh)
    {
        var pos = TileGrid.gameCordinatesTo3d(this.position);
        this.THREEmesh.position = new THREE.Vector3(pos.x, -pos.y, 3);
    }
};

Unit.prototype.createModel = function()
{
    this.THREEgeometry  = new THREE.PlaneGeometry(
        1.6, 1.6, 1, 1 );

    this.THREEgeometry.dynamic = true;

    vertShader = document.getElementById('vertexShader').innerHTML;
    fragShader = document.getElementById('fragmentShader').innerHTML;

    this.THREEmaterial = new THREE.ShaderMaterial({
        uniforms: this.createUniforms(),
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent:true,
        depthTest:false,
        depthWrite:false
        //wireframe:true
    });

    this.THREEmesh = new THREE.Mesh(
        this.THREEgeometry,
        this.THREEmaterial);

    var pos = TileGrid.gameCordinatesTo3d(this.position);

    this.THREEmesh.position = new THREE.Vector3(pos.x, -pos.y, 3);
};

Unit.prototype.createIcon = function()
{
    this.createTexture();
    this.createModel();
    Grid.scene.add(this.THREEmesh);
};


Unit.prototype.createTexture = function()
{
    var size = UnitHelper.textureSize;
    var finalCanvas =
        $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
    //$(finalCanvas).appendTo('#texturecontainer');
    var finalContext = finalCanvas.getContext("2d");

    var offset = 0;
    var t = offset*size;
    finalContext.drawImage(window.unitTilesets[1], t , 0, size, size, 0, 0, size, size);

    //TileGrid.textureDatas[i] = finalContext.getImageData(0, 0, size, size);
    //console.dir(finalContext.getImageData(0,0,size, size).data.buffer);
    this.texturedata = {
        data : new Uint8Array(
            finalContext.getImageData(0,0,size, size).data.buffer),
        height: size,
        width: size
    };

    var tex = new THREE.DataTexture(null, size, size);
    tex.image = this.texturedata;
    tex.needsUpdate = true;
    this.THREEtexture = tex;

};

Unit.prototype.createUniforms = function()
{
    var texture = this.THREEtexture;
    //texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipMapNearestFilter;

    return {
        texture: { type: "t", value: texture }
    };
};

var InfantryUnit = function(args)
{
    Unit.call( this, args);
    if (! args.membertypes)
        throw "InfantryUnit needs args.membertypes";

    this.membertypes = args.membertypes;
};

InfantryUnit.prototype = Object.create( Unit.prototype );

InfantryUnit.prototype.createTexture = function()
{
    var size = UnitHelper.textureSize;
    var finalCanvas =
        $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
    //$(finalCanvas).appendTo('#texturecontainer');
    var finalContext = finalCanvas.getContext("2d");

    for (var i in this.membertypes)
    {
        var memberType = this.membertypes[i];
        var pos = this.getMemberPosition(i);
        var t = this.getTextureOffsetForMember(memberType);
        finalContext.drawImage(this.textureImg, t , 0, 40, 40, pos.x-20, pos.y-20, 40, 40);
    }

    //TileGrid.textureDatas[i] = finalContext.getImageData(0, 0, size, size);
    //console.dir(finalContext.getImageData(0,0,size, size).data.buffer);
    this.texturedata = {
        data : new Uint8Array(
            finalContext.getImageData(0,0,size, size).data.buffer),
        height: size,
        width: size
    };

    var tex = new THREE.DataTexture(null, size, size);
    tex.image = this.texturedata;
    tex.needsUpdate = true;
    this.THREEtexture = tex;

};

InfantryUnit.prototype.getTextureOffsetForMember = function(memberType)
{
    return memberType*40;
};

InfantryUnit.prototype.getMemberPosition = function(index)
{
    var origo = Math.floor(UnitHelper.textureSize/2);
    if (index < 2)
    {
        var angle =  ((index*180)+90);
        return MathLib.getPointInDirection(8, angle, origo, origo);
    }
    else if ( index < 11)
    {
        var angle =  (index-2)*45;
        return MathLib.getPointInDirection(30, angle, origo, origo);
    }

    return null;
};

var VehicleUnit = function(args)
{
    Unit.call( this, args);
};

VehicleUnit.prototype = Object.create( Unit.prototype );

VehicleUnit.prototype.createTexture = function()
{
    var size = UnitHelper.textureSize;
    var finalCanvas =
        $('<canvas width="'+size+'" height="'+size+'"></canvas>').get(0);
    //$(finalCanvas).appendTo('#texturecontainer');
    var finalContext = finalCanvas.getContext("2d");

    var t = this.offset*size;
    finalContext.drawImage(this.textureImg, t , 0, size, size, 0, 0, size, size);

    //TileGrid.textureDatas[i] = finalContext.getImageData(0, 0, size, size);
    //console.dir(finalContext.getImageData(0,0,size, size).data.buffer);
    this.texturedata = {
        data : new Uint8Array(
            finalContext.getImageData(0,0,size, size).data.buffer),
        height: size,
        width: size
    };

    var tex = new THREE.DataTexture(null, size, size);
    tex.image = this.texturedata;
    tex.needsUpdate = true;
    this.THREEtexture = tex;

};

var GeInfantry = function(args)
{
    InfantryUnit.call( this, args);
    this.textureImg = window.unitTilesets["ge_infantry"];
    this.offset = 0;
};

GeInfantry.prototype = Object.create( InfantryUnit.prototype );

var StugIII = function(args)
{
    VehicleUnit.call( this, args);
    this.textureImg = window.unitTilesets["ge_tanks"];
    this.offset = 0;
};

StugIII.prototype = Object.create( VehicleUnit.prototype );
