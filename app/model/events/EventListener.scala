package models.events;

import play.api.libs.json._

trait EventListener
{
    def getEventName: String;
    def handle(event: Event): Unit;
}