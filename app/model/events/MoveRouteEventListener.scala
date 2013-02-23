package models.events;

import models._
import play.api.libs.json._
import scala.util.control.Breaks._

class MoveRouteEventListener(game: EventDispatcher) extends EventListener
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
        breakable {
            event.moves.foreach({ moveEvent =>

                game.dispatch(moveEvent);

                if (moveEvent.isRouteInterrupted()) {
                    println("Movement route interrupted")
                    break
                }
            });
        }
    }
}