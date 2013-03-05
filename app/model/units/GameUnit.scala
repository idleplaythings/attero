package models.units;

import play.api.db._
import play.api.Play.current
import anorm._
import anorm.SqlParser._
import models.units.states._

class GameUnit(
    val gameid: Long,
    val id: Int,
    x: Int,
    y: Int,
    val unitType: Int,
    val owner: Int,
    val team: Int)
extends Movable with Spotter with Spottable
{
    private var position = (x, y);
    private var needsUpdate:Boolean = false;

    def getPosition: (Int, Int) = position;
    def setPosition(pos: (Int, Int)) = {
        position = pos
        needsUpdate = true;
    }

    println("created gameunit: " + unitType + " owner: " + owner);

    private var moveState: Option[MoveState] = None;

    def getMoveState: MoveState = {
        moveState match {
            case Some(state) =>  state;
            case None => {
                var state = MoveState.loadUnitMoveState(gameid, id);
                setMoveState(state);
                state;
            }
        }
    }

    def setMoveState(state: MoveState) = {moveState = Some(state)}

    def updateStateIfNeeded(gameid: Long): Unit =
    {
        if (needsUpdate == true)
            GameUnit.updatePosition(gameid, id, getPosition)

        moveState match {
            case Some(state) =>
            {
                state.updateIfNeeded(gameid);
            }
            case None => {}
        }

        moveState = None;
    }

    def toBaseString: String =
    {
        val (x, y) = getPosition
        id +","+ unitType +","+ owner + "," + x + "," + y
    }

    override def toString: String =
    {
        toBaseString+","+ getMoveState.toString
    }
}

object GameUnit
{
    def updatePosition(gameid: Long, unitid: Int, pos:(Int, Int)): Unit =
    {
        DB.withConnection { implicit c =>

            val dbName = "game_"+gameid;
            val (x, y) = pos

            SQL("""UPDATE """ +dbName+ """.game_unit SET
                x = {x},
                y = {y}
            WHERE
                id = {unitid}
            """)
            .on(
                'unitid -> unitid,
                'x -> x,
                'y -> y
            ).execute();
        }
    }
}



