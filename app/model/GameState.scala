package models;

import models.repositories._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

class GameState(gameid: Long, playerRepository: PlayerRepository)
{
    private var (turn, currentPlayer) = GameState.getGameState(gameid);

    def getTurn = turn;
    def getCurrentPlayerId = currentPlayer
    var needsUpdate = false;

    def isCurrentPlayer(userid: Int): Boolean = userid == currentPlayer;

    def changeTurn(userid: Int): Unit =
    {
        var i = playerRepository.getAll.indexWhere(_.id == userid) + 1;
        if (i >= playerRepository.getAll.length)
        {
          i = 0;
          turn = turn + 1;
        }

        needsUpdate = true;
        currentPlayer = playerRepository.getAll()(i).id;
    }

    def update(): Unit =
    {
      GameState.updateGameState(gameid, turn, currentPlayer);
      needsUpdate = false;
    }
}

object GameState
{
    def updateGameState(gameid: Long, turn: Int, playerId:Int): Unit =
    {
      DB.withConnection { implicit c =>
          val sql = SQL("""
          UPDATE
            game
          SET
            turn = {turn},
            currentplayer = {playerId}
          WHERE
            id = {gameid}""")
          .on(
            'turn -> turn,
            'playerId -> playerId,
            'gameid -> gameid)
          .executeUpdate;
      }
    }

    def getGameState(gameid: Long): (Int, Int) =
    {
        DB.withConnection { implicit c =>
          SQL("""
            SELECT
              turn, currentplayer
            FROM
              game
            WHERE
              id = {gameid}""")
          .on('gameid -> gameid)
          .as(parserGameState.singleOpt).get
        }
    }

    val parserGameState =
    {
        get[Int]("turn") ~
        get[Int]("currentplayer") map {
          case turn~currentplayer =>
            (turn, currentplayer)
        }
    }
}