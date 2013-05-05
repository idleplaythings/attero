package models.events;

import play.api.libs.json._
import models.repositories._
import models.tiles._
import models.units._
import models.units.states._
import models.units.strategies._
import models.MathLib
import models.GameState
import models.MutualUnitSpotting
import models.GamePlayer

class ChangeTurnEventListener(
    val gameState: GameState,
    val playerRepository: PlayerRepository,
    val unitRepository: UnitRepository,
    val tileRepository: TileRepository)
extends EventListener
{
    def getEventName: String = "ChangeTurnEvent";

    var unitVisibilityStatusChanged: List[GameUnit] = List.empty[GameUnit];

    def handle(event: Event): Unit = {
        event match {
          case turn: ChangeTurnEvent => processEvent(turn)
        }
    }

    private def processEvent(event: ChangeTurnEvent): Unit =
    {
        if (gameState.isCurrentPlayer(event.userid))
        {
            gameState.changeTurn(event.userid);

            hideUnits();
            renewUnitStates();
            messageTurnChange(event);
        }
    }

    private def hideUnits(): Unit =
    {
        unitRepository.getAllUnits.foreach({ keyval =>
            val (id, unit) = keyval;

            if (unit.isSpotted)
            {
                var spotted = false;

                unitRepository.getEnemyUnitsForTeam(unit.team).foreach({ keyval2 =>
                    val (enemyid, enemy) = keyval2;

                    var spotting = new MutualUnitSpotting(unit, enemy, tileRepository);
                    if (spotting.wasSpotted(unit))
                    {
                        spotted = true;
                    }
                })

                if (! spotted)
                {
                    unitVisibilityStatusChanged :+= unit;
                    unit.setSpotted(spotted);
                }
            }
        })
    }

    private def renewUnitStates(): Unit =
    {
        unitRepository.getAllUnits.foreach({ keyval =>
            val (id, unit) = keyval
            unit.renewMovementPoints();
        })
    }

    private def messageTurnChange(event: ChangeTurnEvent)
    {
        val turn = gameState.getTurn;
        val currentPlayerId = gameState.getCurrentPlayerId;
        val currentPlayerName = playerRepository.getNameForPlayerId(currentPlayerId);

        playerRepository.getAll.foreach({ player:GamePlayer =>
            event.addMessageForUser(
                player.id,
                JsObject(
                  Seq(
                    "type" -> JsString("ChangeTurn"),
                    "turn" -> JsNumber(turn),
                    "currentPlayerName" -> JsString(currentPlayerName),
                    "currentPlayerId" -> JsNumber(currentPlayerId),
                    "unitVisibility" -> JsArray(
                        unitVisibilityStatusChanged
                            .filter(_.team != player.team)
                            .map({unit => JsNumber(unit.id)}).toSeq)
                  )
                )
            );
        })
    }
}
