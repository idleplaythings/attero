package models.events;

import play.api.libs.json._
import models.repositories.UnitRepository
import models.repositories.TileRepository
import models.tiles._
import models.units._
import models.units.states._
import models.units.strategies._
import models.MathLib

class MoveEventListener(val unitRepository: UnitRepository, val tileRepository: TileRepository) extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {

        event match {
          case move: MoveEvent => processEvent(move)
        }
    }

    private def processEvent(event: MoveEvent): Unit =
    {
        val unit:GameUnit = unitRepository.getUnit(event.unitid);
        var tile:ActiveGameTile = tileRepository.getTileByXY(event.x, event.y) match {
            case Some(t) => t;
            case None =>
            {
                event.stopPropagation();
                event.interruptRoute();
                throw new IllegalArgumentException("Trying to move outside of tilegrid");
            }
        }


        //println("processing move event for unit " + unit.id + "moving from: " + unit.getPosition + " to " + tile.getPosition);
        if (canMoveTo(unit, tile, event))
        {
            moveTo(unit, tile, event.turretFacing, event.unitFacing);
            event.setExecuted();
        }
        else
        {
            event.stopPropagation();
            event.interruptRoute();
            event.addMessageForUser(
                event.userid,
                JsObject(
                  Seq(
                    "type" -> JsString("MoveInterrupt"),
                    "eventid" -> JsNumber(event.eventid),
                    "routeNumber" -> JsNumber(event.getNumberInRoute)
                  )
                )
            );

            //since nothing happened the enemy doesn't need to be notified
        }
        //event.UiEventStream = Json.parse("{ \"unitId\": \"" + event.unitid + "\", \"x\": " + event.x + ", \"y\": " + event.y + " }") +: event.UiEventStream
    }

    private def canMoveTo(unit:GameUnit, tile:ActiveGameTile, event: MoveEvent): Boolean =
    {
        if (MathLib.distance(unit.getPosition, tile.getPosition) >= 2)
        {
            event.stopPropagation();
            event.interruptRoute();
            throw new IllegalArgumentException("Unit trying to teleport from tile: " + unit.getPosition + " to " + tile.getPosition)
        }
        unit.canMove(tile);
    }

    private def moveTo(unit:GameUnit, tile:ActiveGameTile, turretFacing: Int, facing: Int) : Unit =
    {
        unit.move(tile:ActiveGameTile, turretFacing: Int, facing: Int);
    }
}