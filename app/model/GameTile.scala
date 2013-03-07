package models

import anorm._
import anorm.SqlParser._

case class GameTile(
  texture: Int,
  tOffset: Int,
  tMask: Int,
  elevation: Int,
  element: Int,
  eOffset: Int,
  eVariance: Int,
  eAngle: Int
)
{
  var id:Int = 0

  override def toString: String =
  {
    texture +","+ tOffset +","+ tMask +","+ elevation +","+ element +","+ eOffset +","+ eVariance +","+ eAngle
  }

  def toStringWithDetails: String =
  {
    val details = TileElement.definition(this.element)
    this.toString() + "," + details._1 + "," + details._2 + "," + details._3 + "," + details._4;
  }

  def toSqlValueWithDetails(map: GameMap): String =
  {
    "("+this.id+"," + map.getXForTile(this.id) + ","+ map.getYForTile(this.id) +"," + this.toStringWithDetails + ")"
  }

  def toSqlValue(mapid: Long): String =
  {
    "(" + mapid +","+this.id+","+ this.toString() + ")"
  }
}

object GameTile
{
  def fromString(serialized: String) : GameTile =
  {
    val l: Array[Int] = serialized.split(",").map(_.toInt)
    GameTile(l(0), l(1), l(2),l(3), l(4), l(5), l(6), l(7))
  }

  def serialize(tiles: List[GameTile]): String =
  {
    tiles.map(_.toString).mkString(";")
  }

}