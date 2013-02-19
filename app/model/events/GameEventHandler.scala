package models.events;

import play.api.libs.json._
import models.ActiveGame

trait GameEventHandler
{
    def handle(userid: Int, json: JsValue, game: ActiveGame): Unit
}