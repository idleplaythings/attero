package controllers

import models._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import collection.mutable.ListBuffer
import util.Random
import play.api.libs.json._
import scala.collection.mutable

object GameManager
{
  def create(json: JsValue): Int =
  {
    val mapid: Long = (json \ "mapid").toString.toLong
    val unitcount: Int = (json \ "unitcount").toString.toInt

    val players: Map[Int, Int] = Map(1 -> 1, 2 -> 2);
    val map: GameMap = MapStorage.loadMap(mapid).get
    val units: List[GameUnit] = createUnits(unitcount, map)

    initializeGameDatabase(players, units, map)
    1
  }

  def createUnits(unitcount: Int, map: GameMap): List[GameUnit] =
  {
    var units: ListBuffer[GameUnit] = new ListBuffer[GameUnit]()

    println("Creating units, map width: " + map.width + " height: " + map.height);
    for (i <- 0 until unitcount)
    {
      val tileid = Random.nextInt(map.tiles.length-1);
      units = units :+ new GameUnit(
        i,
        1,
        Random.nextInt(1)+1,
        1,
        Random.nextInt(100),
        Random.nextInt(100),
        tileid,
        map.getXForTile(tileid),
        map.getYForTile(tileid))
    }

    units.toList
  }

  def initializeGameDatabase(players: Map[Int, Int], units: List[GameUnit], map: GameMap)
  {
    var gameid: Long = 0;
    var dbName: String = ""

    DB.withConnection { implicit c =>
      gameid = SQL("""
        INSERT INTO game (leftplayer, rightplayer)
        VALUES (1,2)""").executeInsert().get

      dbName = "game_"+gameid
      SQL("""CREATE SCHEMA """+dbName)
        .execute()
    }

    DB.withTransaction { implicit c =>
      SQL("""
        CREATE TABLE """ +dbName+ """.game_unit (
          "id" serial,
          "owner" integer DEFAULT NULL,
          "unittype" integer DEFAULT NULL,
          "amount" smallint DEFAULT NULL,
          "hide" smallint DEFAULT NULL,
          "spot" smallint DEFAULT NULL,
          "location" integer DEFAULT 0,
          "x" integer DEFAULT 0,
          "y" integer DEFAULT 0,
          "spotted" boolean DEFAULT FALSE,
          PRIMARY KEY ("id")
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
          PRIMARY KEY ("playerid")
        );
      """).execute();

      SQL("""
        CREATE TABLE """ +dbName+ """.game_tile (
          "tileid" integer DEFAULT NULL,
          "x" integer DEFAULT 0,
          "y" integer DEFAULT 0,
          "texture" smallint DEFAULT NULL,
          "toffset" smallint DEFAULT NULL,
          "tmask" smallint DEFAULT NULL,
          "elevation" smallint DEFAULT NULL,
          "element" smallint DEFAULT NULL,
          "eoffset" smallint DEFAULT NULL,
          "evariance" smallint DEFAULT NULL,
          "eangle" smallint DEFAULT NULL,
          "concealment" smallint DEFAULT NULL,
          "cover" smallint DEFAULT NULL,
          "terrain" smallint DEFAULT NULL,
          "height" smallint DEFAULT 1,
          PRIMARY KEY ("tileid", "x", "y")
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
          'height -> map.height)
        .executeInsert()

      map.setTileIds;
      val sql: String ="""INSERT INTO """ +dbName+ """.game_tile
        (tileid, x, y, texture, toffset, tmask, elevation, element, eoffset, evariance, eangle, concealment, cover, terrain, height) VALUES """+"\n" + map.tiles.map(_.toSqlValueWithDetails(map)).mkString(",");

      SQL(sql).execute()

      for (i <- 0 until units.length)
      {
        val unit: GameUnit = units(i)
        SQL("""INSERT INTO """ +dbName+ """.game_unit (unittype, owner, amount, hide, spot, location, x ,y)
                    VALUES ({unittype}, {owner}, {amount}, {hide}, {spot}, {location}, {x}, {y})""")
          .on(
            'unittype -> unit.unittype,
            'owner -> unit.owner,
            'amount -> unit.amount,
            'hide -> unit.hide,
            'spot -> unit.spot,
            'location -> unit.location,
            'x -> map.getXForTile(unit.location),
            'y -> map.getYForTile(unit.location)
            ).execute()
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
      .as(MapStorage.parserGameTile *)
    }
  }

  def loadUnits(gameid: Long): List[GameUnit] =
  {
    val dbName = "game_"+gameid;

    DB.withConnection { implicit c =>
      SQL("""SELECT
        id,
        unittype,
        owner,
        amount,
        hide,
        spot,
        location,
        x,
        y
      FROM """ +dbName+ """.game_unit
      ORDER BY id ASC""")
      .as(parserGameUnit *)
    }
  }

  def loadUnitsForOwner(gameid: Long, owner: Int): List[GameUnit] =
  {
    val dbName = "game_"+gameid;

    DB.withConnection { implicit c =>
      SQL("""SELECT
        id,
        unittype,
        owner,
        amount,
        hide,
        spot,
        location,
        x,
        y
      FROM """ +dbName+ """.game_unit
      WHERE owner = {owner}
      ORDER BY id ASC""")
      .on('owner -> owner)
      .as(parserGameUnit *)
    }
  }

  private val parserGameUnit = {
    get[Int]("id") ~
    get[Int]("unittype") ~
    get[Int]("owner") ~
    get[Int]("amount") ~
    get[Int]("hide") ~
    get[Int]("spot") ~
    get[Int]("location") ~
    get[Int]("x") ~
    get[Int]("y") map {
      case id~unittype~owner~amount~hide~spot~location~x~y =>
        GameUnit(id, unittype, owner, amount, hide, spot, location, x, y)
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

  def getPlayersForGame(gameid: Long): List[GamePlayer] =
  {
    val dbName = "game_"+gameid;

    DB.withConnection { implicit c =>
       SQL("""SELECT playerid,team FROM """ +dbName+ """.game_player""")
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

















