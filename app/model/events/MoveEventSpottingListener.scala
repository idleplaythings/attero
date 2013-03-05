package models.events;

import play.api.libs.json._
import models.repositories._
import models.Raytrace;
import models.units._

class MoveEventSpottingListener(
    val playerRepository: PlayerRepository,
    val unitRepository: UnitRepository,
    val tileRepository: TileRepository
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
        val unit:GameUnit = unitRepository.getUnit(event.unitid);
        unitRepository.getEnemyUnitsForTeam(unit.team).foreach({keyVal =>
            spot(event, unit, keyVal._2);
        })

    }

    private def spot(event: MoveEvent, mover: GameUnit, enemy: GameUnit)
    {
        val concealment = new Raytrace(mover.getPosition, enemy.getPosition, tileRepository).run;
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
        event.interruptRoute();

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