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

import models.events.GameEventHandler

class ActiveGame(val gameid: Long)
{
  //var tileCaE: Array[Tuple2[Byte, Byte] = GameStorage.getTileConcealmentAndElevation(gameid)
  var players: Map[Int, PlayerInGame] = Map.empty[Int, PlayerInGame];

  def canJoin(userid: Int): Boolean = ! this.players.contains(userid)

  def isEmpty(): Boolean = this.players.isEmpty

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
      Class.forName("models.events."+messageType).newInstance match {
        case handler: GameEventHandler => handler.handle(userid, json, this);
      }
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
