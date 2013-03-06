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

    var enemiesSpottedThis: List[GameUnit] = List.empty[GameUnit]

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
            unitRepository.getEnemyUnitsForTeam(unit.team).foreach({keyVal =>
                spot(event, unit, keyVal._2);
            })
        }

    }

    private def spot(event: MoveEvent, mover: GameUnit, enemy: GameUnit)
    {
        val concealment = new Raytrace(mover.getPosition, enemy.getPosition, tileRepository).run;

        //println("Concealment between mover and unit: " + enemy.id + " is: " + concealment);
        if (concealment < 100)
        {
            if (mover.canSpot(enemy, concealment))
            {
                //TODO: Change enemy unit state to spotted
                informAboutSpottedEnemy(event, enemy)
            }

            if (enemy.canSpot(mover, concealment))
            {
                event.setSpotted();
                enemiesSpottedThis :+= enemy;
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