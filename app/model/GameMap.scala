package models
import play.api.libs.json._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

case class GameMap(
  id: Long,
  name: String,
  width: Short,
  height: Short,
  tiles: List[GameTile])
{
  println("GameMap has been constructed "+ this.name);
}

object GameMap {

  def all(): List[GameMap] = Nil

  def create(label: String) {}

  def delete(id: Long) {}

  val parserGameMap = {
    get[Long]("id") ~
    get[String]("name") ~
    get[Short]("width") ~
    get[Short]("height") map {
      case id~name~width~height =>
        GameMap(id, name, width, height, GameTile.load(id))
    }
  }

  def load(id: Long) : Option[GameMap] =
  {
    DB.withConnection { implicit c =>
      SQL("""SELECT id, name, width, height
               FROM GameMap
              WHERE id = {id}""")
        .on('id -> id)
        .as(parserGameMap.singleOpt)
    }
  }

  def save(json: JsValue) =
  {
    val map: GameMap = this.fromJson(json);
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

  def fromJson(json: JsValue) : GameMap =
  {
    val id = -1
    val name: String = (json \ "name").toString.replace("\"", "")
    val width: Short = (json \ "width").toString.toShort
    val height: Short = (json \ "height").toString.toShort

  	val gametiles: List[GameTile] =
      (json \ "tiles").toString.replace("\"", "").split(";")
        .map(GameTile.fromString(_))
        .toList

    GameMap(id, name, width, height, gametiles);
  }
}