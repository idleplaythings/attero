$(function(){
	$('#saveicon').on('click', UIEvents.onSave);
});


window.UIEvents = {

    onGameTileClicked: function(tile, right)
    {
        if (right)
            return;

        Landscaping.onTileClicked(tile);
    },

    onGridClicked: function(x,y, right)
    {
        var tile = TileGrid.gridCordinatesToTile({x:x, y:y});

        if (!tile)
            return;

        console.log('click');
        UIEvents.onGameTileClicked(tile, right);
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

