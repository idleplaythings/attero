package models.repositories;

import models.GamePlayer
import models.GameManager

class PlayerRepository(gameid: Long, gameManager: GameManager) extends Repository(gameid)
{
    private lazy val players: List[GamePlayer] = gameManager.getPlayersForGame(gameid);

    private def getPlayersTeam(userid: Int): Int =
    {
        this.players.find(_.id == userid).get.team
    }

    def getEnemies(userid: Int): List[Int] =
    {
        println("get enemies, my id: "+userid+" players: " + players);
        val team = this.getPlayersTeam(userid);
        this.players.filterNot(_.team == team).map(_.id).toList;
    }
}