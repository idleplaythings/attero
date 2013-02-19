package models.events;

import play.api.libs.json._
import models._

trait EventListener
{
    def respondsTo(eventName: String): Boolean;
    def handle(event: Event): Unit;
    // def handle(userid: Int, json: JsValue, game: ActiveGame): Unit;
}