package controllers

import models._;
import play.api._
import play.api.mvc._
import play.api.libs.json.Json._

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
}
