package models.events;

import play.api.libs.json._

class MoveEventListener() extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {
        event.stopPropagation()
        println("Move event received for handling");
    }
}