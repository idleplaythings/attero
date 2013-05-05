package models.units.states;

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

case class MoveState(
    private var unitid: Int,
    private var azimuth: Int,
    private var turretAzimuth: Int,
    private var lastMovePointsUsed:Double,
    private var lastDistanceMoved:Double,
    private var currentMovePointsUsed: Double,
    private var currentDistanceMoved: Double)
{
    //println("created movestate for unit " + unitid);
    var needsUpdate = false;

    def getUnitid: Int = unitid;

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
        //println("MOVE-STATE: Changed current used movement points of unit: " + unitid + " to " + currentMovePointsUsed);
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

    def renew(): Unit =
    {
        setLastDistanceMoved(getCurrentDistanceMoved);
        setLastMovePointsUsed(getCurrentMovePointsUsed);

        setCurrentDistanceMoved(0);
        setCurrentMovePointsUsed(0);
    }

    override def toString: String =
    {
        azimuth+","+turretAzimuth+","+lastMovePointsUsed+","+lastDistanceMoved+","+currentMovePointsUsed+","+currentDistanceMoved;
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

            SQL("""UPDATE """ +dbName+ """.game_unit_movestate SET
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
                'azimuth -> state.getAzimuth,
                'turret_azimuth -> state.getTurretAzimuth,
                'last_mp -> state.getLastMovePointsUsed,
                'last_dm -> state.getLastDistanceMoved,
                'current_mp -> state.getCurrentMovePointsUsed,
                'current_dm -> state.getCurrentDistanceMoved
            ).execute();
        }
    }

    def loadUnitMoveState(gameid: Long, unitid: Int): MoveState =
    {
        val dbName = "game_"+gameid;

        DB.withConnection { implicit c =>
          SQL("""SELECT
            unitid,
            azimuth,
            turret_azimuth,
            last_mp,
            last_dm,
            current_mp,
            current_dm
          FROM """ +dbName+ """.game_unit_movestate
          WHERE unitid = {unitid}
          """)
          .on('unitid -> unitid)
          .as(parserMoveState.singleOpt).get;
        }
    }

    val parserMoveState = {
        get[Int]("unitid") ~
        get[Int]("azimuth") ~
        get[Int]("turret_azimuth") ~
        get[Double]("last_mp") ~
        get[Double]("last_dm") ~
        get[Double]("current_mp") ~
        get[Double]("current_dm") map {
          case unitid~azimuth~turret_azimuth~last_mp~last_dm~current_mp~current_dm =>
            MoveState(unitid, azimuth, turret_azimuth, last_mp, last_dm, current_mp, current_dm)
        }
    }
}