package controllers

import models._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import collection.mutable.ListBuffer
import util.Random
import play.api.libs.json._

object GameCreator
{
  def create(json: JsValue): Int =
  {
    val mapid: Long = (json \ "mapid").toString.toLong
    val unitcount: Int = (json \ "unitcount").toString.toInt

    val map: GameMap = MapStorage.loadMap(mapid).get
    val units: List[GameUnit] = createUnits(unitcount, map)

    initializeGameDatabase(units, map)
    1
  }

  def createUnits(unitcount: Int, map: GameMap): List[GameUnit] =
  {
    var units: ListBuffer[GameUnit] = new ListBuffer[GameUnit]()

    for (i <- 0 until unitcount)
    {
      val tileid = Random.nextInt(map.tiles.length-1);
      units = units :+ new GameUnit(
        i,
        Random.nextInt(1)+1,
        1,
        Random.nextInt(100),
        Random.nextInt(100),
        tileid,
        map.getXForTile(tileid),
        map.getXForTile(tileid))
    }

    units.toList
  }

  def initializeGameDatabase(units: List[GameUnit], map: GameMap)
  {
    var dbName: String = ""

    DB.withConnection { implicit c =>
      val gameid = SQL("""
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
          PRIMARY KEY ("id")
        )
      """).execute()

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
          "hide" smallint DEFAULT NULL,
          PRIMARY KEY ("tileid", "x", "y")
        )
      """).execute()

      for (i <- 0 until map.tiles.length)
      {
        val tile: GameTile = map.tiles(i)
        SQL("""INSERT INTO """ +dbName+ """.game_tile
          (tileid, x, y, texture, toffset, tmask, elevation, element, eoffset, evariance, eangle, concealment, cover, terrain, hide)
          VALUES ({tileid}, {x}, {y}, {texture}, {toffset}, {tmask}, {elevation}, {element}, {eoffset}, {evariance}, {eangle}, 0, 0, 0, 0)""")
          .on(
            'tileid -> i,
            'x -> map.getXForTile(i),
            'y -> map.getYForTile(i),
            'texture -> tile.texture,
            'toffset -> tile.tOffset,
            'tmask -> tile.tMask,
            'elevation -> tile.elevation,
            'element -> tile.element,
            'eoffset -> tile.eOffset,
            'evariance -> tile.eVariance,
            'eangle -> tile.eAngle)
          .execute()
      }

      for (i <- 0 until units.length)
      {
        val unit: GameUnit = units(i)
        SQL("""INSERT INTO """ +dbName+ """.game_unit (owner, unittype, amount, hide, spot, location, x ,y)
                    VALUES ({owner}, {unittype}, {amount}, {hide}, {spot}, {location}, {x}, {y})""")
          .on(
            'owner -> unit.owner,
            'unittype -> 1,
            'amount -> unit.amount,
            'hide -> unit.hide,
            'spot -> unit.spot,
            'location -> unit.location,
            'x -> map.getXForTile(unit.location),
            'y -> map.getYForTile(unit.location)
            ).execute()
      }

    }
  }
}