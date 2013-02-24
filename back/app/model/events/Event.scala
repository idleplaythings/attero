package models.events;

import models._
import play.api.libs.json._
import scala.collection.mutable

class Event(val name: String, val eventid: Int, val userid: Int)
{
    var UiEventStream: mutable.Map[Int, List[JsValue]] = mutable.Map.empty[Int, List[JsValue]];
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
    var routeInterrupted = false;
    def interruptRoute() = {routeInterrupted = true};
    def isRouteInterrupted() : Boolean = routeInterrupted;

    println("MoveEvent created, unit:" +unitid+ " position: " + x + "," + y);

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
    println("MoveRouteEvent created");
}