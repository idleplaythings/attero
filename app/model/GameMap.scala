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
    DB.withConnection { implicit c =>
      SQL("""INSERT INTO GameMap name, width, height
                  VALUES ({name}, {width}, {height})""")
        .on('name -> map.name,
          'width -> map.width,
          'height -> map.height)
        .executeUpdate()
    }
  }

  def fromJson(json: JsValue) : GameMap =
  {
    val id = -1
    val name: String = (json \ "name").toString
    val width: Short = (json \ "width").toString.toShort
    val height: Short = (json \ "height").toString.toShort

  	val gametiles: List[GameTile] =
      (json \ "tiles").toString.split(";")
        .map(GameTile.fromString(_))
        .toList

    GameMap(id, name, width, height, gametiles);
  }
}