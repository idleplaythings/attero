package models.units

import models.units.strategies._

object UnitDefinition
{
    def getUnitObjectByType(gameid: Long, id: Int, x: Int, y: Int, owner: Int, unitType: Int, team: Int): GameUnit =
    {
        unitType match
        {
            case 1 =>
            {
                val unit = new GameUnit(gameid, id, x, y, unitType, owner, team);
                unit.setMoveStrategy(new InfantryMoveStrategy(10.0));
                unit;
            }
            case 2 =>
            {
                val unit = new GameUnit(gameid, id, x, y, unitType, owner, team);
                unit.setMoveStrategy(new InfantryMoveStrategy(30.0));
                unit;

            }
        }
    }
}