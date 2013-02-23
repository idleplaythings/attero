package models.events;

import play.api.libs.json._

class MoveEventListener() extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {

        event match {
          case move: MoveEvent => processMoveEvent(move)
        }
    }

    private def processMoveEvent(event: MoveEvent) =
    {
        println("processing move event");
        if (canMoveTo(event.unitid, event.x, event.y, event.unitFacing))
        {
            moveTo(event.unitid, event.x, event.y, event.turretFacing, event.unitFacing);
        }
        else
        {
            event.stopPropagation();
            event.interruptRoute();
            event.addMessageForUser(event.userid, Json.parse("{ \"id\": \"" + event.eventid + "\", \"interrupted\": \"cant reach target\"}"))
            //since nothing happened the enemy doesn't need to be notified
        }
        //event.UiEventStream = Json.parse("{ \"unitId\": \"" + event.unitid + "\", \"x\": " + event.x + ", \"y\": " + event.y + " }") +: event.UiEventStream
    }

    private def canMoveTo(unitid: Int, x: Int, y: Int, facing: Int): Boolean =
    {
        //TODO: Check that target is one adjacent to last unit position (no teleporting)
        //TODO: Check that target is passable terrain for target
        //TODO: Check that unit has enough movement left to reach the target
        return true;
    }

    private def moveTo(unitid: Int, x: Int, y: Int, turretFacing: Int, facing: Int) : Unit =
    {
        //TODO: change unit position
    }
}