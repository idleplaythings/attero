package models.events;

import play.api.libs.json._
import models.repositories._
import models.raytracing._
import models.units._
import models.MessageSender
import models.MutualUnitSpotting

class MoveEventSpottingListener(
    val playerRepository: PlayerRepository,
    val unitRepository: UnitRepository,
    val tileRepository: TileRepository,
    val messageSender: MessageSender
) extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {

        event match {
          case move: MoveEvent => processMoveEvent(move)
        }
    }

    private def processMoveEvent(event: MoveEvent) =
    {
        if (event.getNumberInRoute > 0)
        {

            val unit:GameUnit = unitRepository.getUnit(event.unitid);
            val now = System.nanoTime

            unitRepository.getEnemyUnitsForTeam(unit.team).foreach({keyVal =>
                spot(event, unit, keyVal._2);
            })

            val micros = (System.nanoTime - now) / 1000

            println("Raytrace took " + micros + " microseconds.");

            if (event.isSpotted)
                unit.setSpotted(true);
            else
                unit.setSpotted(false);
        }

    }

    private def spot(event: MoveEvent, mover: GameUnit, enemy: GameUnit)
    {
        var spotting = new MutualUnitSpotting(mover, enemy, tileRepository);

        if ( ! enemy.isSpotted && spotting.wasSpotted(enemy))
        {
            enemy.setSpotted(true);
            informAboutSpottedEnemy(event, enemy)
        }

        if (spotting.wasSpotted(mover))
        {
            event.setSpotted();
        }
    }

    private def informAboutSpottedEnemy(event: MoveEvent, enemy: GameUnit): Unit =
    {
        if ( ! event.isRouteInterrupted)
        {
            event.interruptRoute();
            messageSender.sendMessageToPlayer(
                event.userid,
                JsObject(
                  Seq(
                    "type" -> JsString("MoveInterrupt"),
                    "eventid" -> JsNumber(event.eventid),
                    "routeNumber" -> JsNumber(event.getNumberInRoute+1)
                  )
                )
            );
        }

        event.addMessageForUser(
            event.userid,
            JsObject(
              Seq(
                "type" -> JsString("EnemySpotted"),
                "unit" -> JsString(enemy.toString)
              )
            )
        );
    }
}