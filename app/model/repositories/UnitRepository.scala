package models.repositories

import models.units._

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import states.MoveState

class UnitRepository(gameid: Long) extends Repository(gameid) {
  lazy val units: Map[Int, GameUnit] = loadUnitsForGame(gameid);

  def getUnit(id: Int): GameUnit = {
    units(id);
  }

  def getUnitsForTeam(team: Int): Map[Int, GameUnit] = {
    units.filter(keyVal => keyVal._2.team == team)
  }

  def getEnemyUnitsForTeam(team: Int): Map[Int, GameUnit] = {
    units.filterNot(keyVal => keyVal._2.team == team)
  }

  def getUnitsForOwner(owner: Int): Map[Int, GameUnit] = {
    units.filterNot(keyVal => keyVal._2.owner == owner)
  }

  def updateUnitStatesIfNeeded(): Unit = {
    units.foreach({
      keyVal =>
        val unit: GameUnit = keyVal._2;
        unit.getMoveState.updateIfNeeded(gameid);
    })
  }

  def loadUnitsForGame(gameid: Long): Map[Int, GameUnit] = {
    val dbName = "game_" + gameid;

    val unitSql = SQL( """
          SELECT
            id, unittype, owner, team
          FROM
            """ + dbName + """.game_unit""")

    loadUnitsWithSql(gameid, unitSql);
  }

  def loadUnitsForOwner(gameid: Long, owner: Int): List[GameUnit] =
  {
    val dbName = "game_"+gameid;

    val unitSql = SQL("""
          SELECT
            id, unittype, owner, team
          FROM
                      """ +dbName+ """.game_unit
          WHERE
            owner = {owner}
        ORDER BY id ASC""")
      .on('owner -> owner)

    loadUnitsWithSql(gameid, unitSql).map( t => t._2).toList;
  }

  def loadUnitsWithSql(gameid: Long, sql: SimpleSql[anorm.Row]): Map[Int, GameUnit] = {
    DB.withConnection {
      implicit c =>
        var units =
          sql()
            .map(row =>
            (row[Int]("id"), UnitDefinition.getUnitObjectByType(row[Int]("id"), row[Int]("owner"), row[Int]("unittype"), row[Int]("team")))
          ).toMap;

        units.foreach {
          case (id: Int, unit: Movable) => unit.setMoveState(loadUnitMoveState(gameid, id));
        }

        units
    }
  }

  def loadUnitMoveState(gameid: Long, unitid: Int): MoveState =
  {
    val dbName = "game_"+gameid;

    DB.withConnection { implicit c =>
      SQL("""SELECT
        unitid,
        x,
        y,
        azimuth,
        turret_azimuth,
        last_mp,
        last_dm,
        current_mp,
        current_dm
      FROM """ +dbName+ """.game_unit_movestate
      WHERE unitid = {unitid}
                        """)
        .on('unitid -> unitid)
        .as(MoveState.parserMoveState.singleOpt).get;
    }
  }
}