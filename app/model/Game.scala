package models;

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

class Game(val gameid: Long) extends EventDispatcher {

    val playerRepository = new PlayerRepository(gameid);

    var players: Map[Int, PlayerInGame] = Map.empty[Int, PlayerInGame];

    var eventListeners: mutable.Map[String, List[EventListener]] = mutable.Map.empty[String, List[EventListener]];

    def canJoin(userid: Int): Boolean = ! this.players.contains(userid)

    def isEmpty(): Boolean = this.players.isEmpty

    def attach(eventListener: EventListener) =
    {
        val eventname: String = eventListener.getEventName;

        if ( ! eventListeners.contains(eventname)) {
            eventListeners += (eventname -> List(eventListener))
        } else {
            eventListeners(eventname) = eventListener +: eventListeners(eventname)
        }
    }

    def dispatch(event: Event) =
    {
        breakable {
            eventListeners(event.name).foreach({ listener =>
                listener.handle(event)
                if (event.isStopped()) {
                    println("Event propagation stopped")
                    break
                }
            });
        }

        event.UiEventStream.foreach{
            case (userid:Int, messages:List[JsValue]) =>
            {
                if (this.players.contains(userid))
                {
                    val player = this.players(userid);
                    messages.foreach(player.channel.push(_))
                }
            }
        }
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
            case Some(messageType) => dispatch(EventFactory.makeEvent(messageType + "Event", userid, json));
            case None => sendErrorMessage(userid, "Message type omitted");
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
