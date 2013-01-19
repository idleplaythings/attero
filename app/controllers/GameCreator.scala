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
    DB.withTransaction { implicit c =>
      val gameid = SQL("""
        INSERT INTO Game (leftplayer, rightplayer)
        VALUES (1,2)""").executeInsert().get

      val dbName = "Game_"+gameid
      SQL("""CREATE DATABASE """+dbName)
        .execute()

      SQL("""
        CREATE TABLE """ +dbName+ """.GameUnit (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `owner` int(11) unsigned DEFAULT NULL,
          `unittype` int(11) DEFAULT NULL,
          `amount` tinyint(4) DEFAULT NULL,
          `hide` tinyint(4) DEFAULT NULL,
          `spot` tinyint(4) DEFAULT NULL,
          `location` int(11) DEFAULT 0,
          `x` int(4) DEFAULT 0,
          `y` int(4) DEFAULT 0,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      """).execute()

      SQL("""
        CREATE TABLE """ +dbName+ """.GameTile (
          `tileid` int(11) DEFAULT NULL,
          `x` int(11) DEFAULT 0,
          `y` int(11) DEFAULT 0,
          `texture` tinyint(4) DEFAULT NULL,
          `toffset` tinyint(4) DEFAULT NULL,
          `tmask` tinyint(4) DEFAULT NULL,
          `elevation` tinyint(4) DEFAULT NULL,
          `element` tinyint(4) DEFAULT NULL,
          `eoffset` tinyint(4) DEFAULT NULL,
          `evariance` tinyint(4) DEFAULT NULL,
          `eangle` tinyint(4) DEFAULT NULL,
          `concealment` tinyint(4) DEFAULT NULL,
          `cover` tinyint(4) DEFAULT NULL,
          `terrain` tinyint(4) DEFAULT NULL,
          `hide` tinyint(4) DEFAULT NULL,
          PRIMARY KEY (`tileid`, `x`, `y`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      """).execute()

      for (i <- 0 until map.tiles.length)
      {
        val tile: GameTile = map.tiles(i)
        SQL("""INSERT INTO """ +dbName+ """.GameTile
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
        SQL("""INSERT INTO """ +dbName+ """.GameUnit (owner, unittype, amount, hide, spot, location, x ,y)
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