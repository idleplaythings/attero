package models

case class GameUnit(
  id: Int,
  unittype: Int,
  owner: Int,
  amount: Int,
  hide: Int,
  spot: Int,
  location: Int,
  x: Int,
  y: Int
)
{
  println("GameUnit created, position: loc("+location+")("+x+","+y+")");

  override def toString: String =
  {
    id +","+ unittype +","+ owner +","+ amount +","+ hide +","+ spot +","+ location +","+ x + "," +y
  }
}