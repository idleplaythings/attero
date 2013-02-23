package models.events;

import play.api.libs.json._
import scala.collection.mutable

class Event(val name: String, userid: Int)
{
    var UiEventStream: List[JsValue] = List.empty[JsValue]
    var stopped = false;
    def stopPropagation() = { stopped = true };
    def isStopped() : Boolean = stopped;
}

class MoveEvent(userid: Int, unitid: Int, val x: Int, val y: Int, val turretFacing: Int, val unitFacing: Int)
extends Event( "MoveEvent", userid)
{
    println("MoveEvent created, unit:" +unitid+ " position: " + x + "," + y);
}