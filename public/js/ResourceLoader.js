jQuery(function(){

    window.availableTileElements =
    {
        1:  new TileElement(1, ResourceLoader.loadImage("/assets/textures/firtreesmany4.png")),
        2:  new TileElement(2, ResourceLoader.loadImage("/assets/textures/cottage1.png")),
        3:  new TileElement(3, ResourceLoader.loadImage("/assets/textures/houses.png")),
        4:  new RoadTileElement(4, ResourceLoader.loadImage("/assets/textures/road1.png")),
        5:  new RoadTileElement(5, ResourceLoader.loadImage("/assets/textures/road2.png")),
    };

    window.textureMasks =
    {
        1:  ResourceLoader.loadImage("/assets/textures/texturemask.png"),
        2:  ResourceLoader.loadImage("/assets/textures/shadowBrushes.png")
    }
    window.availableTextures =
    {
        1:  new Texture(1, ResourceLoader.loadImage("/assets/textures/grass1.png"), Array(1,2,3,4,5,6,7,8,9)),
        5:  new BorderTexture(5, ResourceLoader.loadImage("/assets/textures/grass2.png"), Array(10,11,12), Array(69, 35, 11)),
        2:  new Texture(2, ResourceLoader.loadImage("/assets/textures/grass3.png"), Array(5,6,7,8,9,10,11,12)),
        3:  new BorderTexture(3, ResourceLoader.loadImage("/assets/textures/rocks1.png"), Array(9,10,11,12), Array(69, 35, 11)),
        4:  new BorderTexture(4, ResourceLoader.loadImage("/assets/textures/dirt1.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11)),
        7:  new BorderTexture(7, ResourceLoader.loadImage("/assets/textures/field.png"), Array(5,6,7,8,9,10,11,12), Array(69, 35, 11)),
        6:  new WaterTexture(6, ResourceLoader.loadImage("/assets/textures/water.png"), Array(1,2,3,4,5,6,7,8,9), Array(69, 35, 11))

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

        console.log("loading tiles");
        console.dir(window.tiles);
        console.dir(TileGrid.gameTiles);

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
        var header = $('<div class="container" style="margin-top:'+height*0.4+'px"> <div class="centeredtext" ><span class="what">LOADING: ' + what+'</span></div>'
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

        if (ResourceLoader.callback && typeof(ResourceLoader.callback) == "function")
        {
            var c = ResourceLoader.callback;
            ResourceLoader.callback = null;
            ResourceLoader.numberLoaded = 0;
            ResourceLoader.numberLoading = 0;
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

}




