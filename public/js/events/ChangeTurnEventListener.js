var ChangeTurnEventListener = function ChangeTurnEventListener(gameState, dispatcher)
{
    EventListener.call(this, "ChangeTurnEvent");
    this.gameState = gameState;
    this.dispatcher = dispatcher;
};

ChangeTurnEventListener.prototype = Object.create( EventListener.prototype );

ChangeTurnEventListener.prototype.handle = function(event)
{
    console.log(event.name);
    if (event.name == "ChangeTurnEvent" && event.origin == "player")
    {
        if (gameState.isMyTurn())
        {
            ServerConnection.sendMessage({
                type: "ChangeTurn",
                id: event.id
            });
        }
    }
    else if (event.name == "ChangeTurnEvent" && event.origin == "server")
    {
        console.log(event);
        this.gameState.changeTurn(event);

        event.unitVisibility.forEach( function(id)
        {
            this.dispatcher.dispatch(new EnemyDisappearEvent("server", window.units[id]));
        });
    }
};