package models.units.states;

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

case class MoveState(
    private var unitid: Int,
    private var x: Int,
    private var y: Int,
    private var azimuth: Int,
    private var turretAzimuth: Int,
    private var lastMovePointsUsed:Double,
    private var lastDistanceMoved:Double,
    private var currentMovePointsUsed: Double,
    private var currentDistanceMoved: Double)
{

    println("MoveState created: " +x+ "," +y);
    var needsUpdate = false;

    def this(x: Int, y:Int) = this(0, x, y, 0, 0, 0.0, 0.0, 0.0, 0.0)

    def getUnitid: Int = unitid;

    def getPosition: (Int, Int) = {(this.x, this.y)}
    def setPosition(pos: (Int, Int)) =
    {
        val (x, y) = pos;
        this.x = x;
        this.y = y;
        this.needsUpdate = true;

        println("MOVE-STATE: Changed position of unit: " + unitid + " to " + x +"," +y);
    }

    def getAzimuth: Int = azimuth;
    def setAzimuth(a: Int) = {
        azimuth = a;
        this.needsUpdate = true;
    }

    def getTurretAzimuth: Int = turretAzimuth;
    def setTurretAzimuth(a: Int) = {
        turretAzimuth = a;
        this.needsUpdate = true;
    }

    def getLastMovePointsUsed: Double = lastMovePointsUsed;
    def setLastMovePointsUsed(points: Double) =
    {
        lastMovePointsUsed = points;
        this.needsUpdate = true;
    }

    def getCurrentMovePointsUsed: Double = currentMovePointsUsed;
    def setCurrentMovePointsUsed(points: Double) =
    {
        currentMovePointsUsed = points;
        this.needsUpdate = true;
        println("MOVE-STATE: Changed current used movement points of unit: " + unitid + " to " + currentMovePointsUsed);
    }

    def getLastDistanceMoved: Double = lastDistanceMoved;
    def setLastDistanceMoved(points: Double) =
    {
        lastDistanceMoved = points;
        this.needsUpdate = true;
    }

    def getCurrentDistanceMoved: Double = currentDistanceMoved;
    def setCurrentDistanceMoved(points: Double) =
    {
        currentDistanceMoved = points;
        this.needsUpdate = true;
    }

    override def toString: String =
    {
        x+","+y+","+azimuth+","+turretAzimuth+","+lastMovePointsUsed+","+lastDistanceMoved+","+currentMovePointsUsed+","+currentDistanceMoved;
    }

    def updateIfNeeded(gameid: Long): Unit =
    {
        if (this.needsUpdate == true)
            MoveState.update(gameid, this);

        this.needsUpdate = false;
    }
}

object MoveState
{
    def update(gameid: Long, state: MoveState): Unit =
    {
        DB.withConnection { implicit c =>

            val dbName = "game_"+gameid;

            val (x, y) = state.getPosition
            SQL("""UPDATE """ +dbName+ """.game_unit_movestate SET
                x = {x},
                y = {y},
                azimuth = {azimuth},
                turret_azimuth = {turret_azimuth},
                last_mp = {last_mp},
                last_dm = {last_dm},
                current_mp = {current_mp},
                current_dm = {current_dm}
            WHERE
                unitid = {unitid}
            """)
            .on(
                'unitid -> state.getUnitid,
                'x -> x,
                'y -> y,
                'azimuth -> state.getAzimuth,
                'turret_azimuth -> state.getTurretAzimuth,
                'last_mp -> state.getLastMovePointsUsed,
                'last_dm -> state.getLastDistanceMoved,
                'current_mp -> state.getCurrentMovePointsUsed,
                'current_dm -> state.getCurrentDistanceMoved
            ).execute();
        }
    }

    val parserMoveState = {
        get[Int]("unitid") ~
        get[Int]("x") ~
        get[Int]("y") ~
        get[Int]("azimuth") ~
        get[Int]("turret_azimuth") ~
        get[Double]("last_mp") ~
        get[Double]("last_dm") ~
        get[Double]("current_mp") ~
        get[Double]("current_dm") map {
          case unitid~x~y~azimuth~turret_azimuth~last_mp~last_dm~current_mp~current_dm =>
            MoveState(unitid, x, y, azimuth, turret_azimuth, last_mp, last_dm, current_mp, current_dm)
        }
    }
}