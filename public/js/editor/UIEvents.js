$(function(){
	$('#saveicon').on('click', UIEvents.onSave);
});


window.UIEvents = {
    
    onTileClicked: function(tile, x, y)
    {
        Landscaping.onTileClicked(tile, x, y);
    },
    
    onGameTileClicked: function(tile)
    {
        Landscaping.onTileClicked(tile);
    },
    
    onGridClicked: function(x,y)
    {
        
        console.log("clicked " + x +","+ y);
        var i = Math.floor((y+10)/20)*((TileGrid.tileRowCount*2)+1) + Math.floor((x+10)/20);
        
        TileGrid.gameTiles[i].onClicked();
    },
    
    onSave: function(event)
    {
		confirm.confirm('hi', null);
		console.log('event');
	},
	
	onLoad: function(event)
    {
		confirm.confirm('hi', null);
		console.log('event');
	}
}

