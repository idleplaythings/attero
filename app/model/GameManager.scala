package models

import models._
import models.units._
import models.units.states.MoveState

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import collection.mutable.ListBuffer
import util.Random
import play.api.libs.json._
import scala.collection.mutable

class GameManager()
{
  val mapStorage = new MapStorage()

  def create(json: JsValue): Int =
  {
    val mapid: Long = (json \ "mapid").toString.toLong
    val unitcount: Int = (json \ "unitcount").toString.toInt

    val players: Map[Int, Int] = Map(1 -> 1, 2 -> 2);
    val map: GameMap = mapStorage.loadMap(mapid).get
    val units: List[GameUnit] = createUnits(unitcount, map)

    initializeGameDatabase(players, units, map)
    1
  }

  def createUnits(unitcount: Int, map: GameMap): List[GameUnit] =
  {
    var units: ListBuffer[GameUnit] = new ListBuffer[GameUnit]()
    var count1 = 0;
    var count2 = 0;

    println("Creating units, map width: " + map.width + " height: " + map.height);
    for (i <- 0 until unitcount)
    {
      val tileid = Random.nextInt(map.tiles.length-1);
      val unittype = Random.nextInt(2)+1;
      val owner = Random.nextInt(2)+1;

      if (owner == 1)
        count1 += 1;
      else
        count2 += 1;

      var x = 0;
      var y = count1;

      if (owner == 2)
      {
        x = map.width-1;
        y = count2;
      }

      val gameUnit = UnitDefinition.getUnitObjectByType(0, i, x, y, owner, unittype, owner, false);
      gameUnit.setMoveState(new MoveState(0, 0, 0, 0.0, 0.0, 0.0, 0.0))
      units = units :+ gameUnit;
    }

    units.toList
  }

  def initializeGameDatabase(players: Map[Int, Int], units: List[GameUnit], map: GameMap)
  {
    var gameid: Long = 0;
    var dbName: String = ""

    DB.withConnection { implicit c =>
      gameid = SQL("""
        INSERT INTO game (leftplayer, rightplayer, turn, currentplayer)
        VALUES (1,2,1,1)""").executeInsert().get

      dbName = "game_"+gameid
      SQL("""CREATE SCHEMA """+dbName)
        .execute()
    }

    DB.withTransaction { implicit c =>
      SQL("""
        CREATE TABLE """ +dbName+ """.game_unit (
          "id" integer,
          "unittype" integer,
          "x" integer DEFAULT NULL,
          "y" integer DEFAULT NULL,
          "owner" integer DEFAULT NULL,
          "team" integer,
          "spotted" bool,
          PRIMARY KEY ("id")
        )
      """).execute();

      SQL("""
        CREATE TABLE """ +dbName+ """.game_unit_movestate (
          "unitid" integer,
          "azimuth" integer,
          "turret_azimuth" integer,
          "last_mp" float8,
          "last_dm" float8,
          "current_mp" float8,
          "current_dm" float8,
          PRIMARY KEY ("unitid")
        )
      """).execute();

      SQL("""
        CREATE TABLE """ +dbName+ """.game_map (
          "gameid" integer,
          "name" varchar(256) DEFAULT '',
          "width" smallint DEFAULT NULL,
          "height" smallint DEFAULT NULL,
          PRIMARY KEY ("gameid")
        );
      """).execute();

      SQL("""
        CREATE TABLE """ +dbName+ """.game_player (
          "playerid" integer,
          "team" smallint,
          "lastEventId" integer,
          PRIMARY KEY ("playerid")
        );
      """).execute();

      SQL("""
        CREATE TABLE """ +dbName+ """.game_tile (
          "tileid" integer DEFAULT NULL,
          "texture" smallint DEFAULT NULL,
          "toffset" smallint DEFAULT NULL,
          "tmask" smallint DEFAULT NULL,
          "elevation" smallint DEFAULT NULL,
          "element" smallint DEFAULT NULL,
          "eoffset" smallint DEFAULT NULL,
          "evariance" smallint DEFAULT NULL,
          "eangle" smallint DEFAULT NULL,
          PRIMARY KEY ("tileid")
        )
      """).execute();

      players.foreach {
        case(team: Int, playerid: Int) => {
          SQL("""INSERT INTO """ +dbName+ """.game_player (playerid, team) VALUES ({playerid}, {team})""")
          .on(
            'playerid -> playerid,
            'team -> team)
          .execute()
        }
      }

       SQL("""INSERT INTO """ +dbName+ """.game_map (gameid, name, width, height)
                  VALUES ({gameid}, {name}, {width}, {height})""")
        .on(
          'gameid -> gameid,
          'name -> map.name,
          'width -> map.width,
          'height -> map.height
        )
        .executeInsert()

      map.setTileIds;

      var i: Int = 0;
      var batchSize: Int = 100;
      while (i < map.tiles.length)
      {
        i += batchSize;

        val tilestring: String = map.tiles.filter( tile => (tile.id >= (i - batchSize) && tile.id < i)).map(_.toGameSqlValue()).mkString(",");
        val sql: String =
        """INSERT INTO """ +dbName+ """.game_tile (tileid, texture, toffset, tmask, elevation, element, eoffset, evariance, eangle) VALUES """+"\n" + tilestring;

        SQL(sql).execute()
      }

      for (i <- 0 until units.length)
      {
        val unit: GameUnit = units(i)
        val (x, y) = unit.getPosition

        SQL("""INSERT INTO """ +dbName+ """.game_unit (id, unittype, x, y, owner, team, spotted)
                    VALUES ({id}, {unittype}, {x}, {y}, {owner}, {team}, false)""")
          .on(
            'id -> i,
            'unittype -> unit.unitType,
            'x -> x,
            'y -> y,
            'owner -> unit.owner,
            'team -> unit.team
            ).execute()

        val moveState = unit.getMoveState;

        SQL("""INSERT INTO """+dbName+ """.game_unit_movestate
          (unitid, azimuth, turret_azimuth, last_mp, last_dm, current_mp, current_dm)
          VALUES ({unitid}, {azimuth}, {turret_azimuth}, {lastMP}, {lastDM}, {currentMP}, {currentDM})""")
          .on(
            'unitid -> i,
            'azimuth -> 0,
            'turret_azimuth -> 0,
            'lastMP -> moveState.getLastMovePointsUsed,
            'lastDM -> moveState.getLastDistanceMoved,
            'currentMP -> moveState.getCurrentMovePointsUsed,
            'currentDM -> moveState.getCurrentDistanceMoved
            ).execute();
      }


      println("Game created, id: " + gameid);
    }
  }

  def loadMap(gameid: Long) : Option[GameMap] =
  {
    val dbName = "game_"+gameid;

    DB.withConnection { implicit c =>
      SQL("""SELECT gameid, name, width, height
               FROM """ +dbName+ """.game_map""")
        .as(parserActiveGameMap.singleOpt)
    }
  }

  def loadTiles(gameid: Long): List[GameTile] =
  {
    val dbName = "game_"+gameid;

    DB.withConnection { implicit c =>
      SQL("""SELECT
        texture,
        toffset,
        tmask,
        elevation,
        element,
        eoffset,
        evariance,
        eangle
      FROM """ +dbName+ """.game_tile
      ORDER BY tileid ASC""")
      .as(mapStorage.parserGameTile *)
    }
  }

  private val parserActiveGameMap = {
    get[Long]("gameid") ~
    get[String]("name") ~
    get[Int]("width") ~
    get[Int]("height") map {
      case gameid~name~width~height =>
        ActiveGameMap(gameid, name, width, height)
    }
  }
}

















