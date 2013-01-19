package models

case class GameUnit(
    id: Int,
    owner: Int,
    amount: Int,
    hide: Int,
    spot: Int,
    location: Int,
    x: Int,
    y: Int
)
{
    println("GameUnit created, spot: " + spot + " hide:  " + hide)

}