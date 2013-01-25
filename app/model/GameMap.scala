package models

import play.api.libs.json._
import anorm._
import anorm.SqlParser._

case class GameMap(
  id: Long,
  name: String,
  width: Int,
  height: Int,
  tiles: List[GameTile])
{
  println("GameMap has been constructed '"+ this.name + "'");

  def setTileIds =
  {
    for (i <- this.tiles.indices)
    {
      this.tiles(i).id = i;
    }

    println("Tileids set");
  }

  def getXForTile(i:Int): Int =
  {
    (i+1) % ((this.width*2)+1)
  }

  def getYForTile(i:Int): Int =
  {
    math.floor(i / this.width).toInt;
  }

  def toJSON(): JsObject =
  {
    JsObject(
      Seq(
        "width" -> JsNumber(this.width),
        "height" -> JsNumber(this.height),
        "tiles" -> JsString(GameTile.serialize(this.tiles))
      )
    )
  }
}

object GameMap {

  def fromJson(json: JsValue) : GameMap =
  {
    val id = -1
    val name: String = (json \ "name").toString.replace("\"", "")
    val width: Int = (json \ "width").toString.toInt
    val height: Int = (json \ "height").toString.toInt

  	val gametiles: List[GameTile] =
      (json \ "tiles").toString.replace("\"", "").split(";")
        .map(GameTile.fromString(_))
        .toList

    GameMap(id, name, width, height, gametiles);
  }
}