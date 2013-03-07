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

  def getUnspottedEnemyUnitsForTeam(team: Int): Map[Int, GameUnit] = {
    units.filterNot(keyVal => keyVal._2.team == team || keyVal._2.isSpotted)
  }

  def getUnitsForOwner(owner: Int): Map[Int, GameUnit] = {
    units.filterNot(keyVal => keyVal._2.owner == owner)
  }

  def updateUnitStatesIfNeeded(): Unit = {
    units.foreach({
      keyVal =>
        val unit: GameUnit = keyVal._2;
        unit.updateStateIfNeeded(gameid);
    })
  }

  def loadUnitsForGame(gameid: Long): Map[Int, GameUnit] = {
    println("loading units for game");

    val dbName = "game_" + gameid;

    val unitSql = SQL( """
          SELECT
            id, x, y, unittype, owner, team, spotted
          FROM
            """ + dbName + """.game_unit""")

    loadUnitsWithSql(gameid, unitSql);
  }

  def loadUnitsForOwner(gameid: Long, owner: Int): List[GameUnit] =
  {
    val dbName = "game_"+gameid;

    val unitSql = SQL("""
          SELECT
            id, x, y, unittype, owner, team, spotted
          FROM
              """ +dbName+ """.game_unit
          WHERE
            owner = {owner}
          OR
            spotted = true
        ORDER BY id ASC""")
      .on('owner -> owner)

    loadUnitsWithSql(gameid, unitSql).map( t => t._2).toList;
  }

  def loadUnitsWithSql(gameid: Long, sql: SimpleSql[anorm.Row]): Map[Int, GameUnit] = {
    DB.withConnection {
      implicit c =>
          sql()
            .map(row =>
            (row[Int]("id"),
                UnitDefinition.getUnitObjectByType(
                    gameid,
                    row[Int]("id"),
                    row[Int]("x"),
                    row[Int]("y"),
                    row[Int]("owner"),
                    row[Int]("unittype"),
                    row[Int]("team"),
                    row[Boolean]("spotted")))
          ).toMap;
    }
  }

  def loadUnitMoveState(gameid: Long, unitid: Int): MoveState = {
    val dbName = "game_" + gameid;

    DB.withConnection {
      implicit c =>
        SQL( """SELECT
        unitid,
        azimuth,
        turret_azimuth,
        last_mp,
        last_dm,
        current_mp,
        current_dm
      FROM """ + dbName + """.game_unit_movestate
      WHERE unitid = {unitid}
                          """)
          .on('unitid -> unitid)
          .as(MoveState.parserMoveState.singleOpt).get;
    }
  }
}