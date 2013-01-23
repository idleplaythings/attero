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

class ActiveGame(val gameid: Int)
{
    //var tileCaE: Array[Tuple2[Byte, Byte] = GameStorage.getTileConcealmentAndElevation(gameid)
    var players: Map[Int, PlayerInGame] = Map.empty[Int, PlayerInGame];

    def canJoin(userid: Int): Boolean = this.players.contains(userid)

    def isEmpty(): Boolean = this.players.isEmpty

    def join(userid: Int): (Enumerator[JsValue]) =
    {
        val (enumerator, channel) = Concurrent.broadcast[JsValue]
        players += (userid -> new PlayerInGame(userid, 1, enumerator, channel))

        enumerator
    }

    def leave(userid: Int) =
    {
        if (this.players.contains(userid))
        {
            this.players -= userid
        }
    }
}

case class PlayerInGame(
    val userid: Int,
    val side: Int,
    val out: Enumerator[JsValue],
    val channel: Channel[JsValue]
)
