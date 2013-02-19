package models.events;

import play.api.libs.json._
import models.ActiveGame

class Move() extends GameEventHandler
{
    override def handle(userid: Int, json: JsValue, game: ActiveGame): Unit =
    {
        println("Move event received for handling");
    }
}