package models.repositories;

import controllers.GameManager
import models.units._

class UnitRepository(gameid: Long) extends Repository(gameid)
{
    lazy val units: Map[Int, GameUnit] = GameManager.loadUnitsForGame(gameid);

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