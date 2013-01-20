package controllers

import models._;
import play.api._
import play.api.mvc._
import play.api.libs.json.Json._

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def editor = Action {
    Ok(views.html.editor())
  }

  def loadMap(id: Long) = Action
  {
    request =>
    {
      MapStorage.loadMap(id)
      Ok("""{"status":"ok"}""")
    }
  }

  def saveMap = Action(parse.json(maxLength = 1024 * 2000))
  {
    request =>
      if (MapStorage.saveMap(GameMap.fromJson(request.body)) != 0)
      {
        println("ok!");
        Ok("""{"status": "ok"}""")
      }
      else
      {
        println("bad req!");
        BadRequest("""{"status": "error"}""")
      }
  }

  def createGame = Action(parse.json(maxLength = 1024 * 2000))
  {
    request =>
      if (GameCreator.create((request.body)) != 0)
      {
        println("Game created, maybe!");
        Ok("""{"status": "ok"}""")
      }
      else
      {
        println("bad req!");
        BadRequest("""{"status": "error"}""")
      }
  }

  def testCalc(x: Integer, y: Integer) = Action {
    DB.withConnection { implicit c =>

      println ("start")

      val time1 = System.nanoTime

      val result = SQL("""SELECT
                id
            FROM
              game_4.game_unit
            WHERE
              owner = 2 AND
              {spotting} - distance({x}, {y}, x, y) * 1 > hide
              AND
              (
                (
                      SELECT
                          sum(t.concealment) as sum_concealment
                      FROM
                          raytrace({x}, {y}, x, y) r
                      JOIN
                          game_4.game_tile t
                      ON
                          (r.x = t.x AND r.y = t.y)
                ) < ({spotting} - hide)
                OR
                (
                      SELECT
                          sum(t.concealment) as sum_concealment
                      FROM
                          raytrace({x}, {y}, x, y) r
                      JOIN
                          game_4.game_tile t
                      ON
                          (r.x = t.x AND r.y = t.y)
                ) < (spot - {hide})
              )
              """)
      .on('x -> x,
          'y -> y,
          'spotting -> 90,
          'hide -> 30)
      .as(int("id") *)

      println ((System.nanoTime - time1) / 1000)


      Ok(result.mkString(",\n"))
    }
  }
}
