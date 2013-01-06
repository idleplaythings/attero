
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
        
        //console.log(x + "," + y);
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
    
    scroll: function (dx, dy){
        Scrolling.scrollingPos.x += dx*Scrolling.scrollingSpeed;
        Scrolling.scrollingPos.y += dy*Scrolling.scrollingSpeed;
        
        Graphics.moveCamera(Scrolling.scrollingPos);
    },
    
}