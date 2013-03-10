var UnitIcon = function(unit, textureImg)
{
    this.unit = unit;
    this.textureImg = textureImg;

    this.unitSprite = null;
    this.turretSprite = null;
    this.underSprite = null;
    this.overSprite = null;

    this.group = null;
}

UnitIcon.prototype.setAzimuth = function(azimuth)
{
    this.unitSprite.rotation  = MathLib.degreeToRadian(MathLib.addToAzimuth(360, -azimuth));
}

UnitIcon.prototype.show = function()
{
    this.unitSprite.visible = true;
    this.underSprite.visible = true;
}

UnitIcon.prototype.hide = function()
{
    this.unitSprite.visible = false;
    this.underSprite.visible = false;
}

UnitIcon.prototype.mouseover = function()
{
    this.oldOpacity = this.underSprite.material.opacity;
    this.underSprite.material.opacity = 0.6;
}

UnitIcon.prototype.mouseout = function()
{
    this.underSprite.material.opacity = this.oldOpacity;
}

UnitIcon.prototype.select = function()
{
    this.oldcolor = this.underSprite.material.color.getHSL();
    console.log(this.oldcolor);

    this.underSprite.material.opacity = 0.6;
    this.oldOpacity = 0.6;
    this.underSprite.material.color.setHSL( 0, 1, 100 );
}

UnitIcon.prototype.deselect = function()
{
    this.underSprite.material.color.setHSL(this.oldcolor.h, this.oldcolor.s, this.oldcolor.l);
    this.underSprite.material.opacity = 0.3;
    this.oldOpacity = 0.3;
}

UnitIcon.prototype.createIcon = function()
{
    this.group = new THREE.Object3D();
    this.createSprites();

    this.group.add(this.underSprite);
    this.group.add(this.unitSprite);
}

UnitIcon.prototype.setIconScale = function(scale)
{
    this.unitSprite.scale.set( scale, scale, 1 );
    this.underSprite.scale.set( scale, scale, 1 );
}

UnitIcon.prototype.createSprites = function()
{
    console.log("creating sprites");
    this.underSprite = this.createUnderSprite();
    this.unitSprite = this.createUnitSprite();
}

UnitIcon.prototype.createUnitTexture = function(){}

UnitIcon.prototype.createUnitSprite = function()
{
    var texture = this.createUnitTexture();

    var material =
        new THREE.SpriteMaterial({
            map: texture,
            useScreenCoordinates: false,
            color: 0xffffff,
            fog: false,
            affectedByDistance: true
        } );

    var sprite = new THREE.Sprite(material);
    sprite.visible = false;
    sprite.position = new THREE.Vector3(0, 0, 1);

    return sprite;
}

UnitIcon.prototype.setFriendly = function()
{
    this.underSprite.material.color.setHSL( 0.58, 1, 0.65 );
    this.underSprite.material.uvOffset.set( 1/6, 0 );
}

UnitIcon.prototype.setEnemy = function()
{
    this.underSprite.material.color.setHSL( 1, 0.87, 0.33 );
}

UnitIcon.prototype.createUnderSprite = function()
{
    var texture = THREE.ImageUtils.loadTexture( "/assets/textures/unitunder.png" );
    texture.magFilter = THREE.LinearFilter; //THREE.NearestFilter;
    texture.minFilter = THREE.LinearFilter; //THREE.NearestMipMapNearestFilter;

    var material =
        new THREE.SpriteMaterial({
            map: texture,
            useScreenCoordinates: false,
            opacity: 0.3
        } );

    material.uvScale.set( 1/6, 1 );

    //this.underIconMaterial.uvOffset.set( -0.5, 0 );
    var sprite = new THREE.Sprite(material);
    sprite.visible = false;
    sprite.position = new THREE.Vector3(0, 0, 0);

    return sprite;
};






var VehicleUnitIcon = function(unit, textureImg, offset)
{
    UnitIcon.call(this, unit, textureImg);
    this.offset = offset;
};

VehicleUnitIcon.prototype = Object.create( UnitIcon.prototype );

VehicleUnitIcon.prototype.createUnitTexture = function()
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
    var texturedata = {
        data : new Uint8Array(
            finalContext.getImageData(0,0,size, size).data.buffer),
        height: size,
        width: size
    };

    var tex = new THREE.DataTexture(null, size, size);
    //tex.premultiplyAlpha = true;
    tex.image = texturedata;
    tex.magFilter = THREE.LinearFilter; //THREE.NearestFilter;
    tex.minFilter = THREE.LinearFilter; //THREE.NearestMipMapNearestFilter;
    tex.needsUpdate = true;

    return tex;
}






var InfantryUnitIcon = function(unit, textureImg, membertypes)
{
    UnitIcon.call(this, unit, textureImg);

    this.membertypes = args.membertypes;
};

InfantryUnitIcon.prototype = Object.create( UnitIcon.prototype );

InfantryUnitIcon.prototype.createUnitTexture = function()
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
    var texturedata = {
        data : new Uint8Array(
            finalContext.getImageData(0,0,size, size).data.buffer),
        height: size,
        width: size
    };

    var tex = new THREE.DataTexture(null, size, size);
    tex.magFilter = THREE.LinearFilter; //THREE.NearestFilter;
    tex.minFilter = THREE.LinearFilter; //THREE.NearestMipMapNearestFilter;
    tex.image = texturedata;
    tex.needsUpdate = true;

    return tex;
}

InfantryUnitIcon.prototype.getTextureOffsetForMember = function(memberType)
{
    return memberType*40;
};

InfantryUnitIcon.prototype.getMemberPosition = function(index)
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