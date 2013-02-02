
window.Scrolling = {

    Scrollingstarted: 0,
    Scrolling: false,
    lastpos: {x:0, y:0},
    scrollingPos: {x:0, y:0},
    scrollingSpeed: 2,

    mousedown: function(event){

		if (!event || event.which !== 3)
            return;

        event.stopPropagation(event);

        Scrolling.Scrolling = true;
        Scrolling.Scrollingstarted = ((new Date()).getTime())

        var x = event.pageX - this.offsetLeft;
        var y = event.pageY - this.offsetTop;
        Scrolling.lastpos.x = x;
        Scrolling.lastpos.y = y;
    },

    mouseup: function(event){
        Scrolling.Scrolling = false;
    },

    mouseout: function(event){
		Scrolling.Scrolling = false;

        /*
        if (event.clientX <= 0 || event.clientX >= gamedata.gamewidth || event.clientY <= 0 || event.clientY >= gamedata.gameheight){
            Scrolling.Scrolling = false;
        }
        */

    },

    mousemove: function(event){
		event.stopPropagation(event);

        if (Scrolling.Scrolling == false){
            return;
        }

        var x = event.pageX - this.offsetLeft;
        var y = event.pageY - this.offsetTop;

        var dx= x - Scrolling.lastpos.x;
        var dy= y - Scrolling.lastpos.y;

        Scrolling.scroll(dx,dy);

        Scrolling.lastpos.x = x;
        Scrolling.lastpos.y = y;
    },

    getScrollingSpeed: function()
    {
        return Scrolling.scrollingSpeed*(1/Graphics.zoom);
    },

    scroll: function (dx, dy){
        //console.log("dx: " + dx + ", dy: " + dy);
        var speed = Scrolling.getScrollingSpeed();
        Scrolling.scrollingPos.x += dx*speed;
        Scrolling.scrollingPos.y += dy*speed;

        Graphics.moveCamera(Scrolling.scrollingPos);
    },

}