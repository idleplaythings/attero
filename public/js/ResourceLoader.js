
window.ResourceLoader = 
{
    numberLoading: 0,
    numberLoaded: 0,
    totalLoading:0,
    tileIndex: null,
    loadables: Array(),
    running: false,
    
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
        
        var overlay = $('<div id="resourceLoaderOverlay" style="widht:'+width+'px;height:'+height+'px;"></div>');
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




