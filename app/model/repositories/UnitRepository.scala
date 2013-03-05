package models.repositories;

import models.units._
import models.GameManager

class UnitRepository(gameid: Long, gameManager: GameManager) extends Repository(gameid)
{
    lazy val units: Map[Int, GameUnit] = gameManager.loadUnitsForGame(gameid);

    def getUnit(id: Int): GameUnit =
    {
        units(id);
    }

    def getUnitsForTeam(team: Int): Map[Int, GameUnit] =
    {
        units.filter( keyVal => keyVal._2.team == team)
    }

    def getEnemyUnitsForTeam(team: Int): Map[Int, GameUnit] =
    {
        units.filterNot( keyVal => keyVal._2.team == team)
    }

    def getUnitsForOwner(owner: Int): Map[Int, GameUnit] =
    {
        units.filterNot( keyVal => keyVal._2.owner == owner)
    }

    def updateUnitStatesIfNeeded(): Unit =
    {
        units.foreach({keyVal =>
            val unit:GameUnit = keyVal._2;
            unit.getMoveState.updateIfNeeded(gameid);
        })
    }
}