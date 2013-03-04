package models.events;

import models._
import play.api.libs.json._
import scala.collection.mutable

class Event(val name: String, val eventid: Int, val userid: Int)
{
    var UiEventStream: mutable.Map[Int, List[JsValue]] = mutable.Map.empty[Int, List[JsValue]];

    var done = false;
    def setDone() = {done = true};
    def isDone(): Boolean = done;

    var replied = false;
    def setReplied() = {replied = true};
    def isReplied(): Boolean = replied;

    var stopped = false;
    def stopPropagation() = { stopped = true };
    def isStopped() : Boolean = stopped;

    def addMessageForUser(userid: Int, message: JsValue): Unit =
    {
        if ( ! UiEventStream.contains(userid)) {
            UiEventStream += (userid -> List(message))
        } else {
            UiEventStream(userid) = message +: UiEventStream(userid)
        }
    }
}

class MoveEvent(userid: Int, eventid: Int, val unitid: Int, val x: Int, val y: Int, val turretFacing: Int, val unitFacing: Int)
    extends Event( "MoveEvent", eventid, userid)
{
    private var routeInterrupted = false;
    def interruptRoute() = {routeInterrupted = true};
    def isRouteInterrupted() : Boolean = routeInterrupted;

    private var executed = false;
    def setExecuted() = {executed = true};
    def isExecuted(): Boolean = executed;

    private var spotted = false;
    def setSpotted() = {spotted = true};
    def isSpotted(): Boolean = spotted;

    private var numberInRoute: Int = _;
    def setNumberInRoute(n: Int) = {numberInRoute = n}
    def getNumberInRoute: Int = numberInRoute;

    //println("MoveEvent from userid: "+userid+" created, unit:" +unitid+ " position: " + x + "," + y);

    override def toString: String = {
        x+","+y+","+turretFacing+","+unitFacing
    }

    def toJson: JsObject =
        JsObject(
          Seq(
            "unitid" -> JsNumber(unitid),
            "x" -> JsNumber(x),
            "y" -> JsNumber(y),
            "tf" -> JsNumber(turretFacing),
            "uf" -> JsNumber(unitFacing)
          )
        )
}

class MoveRouteEvent(userid: Int, eventid: Int, val unitid: Int, val moves: List[MoveEvent])
    extends Event("MoveRouteEvent", eventid, userid)
{
    //println("MoveRouteEvent from userid: "+userid+" created");

    def isAnySpotted: Boolean = moves.filter(_.isSpotted).nonEmpty;

    def getRouteForEnemies: String = moves.filter(_.isSpotted).map(_.toString).mkString(";");

    def toJson: JsObject =
    {
        JsObject(
          Seq(
            "type" -> JsString("MoveRouteEvent"),
            "payload" -> JsObject(
                Seq(
                    "unitid" -> JsNumber(unitid),
                    "route" -> JsString(getRouteForEnemies)
                )
            )
          )
        )
    }
}