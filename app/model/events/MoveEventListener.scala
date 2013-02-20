package models.events;

import play.api.libs.json._
import models._

class MoveEventListener() extends EventListener
{
    def respondsTo: String = "MoveEvent";

    // def handle(userid: Int, json: JsValue, game: ActiveGame): Unit = {
    def handle(event: Event): Unit = {
        println("Move event received for handling");
    }
}