package models.events;

import play.api.libs.json._

class MoveEventListener() extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {
        val json = event.getJson()
        var unitId: String = (json \ "payload" \ "unitId").as[String]
        var xPos: Int = (json \ "payload" \ "targetPosition" \ "x").as[Int]
        var yPos: Int = (json \ "payload" \ "targetPosition" \ "y").as[Int]
        event.UiEventStream = Json.parse("{ \"unitId\": \"" + unitId + "\", \"x\": " + xPos + ", \"y\": " + yPos + " }") +: event.UiEventStream
    }
}