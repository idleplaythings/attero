package controllers

import models._
import play.api._
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.json.Json._

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

import play.api.libs.iteratee._
import akka.actor._
import scala.concurrent.duration._

object Editor extends Controller {
  def server(userId: Int, gameId: Long) = WebSocket.async[JsValue] { request  =>
    GameServer.join(userId, gameId)
  }
  // def index = Action {
  //   Ok(views.html.index("Your new application is ready."))
  // }

  // def editor = Action {
  //   Ok(views.html.editor())
  // }

  // def game(gameId: Long, userId: Int) = Action { implicit request =>

  //   GameManager.loadMap(gameId) match {
  //       case None =>  Ok("""{"status":"error", "info": "game not found"}""")
  //       case Some(map) => Ok(views.html.game(
  //         userId,
  //         gameId,
  //         Json.stringify(map.toJSON),
  //         GameManager.loadUnitsForOwner(gameId, 1).map(_.toString).mkString(";"))
  //       )
  //     }
  // }

  // def loadMap(id: Long) = Action
  // {
  //     MapStorage.loadMap(id) match {
  //       case None =>  Ok("""{"status":"error", "info": "map not found"}""")
  //       case Some(map) => Ok(map.toJSON)
  //     }
  // }

  // def saveMap = Action(parse.json(maxLength = 1024 * 2000))
  // {
  //   request =>
  //     if (MapStorage.saveMap(GameMap.fromJson(request.body)) != 0)
  //     {
  //       println("ok!");
  //       Ok("""{"status": "ok"}""")
  //     }
  //     else
  //     {
  //       println("bad req!");
  //       BadRequest("""{"status": "error"}""")
  //     }
  // }

  // def createGame = Action(parse.json(maxLength = 1024 * 2000))
  // {
  //   request =>
  //     if (GameManager.create((request.body)) != 0)
  //     {
  //       Ok("""{"status": "ok"}""")
  //     }
  //     else
  //     {
  //       println("bad req!");
  //       BadRequest("""{"status": "error"}""")
  //     }
  // }

  // def websockettest = Action { implicit request =>
  //   Ok(views.html.websocket(1, 1))
  // }

  // def testCalc(x: Integer, y: Integer) = Action {
  //   DB.withConnection { implicit c =>

  //     println ("start")

  //     val time1 = System.nanoTime

  //     val result = SQL("""
  //       SELECT
  //           id
  //       FROM
  //         game_4.game_unit
  //       WHERE
  //         owner = 2 AND
  //         {spotting} - distance({x}, {y}, x, y) * 1 > hide
  //         AND
  //         (
  //           (
  //             SELECT
  //                 sum(t.concealment) as sum_concealment
  //             FROM
  //                 raytrace({x}, {y}, x, y) r
  //             JOIN
  //                 game_4.game_tile t
  //             ON
  //                 (r.x = t.x AND r.y = t.y)
  //           ) < MAX( (({spotting} - hide), (spot - {hide}))
  //         )
  //       """)
  //     .on('x -> x,
  //         'y -> y,
  //         'spotting -> 90,
  //         'hide -> 30)
  //     .as(int("id") *)

  //     println ((System.nanoTime - time1) / 1000)


  //     Ok(result.mkString(",\n"))
  //   }
  // }
}
