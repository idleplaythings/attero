var TileEffect = function TileEffect()
{

};

TileEffect.prototype.constructor = TileEffect;

TileEffect.prototype.addEffectToImageData = function(imagedata){};

var DropShadowTileEffect = function()
{
    this.offset = {x:4, y:4};
    this.opacity = 0.3;
};

DropShadowTileEffect.prototype = Object.create( TileEffect.prototype );

DropShadowTileEffect.prototype.addEffectToImageData = function(imagedata)
{
    console.log("shadowing");
    var data = imagedata.data;
    var pixels = (imagedata.width * imagedata.height*4) + 4;

    while (pixels > 4) {
        pixels -= 4;
        var a = pixels-1;

        if (data[a] < 100)
            continue;

        var shadowTarget = this.getPixelByOffset(pixels/4, imagedata.width)*4;

        //console.log(pixels);

        if (shadowTarget === null)
            continue;

        var sr = shadowTarget-4;
        var sg = shadowTarget-3;
        var sb = shadowTarget-2;
        var sa = shadowTarget-1;

        //data[sa] = 155;

        if (data[sa] > 100)
            continue;

        var newAlpha = data[sa] * 1+this.opacity*255;
        if (newAlpha > 255)
            mewAlpha = 255;

        if (newAlpha < this.opacity*255)
            newAlpha = this.opacity*255;

        var m = this.opacity;
        data[sr] = data[sr] * m;
        data[sg] = data[sg] * m;
        data[sb] = data[sb] * m;

        data[sa] = newAlpha;
    }

    imagedata.data = data;
};

DropShadowTileEffect.prototype.getPixelByOffset = function(index, size)
{
    var x = index % size;
    var y = Math.floor(index / size);

    x += this.offset.x;
    y += this.offset.y;

    if (x > size)
        return null;

    if (y > size)
        return null;

    return y*size + x;
};














