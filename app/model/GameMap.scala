package models

import play.api.libs.json._
import anorm._
import anorm.SqlParser._

abstract class GameMap(
  val id: Long,
  val name: String,
  val width: Int,
  val height: Int)
{
  def tiles: List[GameTile];

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
    i % ((this.width*2)+1)
  }

  def getYForTile(i:Int): Int =
  {
    math.floor(i / ((this.height*2)+1)).toInt;
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

  def fromJson(json: JsValue) : SubmittedGameMap =
  {
    val id = -1
    val name: String = (json \ "name").toString.replace("\"", "")
    val width: Int = (json \ "width").toString.toInt
    val height: Int = (json \ "height").toString.toInt

    val gametiles: List[GameTile] =
      (json \ "tiles").toString.replace("\"", "").split(";")
        .map(GameTile.fromString(_))
        .toList

    SubmittedGameMap(id, name, width, height, gametiles);
  }
}

case class EditorGameMap(
  override val id: Long,
  override val name: String,
  override val width: Int,
  override val height: Int)
    extends GameMap(id, name, width, height)
{
  val mapStorage = new MapStorage();
  private lazy val _tiles = mapStorage.loadTiles(this.id);
  def tiles: List[GameTile] = _tiles;
  println("EditorGameMap has been constructed '"+ this.name + "'");

}

case class SubmittedGameMap(
  override val id: Long,
  override val name: String,
  override val width: Int,
  override val height: Int,
  private val _tiles: List[GameTile])
    extends GameMap(id, name, width, height)
{
  def tiles: List[GameTile] = _tiles;
  println("SubmittedGameMap has been constructed '"+ this.name + "'");
}

case class ActiveGameMap(
  override val id: Long,
  override val name: String,
  override val width: Int,
  override val height: Int)
    extends GameMap(id, name, width, height)
{
  val gameManager = new GameManager();
  private lazy val _tiles = gameManager.loadTiles(this.id);
  def tiles: List[GameTile] = _tiles;

  println("ActiveGameMap has been constructed '"+ this.name + "'");

}
