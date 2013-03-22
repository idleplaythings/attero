package models

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

class MapStorage()
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

  def getMapNames(): Map[Int, String] =
  {
    DB.withConnection { implicit c =>
      val mapSql = SQL("SELECT id, name FROM game_map")

      mapSql()
          .map(row =>
          (row[Int]("id"), row[String]("name"))
        ).toMap;
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

  def canSave(map: SubmittedGameMap): Boolean =
  {
    val name = map.name;
    val reserved = DB.withConnection { implicit c =>
      SQL("SELECT count(id) as found FROM game_map WHERE name = {name}")
        .on('name -> map.name).apply().head[Long]("found")
    }

    reserved == 0
  }

  def saveMap(map: SubmittedGameMap) =
  {
    map.setTileIds;
    DB.withTransaction { implicit c =>
      val mapid = SQL(
        """INSERT INTO game_map (name, width, height) VALUES ({name}, {width}, {height})""")
        .on('name -> map.name,
          'width -> map.width,
          'height -> map.height)
        .executeInsert().get

      var i: Int = 0;
      var batchSize: Int = 100;
      while (i < map.tiles.length)
      {
        i += batchSize;

        val tilestring: String = map.tiles.filter( tile => (tile.id >= (i - batchSize) && tile.id < i)).map(_.toSqlValue(mapid)).mkString(",");
        val sql: String =
        """INSERT INTO game_tile (mapid, tileid, texture, toffset, tmask, elevation, element, eoffset, evariance, eangle) VALUES """+"\n" + tilestring;

        SQL(sql).execute()
      }

      println("map id: " + mapid + " inserted");
    }
  }
}