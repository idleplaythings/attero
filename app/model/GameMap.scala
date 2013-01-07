package models

case class GameMap(id: Long, name: String, serializedMapData: String)

object GameMap {
  
  def all(): List[GameMap] = Nil
  
  def create(label: String) {}
  
  def delete(id: Long) {}
  
}