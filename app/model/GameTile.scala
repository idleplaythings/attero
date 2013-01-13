package models

case class GameTile(
  texture: Short,
  tOffset: Short,
  tMask: Short,
  elevation: Short,
  element: Short,
  eOffset: Short,
  eVariance: Short,
  eAngle: Short
)

object GameTile
{
  def fromString(serialized: String) : GameTile =
  {
    val l: Array[Short] = serialized.split(",").map(_.toShort)
    GameTile(l(0), l(1), l(2),l(3), l(4), l(5), l(6), l(7))
  }
}