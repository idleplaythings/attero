package models.events;

import play.api.libs.json._
import models._

trait EventListener
{
    def respondsTo: String;
    def handle(event: Event): Unit;
    // def handle(userid: Int, json: JsValue, game: ActiveGame): Unit;
}