package controllers

import models._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

object MapStorage
{
  val parserGameMap = {
    get[Long]("id") ~
    get[String]("name") ~
    get[Int]("width") ~
    get[Int]("height") map {
      case id~name~width~height =>
        GameMap(id, name, width, height, loadTiles(id))
    }
  }

  val parserGameTiles = {
    get[Int]("texture") ~
    get[Int]("toffset") ~
    get[Int]("tmask") ~
    get[Int]("elevation") ~
    get[Int]("element") ~
    get[Int]("eoffset") ~
    get[Int]("evariance") ~
    get[Int]("eangle") map {
      case texture~toffset~tmask~elevation~element~eoffset~evariance~eangle =>
        GameTile(texture, toffset, tmask, elevation, element, eoffset, evariance, eangle)
    }
  }

  def loadMap(id: Long) : Option[GameMap] =
  {
    DB.withConnection { implicit c =>
      SQL("""SELECT id, name, width, height
               FROM GameMap
              WHERE id = {id}""")
        .on('id -> id)
        .as(parserGameMap.singleOpt)
    }
  }

  def loadTiles(mapid: Long): List[GameTile] =
  {
    val t1 = System.nanoTime
    DB.withConnection { implicit c =>
      val s = SQL("""SELECT
            texture,
            toffset,
            tmask,
            elevation,
            element,
            eoffset,
            evariance,
            eangle
          FROM GameTile
          WHERE mapid = {mapid}
          ORDER BY tileid ASC""")

      println(System.nanoTime -t1)
      s.on('mapid -> mapid)
      .as(parserGameTiles *)
      }
  }

  def saveMap(map: GameMap) =
  {
    val mapid = DB.withConnection { implicit c =>
      SQL("""INSERT INTO GameMap (name, width, height)
                  VALUES ({name}, {width}, {height})""")
        .on('name -> map.name,
          'width -> map.width,
          'height -> map.height)
        .executeInsert()
    }
    println("map id: " + mapid + " inserted");

      DB.withTransaction { implicit c =>
        for (i <- 0 until map.tiles.length)
        {
          val tile: GameTile = map.tiles(i)
          SQL("""INSERT INTO GameTile (mapid, tileid, texture, toffset, tmask, elevation, element, eoffset, evariance, eangle)
                      VALUES ({mapid}, {tileid}, {texture}, {toffset}, {tmask}, {elevation}, {element}, {eoffset}, {evariance}, {eangle})""")
            .on('mapid -> mapid,
              'tileid -> i,
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
      }

    1
  }
}