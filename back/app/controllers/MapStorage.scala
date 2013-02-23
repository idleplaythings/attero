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
        EditorGameMap(id, name, width, height)
    }
  }

  val parserGameTile = {
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

  def loadMap(id: Long) : Option[EditorGameMap] =
  {
    DB.withConnection { implicit c =>
      SQL("""SELECT id, name, width, height
               FROM game_map
              WHERE id = {id}""")
        .on('id -> id)
        .as(parserGameMap.singleOpt)
    }
  }

  def loadTiles(mapid: Long): List[GameTile] =
  {
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
      FROM game_tile
      WHERE mapid = {mapid}
      ORDER BY tileid ASC""")
      .on('mapid -> mapid)
      .as(parserGameTile *)
    }
  }

  def saveMap(map: SubmittedGameMap) =
  {
    map.setTileIds;
    val mapid = DB.withConnection { implicit c =>
      SQL("""INSERT INTO game_map (name, width, height)
                  VALUES ({name}, {width}, {height})""")
        .on('name -> map.name,
          'width -> map.width,
          'height -> map.height)
        .executeInsert().get
    }
    println("map id: " + mapid + " inserted");

    DB.withTransaction { implicit c =>
      val sql: String =
        """INSERT INTO game_tile (mapid, tileid, texture, toffset, tmask, elevation, element, eoffset, evariance, eangle) VALUES """+"\n" + map.tiles.map(_.toSqlValue(mapid)).mkString(",")

      //println(sql);
      SQL(sql).execute()
    }

    1
  }
}