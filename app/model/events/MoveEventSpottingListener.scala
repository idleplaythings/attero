package models.events;

import play.api.libs.json._
import models.repositories._
import models.Raytrace;
import models.units._
import models.MessageSender

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
        val concealment = new Raytrace(mover.getPosition, enemy.getPosition, tileRepository).run;

        var enemiesSpottedThis: List[GameUnit] = List.empty[GameUnit];

        if (concealment < 100)
        {
            if ( ! enemy.isSpotted && mover.canSpot(enemy, concealment))
            {
                //println("Enemy spotted with concealment: " + concealment);
                enemy.setSpotted(true);
                informAboutSpottedEnemy(event, enemy)
            }

            if (enemy.canSpot(mover, concealment))
            {
                event.setSpotted();
                //enemiesSpottedThis :+= enemy;
            }
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