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
        val unit:GameUnit = unitRepository.getUnit(event.unitid);
        val wasSpotted = unit.isSpotted
        var informUnit: String = "";

        var routeCount = 0;

        breakable {
            event.moves.foreach({ moveEvent =>

                moveEvent.setNumberInRoute(routeCount);
                eventDispatcher.dispatch(moveEvent);
                routeCount += 1;

                if (! wasSpotted && informUnit == "" && moveEvent.isSpotted)
                {
                    informUnit = unit.toString;
                }

                if (moveEvent.isRouteInterrupted()) {
                    //println("Movement route interrupted")
                    break
                }
            });
        }

        if (event.isAnySpotted)
        {
            //println("Someone spotted this route");
            playerRepository.getEnemies(event.userid).foreach({ playerid:Int =>

                if ( ! wasSpotted)
                {
                    event.addMessageForUser(
                        playerid,
                        JsObject(
                          Seq(
                            "type" -> JsString("EnemySpotted"),
                            "unit" -> JsString(informUnit)
                          )
                        )
                    );
                }
                event.addMessageForUser(playerid, event.toJson);

                if ( ! unit.isSpotted)
                {
                    disappearUnit(event, unit);
                }
            });
        }
        else if ( wasSpotted && ! unit.isSpotted)
        {
            disappearUnit(event, unit);
        }
    }

    private def disappearUnit(event: MoveRouteEvent, unit: GameUnit)
    {
        playerRepository.getEnemies(event.userid).foreach({ playerid:Int =>
            event.addMessageForUser(
                playerid,
                JsObject(
                  Seq(
                    "type" -> JsString("EnemyDissapear"),
                    "unitid" -> JsNumber(unit.id)
                  )
                )
            );
        })
    }
}