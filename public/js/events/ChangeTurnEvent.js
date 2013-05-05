var ChangeTurnEvent = function(turn, activePlayerName, activePlayerId, unitVisibility)
{
    Event.call(this, "server", "ChangeTurnEvent");
    this.turn = turn;
    this.activePlayerName = activePlayerName;
    this.activePlayerId = activePlayerId;
    this.unitVisibility = unitVisibility;
};

ChangeTurnEvent.prototype = Object.create( Event.prototype );