package models
import play.api.libs.json._

case class GameMap(id: Long, name: String, tiles: Array[GameTile])
{
  println("GameMap has been constructed "+ this.name);
}

object GameMap {
  
  def all(): List[GameMap] = Nil
  
  def create(label: String) {}
  
  def delete(id: Long) {}

  def save(json: JsValue) : Boolean =
  {
    val map: GameMap = this.fromJson(json);
    true
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