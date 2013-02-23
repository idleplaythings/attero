package models.events;

import play.api.libs.json._

class MoveEventListener() extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {

        event match {
          case move: MoveEvent => processMoveEvent(move)
        }
        /*
        val json = event.getJson()
        var unitId: String = (json \ "payload" \ "unitId").as[String]
        var xPos: Int = (json \ "payload" \ "targetPosition" \ "x").as[Int]
        var yPos: Int = (json \ "payload" \ "targetPosition" \ "y").as[Int]
        event.UiEventStream = Json.parse("{ \"unitId\": \"" + unitId + "\", \"x\": " + xPos + ", \"y\": " + yPos + " }") +: event.UiEventStream
        */
    }

    private def processMoveEvent(event: MoveEvent) =
    {
        event.UiEventStream = Json.parse("{ \"unitId\": \"" + event.unitid + "\", \"x\": " + event.x + ", \"y\": " + event.y + " }") +: event.UiEventStream
    }
}