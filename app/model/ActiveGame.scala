package models;

import akka.actor._
import scala.concurrent.duration._

import play.api._
import play.api.libs.json._
import play.api.libs.iteratee._
import play.api.libs.iteratee.Concurrent.Channel
import play.api.libs.concurrent._

import akka.util.Timeout
import akka.pattern.ask

import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._

import models.events.EventListener
import models.events.MoveEventListener



class Event(val name: String) {
}

trait EventDispatcher {
  def attach(eventHandler: EventListener);
  def dispatch(event: Event);
}

class ActiveGame(val gameid: Long) extends EventDispatcher {
  //var tileCaE: Array[Tuple2[Byte, Byte] = GameStorage.getTileConcealmentAndElevation(gameid)
  var players: Map[Int, PlayerInGame] = Map.empty[Int, PlayerInGame];

  var eventListeners: List[EventListener] = List();

  def canJoin(userid: Int): Boolean = ! this.players.contains(userid)

  def isEmpty(): Boolean = this.players.isEmpty

  def attach(eventListener: EventListener) = {
    if (!eventListeners.contains(eventListener)) {
      eventListeners ::: List(eventListener);
    }
  }

  def dispatch(event: Event) = {
    eventListeners.filter(_.respondsTo(event.name)).map(_.handle(event))
  }


  def join(userid: Int): (Enumerator[JsValue]) =
  {
    val (enumerator, channel) = Concurrent.broadcast[JsValue]
    players += (userid -> new PlayerInGame(userid, 1, enumerator, channel))

    println(
      "userid: " + userid
      + " joining game " + gameid
      + ". Game now has " + players.size+ " player(s)");

    enumerator
  }

  def leave(userid: Int) =
  {
    if (this.players.contains(userid))
    {
      this.players -= userid
    }
  }

  def event(userid: Int, json: JsValue) =
  {
    (json \ "type").asOpt[String] match
    {
      case Some(messageType) => handleEvent(userid, messageType, json);
      case None => sendErrorMessage(userid, "Message type omitted");
    }
  }

  def handleEvent(userid: Int, messageType: String, json: JsValue) =
  {
    try
    {
      dispatch(new Event(messageType + "Event"))
      // Class.forName("models.events." + messageType + "Event").newInstance match {

      //   // case handler: GameEventHandler => handler.handle(userid, json, this);
      // }
    }
    catch
    {
      case e: Exception => sendErrorMessage(
        userid,
        "Handler not found for message type: '"+messageType+"'");
    }
  }

  def sendErrorMessage(userid: Int, msg: String) =
  {
    this.players(userid).channel.push(JsObject(
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
