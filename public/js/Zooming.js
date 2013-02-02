
window.Zooming = {

    wheeltimer: null,
    wheelzoom: 0,
    zoominprogress: false,

    mouseWheel: function(e){

        e = e ? e : window.event;
        var wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;

        if ( wheelData < 0)
            Zooming.wheelzoom--;
        else
            Zooming.wheelzoom++;

        if (Zooming.wheeltimer == null && Zooming.zoominprogress == false)
            Zooming.wheeltimer = setTimeout(Zooming.wheelCallback, 100)

        return MouseWheel.cancelEvent(e);
    },

    wheelCallback: function(){

        Zooming.zoominprogress = true;
        var m = Zooming.wheelzoom;
        Zooming.wheelzoom = 0;

        Zooming.wheeltimer = null;

        Zooming.zoom(m);
    },

    zoom: function(zoom){

        zoom *= 0.1;
        Zooming.zoominprogress = false;

        var newzoom = Graphics.zoom + zoom;

        if (newzoom < 0.2)
            newzoom = 0.2;

        if (newzoom > 2)
            newzoom = 2;

        Graphics.zoomCamera(newzoom);
     }
}