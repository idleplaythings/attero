
var TileElement = function(args, effects)
{
    this.id = args.id;
    this.img = args.img;
    this.underShadow = false;
    this.concealment = args.concealment || 0;
    this.height = args.height || 1;

    this.effects = effects;

    this.imageDataArrays = Array();
};

TileElement.prototype = {

	constructor: TileElement,

    getRowCount: function()
    {
        return this.img.height / 40;
    },

    getColumnCount: function()
    {
        return this.img.width / 40;
    },

    getRandomOffset: function()
    {
        return Math.floor(Math.random()*this.getColumnCount());
    },

    getImageData: function(offset, offsety, angle)
    {
        if (this.imageDataArrays[offset + "x" + offsety + "a" + angle])
        {
            return this.imageDataArrays[offset + "x" + offsety + "a" + angle];
        }
        var finalCanvas = $('<canvas width="40" height="40"></canvas>').get(0);
        var finalContext = finalCanvas.getContext("2d");


        var x = offset*40;
        var y = offsety*40;

        ImageManipulation.drawAndRotate(finalContext, x, y, 40, 40, 40, 40, angle, this.img, false);
        //finalContext.drawImage(this.img, x , y, 40, 40, 0, 0, 40, 40);

        var imageData = finalContext.getImageData(0, 0, 40, 40);

        this.imageDataArrays[offset + "x" + offsety + "a" + angle] = imageData;
        return this.imageDataArrays[offset + "x" + offsety + "a" + angle];

    },

    addToTile: function(tile, offsetx, offsety, landscaping)
    {
        tile.subElement = this.id;
        tile.subElementOffset = offsetx;
        tile.subElementOffset2 = offsety;
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

    addToTileTexture: function(tile, targetData)
    {
        var elementImageData = window.maskContext.createImageData(60,60);
        var added = false;

        for (var i in tile.subTiles){
            var subElement = tile.subTiles[i].subElement;
            if (subElement != this.id)
                continue;

            added = true;

            this.addToTexture(tile, elementImageData, i);
        }

        if (added)
        {
            //console.log(elementImageData);

            //var testcanvas = $('<canvas width="60px" height="60px" style="position:absolute; left:0px; top:0px; z-index:99999999; border:1px solid red; background-color:white">');
            //testcanvas.get(0).getContext("2d").putImageData(elementImageData, 0, 0);
            //testcanvas.appendTo("body");

            for (var i in this.effects)
            {
                this.effects[i].addEffectToImageData(elementImageData);
            }
            //ImageManipulation.addImageDataToTileTexture(targetData, elementImageData);

            ImageManipulation.addImageDataToGridTexture(
                targetData,
                elementImageData,
                -10,
                -10,
                40,
                60,
                true
            );
        }
    },

    addToTexture: function(tile, targetData, segment, targetSize)
    {
        if (!targetSize)
            targetSize = 60;

        var offsetx = tile.subTiles[segment].subElementOffset;
        var offsety = tile.subTiles[segment].subElementOffset2;
        var angle = tile.subTiles[segment].subElementAngle;
        var pos = tile.getTextureSegmentLocation(segment);
        pos.x += (targetSize - 40) / 2;
        pos.y += (targetSize - 40) / 2;

        ImageManipulation.addImageDataToGridTexture(
            targetData,
            this.getImageData(offsetx, offsety, angle),
            pos.x,
            pos.y,
            targetSize,
            40,
            true
        );
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

var RoadTileElement = function(args, effects)
{
    TileElement.call( this, args, effects);
    this.underShadow = true;
    this.straight = 0;
    this.left90 = 2;
    this.left135 = 3;
    this.right135 = 4;
    this.right90 = 1;
    this.many = 5;
};

RoadTileElement.prototype = Object.create( TileElement.prototype );

RoadTileElement.prototype.addToTile = function(tile, offsetx, offsety, landscaping)
{
    //var angle = Math.floor(Math.random()*360);
    tile.subElementAngle = 0;
    tile.subElement = this.id;
    tile.subElementOffset = 0;
    tile.subElementOffset2 = offsety;

    this.updateAdjacentTiles(tile, landscaping);
    this.updateTile(tile, landscaping);
};

RoadTileElement.prototype.updateTile = function(tile, landscaping)
{
    var tiles = tile.getAdjacentGameTilesInArrayClockwise();
    tiles = this.ignoreRoads(tiles);
    var roadcount = 0;

    for (var i in tiles)
    {
        if (tiles[i] != null)
            roadcount++;
    }

    if (roadcount == 0)
    {
    }
    else if (roadcount < 3)
    {
        var details = this.getRoadsMeetType(tiles);
        tile.subElementAngle = details.angle;
        tile.subElementOffset = details.offset;
    }
    else
    {
        //tile.subElementOffset = this.many;
    }

    landscaping.addTileToBeUpdated(tile);
};

RoadTileElement.prototype.getRoadsMeetType = function(tiles)
{
    var first = null;
    var second = null;

    for (var i in tiles)
    {
        if (tiles[i] != null)
        {
            if (first !== null)
            {
                second = i;
                break;
            }

            first = i;
        }
    }


    var offset = 0;

    if (second !== null)
    {
        var diff = second - first;

        if (diff === 4){
            offset = this.straight;
        }else if (diff === 2){
            offset = this.left90;
        }else if (diff === 3){
            offset = this.left135;
        }else if (diff === 5){
            offset = this.right135;
        }else if (diff === 6){
            offset = this.right90;
        }else{
            throw "Illegal roadtype, first: "+first+", second: "
                +second+", diff: "+diff;
        }
    }

    var angle = TileGrid.getAdjacentTilesArrayAngle(first);
    var details =  {offset:offset, angle:angle};

    return details;
};


RoadTileElement.prototype.updateAdjacentTiles = function(tile, landscaping)
{
    var tiles = tile.getAdjacentGameTilesInArray();
    tiles = this.ignoreRoads(tiles);

    for (var i in tiles){
        if (tiles[i] != null)
            this.updateTile(tiles[i], landscaping);
    }

};

RoadTileElement.prototype.ignoreRoads = function(tiles)
{
    if (tiles[1] && tiles[1].subElement == this.id){
        tiles[0] = null;
        tiles[2] = null;
    }

    if (tiles[3] && tiles[3].subElement == this.id){
        tiles[2] = null;
        tiles[4] = null;
    }

    if (tiles[5] && tiles[5].subElement == this.id){
        tiles[4] = null;
        tiles[6] = null;
    }

    if (tiles[7] && tiles[7].subElement == this.id){
        tiles[0] = null;
        tiles[6] = null;
    }

    for (var i in tiles)
    {
        var tile = tiles[i];
        if (!tile)
            continue;

        if (tile.subElement != this.id)
            tiles[i] = null;
    }

    return tiles;
};
