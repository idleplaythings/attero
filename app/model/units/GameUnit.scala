package models.units;

class GameUnit(val id: Int, val unitType: Int, val owner: Int, val team: Int) extends Movable with Spotter with Spottable
{
    println("created gameunit: " + unitType + " owner: " + owner);

    override def toString: String =
    {
        id +","+ unitType +","+ owner +","+ getMoveState.toString
    }
}



