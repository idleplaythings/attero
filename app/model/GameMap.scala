package models
import play.api.libs.json._

case class GameMap(id: Long, name: String, serializedMapData: String)

object GameMap {
  
  def all(): List[GameMap] = Nil
  
  def create(label: String) {}
  
  def delete(id: Long) {}

  def fromJson(json: JsValue): Boolean =
  {
  	val id = Nil
  	val name: String = (json \ "name").toString
  	val gametiles: String = (json \ "tiles").toString
  	println(name)
  	true
  }
  
}