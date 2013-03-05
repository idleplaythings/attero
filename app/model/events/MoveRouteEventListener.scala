package models.events;

import models._
import models.repositories._
import play.api.libs.json._
import scala.util.control.Breaks._
import models.units.GameUnit

class MoveRouteEventListener(
    val eventDispatcher: EventDispatcher,
    val playerRepository: PlayerRepository,
    val unitRepository: UnitRepository)
        extends EventListener
{
    def getEventName: String = "MoveRouteEvent";

    def handle(event: Event): Unit =
    {
        event match {
          case moveRoute: MoveRouteEvent => processEvent(moveRoute)
        }
    }

    private def processEvent(event: MoveRouteEvent) =
    {
        var routeCount = 0;
        breakable {
            event.moves.foreach({ moveEvent =>

                moveEvent.setNumberInRoute(routeCount);
                eventDispatcher.dispatch(moveEvent);
                routeCount += 1;

                if (moveEvent.isRouteInterrupted()) {
                    println("Movement route interrupted")
                    break
                }
            });
        }

        if (event.isAnySpotted)
        {
            val unit:GameUnit = unitRepository.getUnit(event.unitid);
            //println("Someone spotted this route");
            playerRepository.getEnemies(event.userid).foreach({ playerid:Int =>
            //  println("Moveroute event replying to userid: " + playerid);
                event.addMessageForUser(
                    playerid,
                    JsObject(
                      Seq(
                        "type" -> JsString("EnemySpotted"),
                        "unit" -> JsString(unit.toString)
                      )
                    )
                );
                event.addMessageForUser(playerid, event.toJson);
            });
        }
    }
}