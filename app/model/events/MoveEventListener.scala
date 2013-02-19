package models.events;

import play.api.libs.json._
import models._

class MoveEventListener() extends EventListener
{
    val event = "MoveEvent";

    def respondsTo(eventName: String): Boolean = {
        return eventName == event;
    }

    // def handle(userid: Int, json: JsValue, game: ActiveGame): Unit = {
    def handle(event: Event): Unit = {
        println("Move event received for handling");
    }
}