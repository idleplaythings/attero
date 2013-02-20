package models.events;

import play.api.libs.json._
import models._

trait EventListener
{
    var game:ActiveGame = _;
    def respondsTo: String;
    def handle(event: Event): Unit;
}