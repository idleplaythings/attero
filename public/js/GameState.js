var GameState = function GameState(playerId, activePlayerId, activePlayerName,turn)
{
    this.playerId = playerId;
    this.activePlayerId = activePlayerId;
    this.activePlayerName = activePlayerName;
    this.turn = turn;

    this.setTurnText();
};

GameState.prototype.isMyTurn = function()
{
    return this.activePlayerId == this.playerId;
};

GameState.prototype.changeTurn = function(event)
{
    this.activePlayerName = event.activePlayerName;
    this.activePlayerId = event.activePlayerId;
    this.turn = event.turn;

    this.setTurnText();
};

GameState.prototype.setTurnText = function()
{
    $("#turn").html("TURN " + this.turn + ":");
    $("#playername").html(this.activePlayerName);
};