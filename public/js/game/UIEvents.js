$(function(){
    $('#saveicon').on('click', UIEvents.onSave);
});


window.UIEvents = {

    onGameTileClicked: function(tile)
    {
    },

    onGridClicked: function(x,y)
    {
        TileGrid.gridCordinatesToTile({x:x, y:y}).onClicked();
    }
}

