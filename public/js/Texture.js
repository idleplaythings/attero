
var Texture = function(id, img, allowedMasks, concealment )
{
    this.id = id;
    this.allowedMasks = allowedMasks;
    this.concealment = concealment;
    this.img = img;
    this.imageDataArrays = Array();
    this.drawOrder = Array(4,1,3,5,7,0,2,6,8);
    this.maskGroup = 1;
}

Texture.prototype = {

	constructor: Texture,

    getRandomMask: function()
    {
        var l = this.allowedMasks.length;
        return this.allowedMasks[(Math.floor(Math.random()*l))];
    },

    getRandomOffset: function()
    {
        var l = this.img.width / 40;
        return Math.floor(Math.random()*l);
    },

    specialEffects: function (imagedata, tile)
    {
        return;
    },

    getPreview: function(canvas, offsetx, offsety, angle)
    {
        var context = canvas.getContext("2d");
        var width = $(canvas).width();
        var height = $(canvas).height();

        var previewImageData = context.createImageData(100, 100);

        ImageManipulation.addImageDataToGridTexture(
            previewImageData,
            this.getImageData(offsetx, offsety, angle),
            30,
            30,
            width,
            40,
            true
        );

        context.putImageData(previewImageData, 0, 0);
    },

    getImageData: function(offsetx, offsety)
    {
        if (this.imageDataArrays[offsetx +'x'+ offsety])
        {
            return this.imageDataArrays[offsetx +'x'+ offsety];
        }
        var finalCanvas = $('<canvas width="40" height="40"></canvas>').get(0);
        var finalContext = finalCanvas.getContext("2d");


        var x = offsetx*40;
        var y = offsety*40;

        console.log(offsety);

        finalContext.drawImage(this.img, x, y, 40, 40, 0, 0, 40, 40);

        this.imageDataArrays[offsetx +'x'+ offsety] = finalContext.getImageData(0, 0, 40, 40);
        return this.imageDataArrays[offsetx +'x'+ offsety];

    },

    addToTile: function(tile, maskid, offsetx, offsety)
    {
        tile.subTextureMask = maskid;
        tile.subTexture = this.id;
        tile.subTextureOffset = offsetx;
        //tile.subTextureOffsety = offsety;
    },

    addToTileTexture: function(tile, targetData)
    {
        var added = false;
        var textureImageData = window.maskContext.createImageData(40,40);
        for (var s in this.drawOrder)
        {
            if (tile.subTiles[this.drawOrder[s]].subTexture == this.id)
            {
                this.drawTextureSegment(
                    textureImageData,
                    this.drawOrder[s],
                    tile
                );
                added = true;
            }
        }

        if (added)
        {
            this.specialEffects(textureImageData, tile);
            ImageManipulation.addImageDataToTileTexture(
                targetData, textureImageData);
        }
        //window.maskContext.putImageData(textureImageData, 0, 0);
        //$(window.maskContext).appendTo("body");
    },

    drawTextureSegment: function (textureImageData, segment, tile)
    {
        //get location
        var pos = tile.getTextureSegmentLocation(segment);
        var x = pos.x;
        var y = pos.y;

        //create mask
        var context = window.maskContext;
        context.clearRect(0, 0, 40, 40);
        var v = tile.subTiles[segment].subTextureMask*40;
        context.drawImage(window.textureMasks[this.maskGroup], v , 0, 40, 40, x, y, 40, 40);

        var mask = context.getImageData(0, 0, 40, 40);

        //TODO: texture needs offsety too!
        //get texture imagedata
        var texture = this.getImageData(
            tile.subTiles[segment].subTextureOffset,
            0
        );

        ImageManipulation.addMaskedImageDataToTileTexture(textureImageData, mask, texture);
    },

    getSrc: function()
    {
        return this.img.src;
    },

    getId: function()
    {
        return this.id;
    }
};

var BorderTexture = function(id, img, allowedMasks, borderRGB, concealment)
{
    Texture.call( this, id, img, allowedMasks, concealment);
    this.borderRGB = borderRGB;
}

BorderTexture.prototype = Object.create( Texture.prototype );

BorderTexture.prototype.specialEffects = function (imagedata, tile)
{
    var data = imagedata.data;

    var pixels = 6400;

    while (pixels) {
        var r = pixels-4;
        var g = pixels-3;
        var b = pixels-2;
        var a = pixels-1;

        if (data[a] == 0 || data[a] > 250)
        {
            pixels -= 4;
            continue;
        }

        //69, 35, 11
        var m = data[a] / 255;
        data[r] = data[r] * (m) + this.borderRGB[0]*(1-m);
        data[g] = data[g] * (m) + this.borderRGB[1]*(1-m);
        data[b] = data[b] * (m) + this.borderRGB[2]*(1-m);

        pixels -= 4;
    }
    imagedata.data = data;
}


var WaterTexture = function(id, img, allowedMasks, borderRGB)
{
    Texture.call( this, id, img, allowedMasks );
    this.borderRGB = borderRGB;
}

WaterTexture.prototype = Object.create( Texture.prototype );

WaterTexture.prototype.specialEffects = function (imagedata, tile)
{
    var data = imagedata.data;

    var pixels = 6400;

    while (pixels) {
        var r = pixels-4;
        var g = pixels-3;
        var b = pixels-2;
        var a = pixels-1;

        if (data[a] == 0 || data[a] > 250)
        {
            pixels -= 4;
            continue;
        }

        //69, 35, 11
        var m = data[a] / 255;
        data[r] = data[r] * (m) + this.borderRGB[0]*(1-m);
        data[g] = data[g] * (m) + this.borderRGB[1]*(1-m);
        data[b] = data[b] * (m) + this.borderRGB[2]*(1-m);

        pixels -= 4;
    }
    imagedata.data = data;
}

WaterTexture.prototype.addToTileTexture = function(tile, targetData)
{
    var added = false;
    var textureImageData = window.maskContext.createImageData(40,40);
    for (var s in this.drawOrder)
    {
        if (tile.subTiles[this.drawOrder[s]].subTexture == this.id)
        {
            this.drawTextureSegment(
                textureImageData,
                this.drawOrder[s],
                tile
            );
            added = true;
        }
    }

    if (added)
    {
        this.specialEffects(textureImageData, tile);
        ImageManipulation.addImageDataToTileTextureAsTransparent(
            targetData, textureImageData);
    }
}












