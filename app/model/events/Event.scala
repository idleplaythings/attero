package models.events;

import play.api.libs.json._
import scala.collection.mutable

class Event(val name: String, userid: Int, json: JsValue)
{
    var UiEventStream: List[JsValue] = List.empty[JsValue]
    var stopped = false;
    def stopPropagation() = { stopped = true };
    def isStopped() : Boolean = stopped;
    def getJson(): JsValue = json
}