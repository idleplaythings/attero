package models.repositories

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

import models.GamePlayer

class PlayerRepository(gameid: Long) extends Repository(gameid) {
  private lazy val players: List[GamePlayer] = getPlayersForGame(gameid);

  private def getPlayersTeam(userid: Int): Int = {
    this.players.find(_.id == userid).get.team
  }

  def getEnemies(userid: Int): List[Int] = {
    val team = this.getPlayersTeam(userid);
    this.players.filterNot(_.team == team).map(_.id).toList;
  }

  def getPlayersForGame(gameid: Long): List[GamePlayer] = {
    val dbName = "game_" + gameid;

    DB.withConnection {
      implicit c =>
        SQL( """SELECT playerid,team FROM """ + dbName + """.game_player""")
          .as(parserGamePlayer *)
    }
  }

  private val parserGamePlayer =
  {
    get[Int]("playerid") ~
      get[Int]("team") map {
      case playerid~team =>
        GamePlayer(playerid, team)
    }
  }
}