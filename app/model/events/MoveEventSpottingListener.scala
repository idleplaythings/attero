package models.events;

import play.api.libs.json._
import models.repositories.PlayerRepository

class MoveEventSpottingListener(val playerRepository: PlayerRepository) extends EventListener
{
    def getEventName: String = "MoveEvent";

    def handle(event: Event): Unit = {

        event match {
          case move: MoveEvent => processMoveEvent(move)
        }
    }

    private def processMoveEvent(event: MoveEvent) =
    {
        println("processing move spotting event");
        this.playerRepository.getEnemies(event.userid).foreach({ playerid:Int =>
            event.addMessageForUser(playerid, event.toJson);
        });
    }
}