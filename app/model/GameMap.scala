package models
import play.api.libs.json._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

case class GameMap(id: Long, name: String, tiles: Array[GameTile])
{
  println("GameMap has been constructed "+ this.name);
}

object GameMap {

  def all(): List[GameMap] = Nil

  def create(label: String) {}

  def delete(id: Long) {}

  val parserSerialized = {
    get[Long]("id") ~
    get[String]("name") ~
    get[String]("tiles") map {
      case id~name~tiles => GameMap(id, name, tiles.split(";")
        .map(GameTile.fromString(_)))
    }
  }

  def load(id: Long) : Option[GameMap] =
  {
    DB.withConnection { implicit c =>
      SQL("""SELECT id, name, tiles
               FROM GameMap
              WHERE id = {id}""")
        .on('id -> id)
        .as(parserSerialized.singleOpt)
    }
  }

  def save(json: JsValue) =
  {
    val map: GameMap = this.fromJson(json);
    DB.withConnection { implicit c =>
      SQL("""INSERT INTO GameMap name, tiles
                  VALUES ({name}, {tiles})""")
        .on('name -> map.name, 'tiles -> GameTile.serialize(map.tiles))
        .executeUpdate()
    }
  }

  def fromJson(json: JsValue) : GameMap =
  {
  	val id = -1
  	val name: String = (json \ "name").toString

  	val gametiles: Array[GameTile] =
      (json \ "tiles").toString.split(";")
        .map(GameTile.fromString(_))

    GameMap(id, name, gametiles);
  }

}