jQuery(function(){

    window.availableTileElements =
    {
        //1-20 trees
        1:  new TileElement(1, ResourceLoader.loadImage("/assets/textures/firtreessmall.png"),20, 2),
        2:  new TileElement(2, ResourceLoader.loadImage("/assets/textures/firtreesmany.png"),20, 3),
        4:  new TileElement(4, ResourceLoader.loadImage("/assets/textures/bushesmany.png"),10),
        //21-30 small houses
        21:  new TileElement(21, ResourceLoader.loadImage("/assets/textures/cottage1.png"),150),
        //31-40 large houses
        31:  new TileElement(31, ResourceLoader.loadImage("/assets/textures/houses.png"),300, 2),
        //41-50 roads
        41:  new RoadTileElement(41, ResourceLoader.loadImage("/assets/textures/road1.png")),
        42:  new RoadTileElement(42, ResourceLoader.loadImage("/assets/textures/road2.png")),
        //43:  new RoadTileElement(43, ResourceLoader.loadImage("/assets/textures/sunkenroad.png")),
        //51-60 fences
        51:  new RoadTileElement(51, ResourceLoader.loadImage("/assets/textures/rockwalls.png"), 50),
        52:  new RoadTileElement(52, ResourceLoader.loadImage("/assets/textures/rockwalls2.png"), 100),

    };

    window.textureMasks =
    {
        1:  ResourceLoader.loadImage("/assets/textures/texturemask.png"),
        2:  ResourceLoader.loadImage("/assets/textures/shadowBrushes.png")
    }
    window.availableTextures =
    {
        //1-20 grasses
        1:  new Texture(1, ResourceLoader.loadImage("/assets/textures/grass1.png"), Array(1,2,3,4,5,6,7,8,9)),
        5:  new BorderTexture(5, ResourceLoader.loadImage("/assets/textures/grass2.png"), Array(10,11,12), Array(69, 35, 11)),
        2:  new Texture(2, ResourceLoader.loadImage("/assets/textures/grass3.png"), Array(5,6,7,8,9,10,11,12)),
        //21-30 rocks
        21:  new BorderTexture(21, ResourceLoader.loadImage("/assets/textures/rocks1.png"), Array(9,10,11,12), Array(69, 35, 11)),
        //31-40 dirts
        31:  new BorderTexture(31, ResourceLoader.loadImage("/assets/textures/dirt1.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11)),
        //41-50 fields
        41:  new BorderTexture(41, ResourceLoader.loadImage("/assets/textures/field.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11), 5),
        42:  new BorderTexture(42, ResourceLoader.loadImage("/assets/textures/field2.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11), 5),
        43:  new BorderTexture(43, ResourceLoader.loadImage("/assets/textures/field3.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11), 0),
        44:  new BorderTexture(44, ResourceLoader.loadImage("/assets/textures/field4.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11), 5),
        //51-60
        //51:  new WaterTexture(51, ResourceLoader.loadImage("/assets/textures/water.png"), Array(1,2,3,4,5,6,7,8,9), Array(69, 35, 11))

    };

    window.unitTilesets =
    {
        "ge_tanks": ResourceLoader.loadImage("/assets/units/stug_III.png"),
        "ge_infantry": ResourceLoader.loadImage("/assets/units/ge_infantry.png")
    }

    ResourceLoader.run(staticResourcesLoaded);


});

window.ResourceLoader =
{
    numberLoading: 0,
    numberLoaded: 0,
    totalLoading:0,
    tileIndex: null,
    loadables: Array(),
    running: false,

    loadTiles: function(callback)
    {
        TileGrid.initTiles();

        ResourceLoader.addLoadable(new LoadTiles(window.tiles));
        ResourceLoader.addLoadable(new LoadTileGrid());

        ResourceLoader.run(callback);
    },

    createOverlay: function(loadable)
    {
        if ($("#resourceLoaderOverlay").length > 0)
        {
            ResourceLoader.updateOverlay(loadable);
            return;
        }

        var height = window.innerHeight;
        var width = window.innerWidth;

        var what = loadable.what;

        var overlay = $('<div id="resourceLoaderOverlay" style="width:'+width+'px;height:'+height+'px;"></div>');
        var header = $('<div class="container" style="margin-top:'+height*0.4+'px"> <div class="centeredtext" ><h2 class="what">LOADING: ' + what+'</h2></div>'
            +'<div class="loadingbar"><div class="bar"></div></div></div>');

        $(overlay).append(header);

        $(overlay).appendTo("body");
    },

    updateOverlay: function(loadable)
    {
        if (loadable)
        {
            $("#resourceLoaderOverlay .what").html("LOADING: " + loadable.what);
        }
        var p = (ResourceLoader.numberLoaded / ResourceLoader.totalLoading)*100;
        $("#resourceLoaderOverlay .bar").css("width", p+"%");
    },

    run: function(callback)
    {
        ResourceLoader.callback = callback;
        ResourceLoader.startBatch(true);
    },

    startBatch: function(start)
    {
        ResourceLoader.running = true;

        if (start && ResourceLoader.isDone() != true)
            return;

        for (var i in ResourceLoader.loadables)
        {
            var loadable = ResourceLoader.loadables[i];
            if (loadable.done)
                continue;

            if (start)
            {
                ResourceLoader.numberLoaded = 0;
                ResourceLoader.numberLoading = loadable.members.length;
                ResourceLoader.totalLoading  = loadable.members.length;
            }
            loadable.load();
            return;
        }

        ResourceLoader.loadingDone();
    },

    isDone: function()
    {
        return (ResourceLoader.numberLoading == 0);
    },

    loadingDone: function()
    {
        //$("#resourceLoaderOverlay .what").html("LOADING DONE");
        $("#resourceLoaderOverlay .total").hide();
        $("#resourceLoaderOverlay .done").hide();
        $("#resourceLoaderOverlay .bar").css("width", "100%");

        ResourceLoader.numberLoaded = 0;
        ResourceLoader.numberLoading = 0;

        if (ResourceLoader.callback && typeof(ResourceLoader.callback) == "function")
        {
            var c = ResourceLoader.callback;
            ResourceLoader.callback = null;
            c();
        }
    },

    onResourceLoaded: function( event )
    {
        ResourceLoader.numberLoaded++;
        ResourceLoader.numberLoading--;

        if (ResourceLoader.isDone() == true)
        {
            ResourceLoader.startBatch(true);
        }
    },

    loadImage: function( source )
    {
        var img = new Image();
        img.src = source;
        $(img).on("load", ResourceLoader.onResourceLoaded);
        ResourceLoader.numberLoading++;
        return img;
    },

    remove: function()
    {
        $("#resourceLoaderOverlay").fadeOut(2000, function(){$(this).remove();});
    },

    addLoadable: function( loadable )
    {
        ResourceLoader.loadables.push(loadable);

        if (ResourceLoader.running == true && ResourceLoader.isDone() == true)
        {
            ResourceLoader.startBatch(true);
        }
    }

};




