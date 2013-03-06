package models

;

import akka.actor._
import scala.concurrent.duration._
import scala.util.control.Breaks._

import play.api._
import play.api.libs.json._
import play.api.libs.iteratee._
import play.api.libs.iteratee.Concurrent.Channel
import play.api.libs.concurrent._

import akka.util.Timeout
import akka.pattern.ask

import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._

import models.events._
import scala.collection.mutable

import models.repositories._

class Game(val gameid: Long,
           playerRepository: PlayerRepository,
           tileRepository: TileRepository,
           unitRepository: UnitRepository) extends EventDispatcher {
  var players: Map[Int, PlayerInGame] = Map.empty[Int, PlayerInGame];
  var eventMessageList: List[Event] = List.empty[Event];

  def canJoin(userid: Int): Boolean = !this.players.contains(userid)

  def isEmpty(): Boolean = this.players.isEmpty

  def getPlayerRepository() = this.playerRepository
  def getTileRepository() = this.tileRepository
  def getUnitRepository() = this.unitRepository

  def join(userid: Int): (Enumerator[JsValue]) = {
    val (enumerator, channel) = Concurrent.broadcast[JsValue]
    players += (userid -> new PlayerInGame(userid, 1, enumerator, channel))

    println(
      "userid: " + userid
        + " joining game " + gameid
        + ". Game now has " + players.size + " player(s)");

    enumerator
  }

  override def dispatch(event: Event): Unit = {
    val now = System.nanoTime
    eventMessageList = event +: eventMessageList;
    super.dispatch(event);
    replyToDoneEvents();

    val micros = (System.nanoTime - now) / 1000

    println("Dispatching event: " + event.name + " took " + micros + " microseconds.");

    if (eventMessageList.length == 0)
      storeUpdatedGameState();
  }

  def event(userid: Int, json: JsValue) = {
    println("message from userid: " + userid + " received.");
    (json \ "type").asOpt[String] match {
      case Some(messageType) => dispatch(EventFactory.makeEvent(messageType + "Event", userid, json));
      case None => sendErrorMessage(userid, "Message type omitted");
    }
  }

  def leave(userid: Int) = {
    if (this.players.contains(userid)) {
      this.players -= userid
    }
  }

  private def storeUpdatedGameState() = {
    val now = System.nanoTime
    unitRepository.updateUnitStatesIfNeeded();
    val micros = (System.nanoTime - now) / 1000

    println("Updating gamedata took " + micros + " microseconds.");
  }

  private def replyToDoneEvents() = {
    breakable {
      eventMessageList.foreach({
        event: Event =>
          if (event.isDone) {
            replyToEvent(event);
            event.setReplied();
          }
          else {
            break;
          }
      })
    }

    eventMessageList = eventMessageList.filterNot(_.isReplied).toList;
  }

  private def replyToEvent(event: Event) {
    event.UiEventStream.foreach {
      case (userid: Int, messages: List[JsValue]) => {
        if (players.contains(userid)) {
          val player = players(userid);
          messages.foreach(player.channel.push(_))
        }
      }
    }
  }

  private def sendErrorMessage(userid: Int, msg: String) = {
    players(userid).channel.push(JsObject(
      Seq(
        "error" -> JsString(msg)
      )
    )
    )
  }
}

case class PlayerInGame(
                         val userid: Int,
                         val side: Int,
                         val out: Enumerator[JsValue],
                         val channel: Channel[JsValue]
                         )
