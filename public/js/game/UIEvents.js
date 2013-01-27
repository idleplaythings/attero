$(function(){
    $('#saveicon').on('click', UIEvents.onSave);
});


window.UIEvents = {

    onGameTileClicked: function(tile)
    {
    },

    onGridClicked: function(x,y)
    {

        console.log("clicked " + x +","+ y);
        var tileSize = 20*Graphics.zoom;
        var i = Math.floor((y+10)/tileSize)*((TileGrid.tileRowCount*2)+1) + Math.floor((x+10)/tileSize);

        TileGrid.gameTiles[i].onClicked();
    }
}

