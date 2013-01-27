window.UnitHelper = {
    textureSize: 128,
}


var Unit = function(args)
{
    if (!args.position)
        throw "Unit has to have position defined"

    this.position = args.position;
    this.THREEgeometry = null;
    this.THREEmaterial = null;
    this.THREEmesh = null;
    this.THREEtexture = null;
    this.texturedata = null;
}

Unit.prototype.createModel = function()
{
    this.THREEgeometry  = new THREE.PlaneGeometry(
        1.6, 1.6, 1, 1 );

    this.THREEgeometry.dynamic = true

    vertShader = document.getElementById('vertexShader').innerHTML;
    fragShader = document.getElementById('fragmentShader').innerHTML;

    this.THREEmaterial = new THREE.ShaderMaterial({
        uniforms: this.createUniforms(),
        vertexShader: vertShader,
        fragmentShader: fragShader,
        transparent:true,
        depthTest:false,
        depthWrite:false,
        //wireframe:true
    });

    this.THREEmesh = new THREE.Mesh(
        this.THREEgeometry,
        this.THREEmaterial);

    var x = 0;
    var y = 0;

    this.THREEmesh.position = new THREE.Vector3(this.position.x, -this.position.y, 3);
}

Unit.prototype.createIcon = function()
{
    this.createTexture();
    this.createModel();
    Grid.scene.add(this.THREEmesh);
}


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

}

Unit.prototype.createUniforms = function()
{
    var texture = this.THREEtexture;
    //texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestMipMapNearestFilter;

    return {
        texture: { type: "t", value: texture },
    };
}

var InfantryUnit = function(args)
{
    Unit.call( this, args);

    console.dir(args);

    if (! args.membertypes)
        throw "InfantryUnit needs args.membertypes";

    this.membertypes = args.membertypes;
}

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

}

InfantryUnit.prototype.getTextureOffsetForMember = function(memberType)
{
    return memberType*40;
}
InfantryUnit.prototype.getMemberPosition = function(index)
{
    var origo = Math.floor(UnitHelper.textureSize/2);
    if (index < 2)
    {
        var angle =  (index*180);
        return MathLib.getPointInDirection(8, angle, origo, origo);
    }
    else if ( index < 11)
    {
        var angle =  (index-2)*45;
        return MathLib.getPointInDirection(30, angle, origo, origo);
    }

    return null;
}

var VehicleUnit = function(args)
{
    Unit.call( this, args);
}

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

}

var GeInfantry = function(args)
{
    InfantryUnit.call( this, args);
    this.textureImg = window.unitTilesets["ge_infantry"];
    this.offset = 0;
}

GeInfantry.prototype = Object.create( InfantryUnit.prototype );

var StugIII = function(args)
{
    VehicleUnit.call( this, args);
    this.textureImg = window.unitTilesets["ge_tanks"];
    this.offset = 0;
}

StugIII.prototype = Object.create( VehicleUnit.prototype );
