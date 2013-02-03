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
        TileGrid.gridCordinatesToTile({x:x, y:y}).onClicked();
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

