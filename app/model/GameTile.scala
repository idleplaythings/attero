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
  override def toString: String =
  {
    this.texture + ","
    + this.tOffset + ","
    + this.tMask + ","
    + this.elevation + ","
    + this.element + ","
    + this.eOffset + ","
    + this.eVariance + ","
    + this.eAngle + ""
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