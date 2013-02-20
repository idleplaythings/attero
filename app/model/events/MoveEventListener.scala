package models.events;

import play.api.libs.json._
import models._

class MoveEventListener() extends EventListener
{
    def respondsTo: String = "MoveEvent";

    def handle(event: Event): Unit =
    {

        if (event.stopPropagation)
            return

        println("Move event received for handling");
    }
}