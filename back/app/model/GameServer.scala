package models

import akka.actor._
import scala.concurrent.duration._

import play.api._
import play.api.libs.json._
import play.api.libs.iteratee._
import play.api.libs.concurrent._

import akka.util.Timeout
import akka.pattern.ask

import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits._

import models.events.EventListener
import models.events._

object GameServer {

  implicit val timeout = Timeout(1 second)

  lazy val default = Akka.system.actorOf(Props[GameServer])

  def join(userid: Int, gameid: Long): scala.concurrent.Future[(Iteratee[JsValue,_],Enumerator[JsValue])] = {

    (default ? Join(userid, gameid)).map {

      case Connected(enumerator) =>

        val iteratee = Iteratee.foreach[JsValue] { message =>
              default ! GameMessage(userid, gameid, message)
            }.mapDone { _ =>
              default ! Quit(userid, gameid)
            }

        (iteratee,enumerator)

      case CannotConnect(error) =>

        // Connection error

        // A finished Iteratee sending EOF
        val iteratee = Done[JsValue,Unit]((),Input.EOF)

        // Send an error and close the socket
        val enumerator =  Enumerator[JsValue](JsObject(Seq("error" -> JsString(error)))).andThen(Enumerator.enumInput(Input.EOF))

        (iteratee,enumerator)

    }
  }
}

class GameServer extends Actor {

  var games: Map[Long, Game] = Map.empty[Long, Game];

  def receive = {

    case Join(userid: Int, gameid: Long) => {

        if ( ! games.contains(gameid) )
        {
            val newGame: Game = new Game(gameid)
            newGame.attach(new MoveRouteEventListener(newGame));
            newGame.attach(new MoveEventListener());
            newGame.attach(new MoveEventSpottingListener(newGame.playerRepository));

            games += (gameid -> newGame)
        }

        if (games(gameid).canJoin(userid))
        {
            sender ! Connected(games(gameid).join(userid))
        }
        else
        {
            sender ! CannotConnect("This user is already in game")
        }
    }

    case GameMessage(userid: Int, gameid: Long, json: JsValue) => {
      println(json.toString)
      games(gameid).event(userid, json);
    }

    case Quit(userid, gameid) => {
      if (games.contains(gameid))
      {
        games(gameid).leave(userid)
      }

      if (games(gameid).isEmpty)
      {
        games -= gameid;
      }
    }
  }
}

case class Join(userid: Int, gameid: Long)
case class Quit(userid: Int, gameid: Long)
case class GameMessage(userid: Int, gameid: Long, json: JsValue)

case class Connected(enumerator:Enumerator[JsValue])
case class CannotConnect(msg: String)