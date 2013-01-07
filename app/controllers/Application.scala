package controllers

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

	def loadMap = Action {
		Ok(views.html.gamemap())
	}

	def saveMap = Action(parse.json(maxLength = 1024 * 2000)) 
	{ 
		request => (request.body \ "name").asOpt[String].map 
		{ 
			name => Ok("Hello " + name)
		}
		.getOrElse 
		{
			BadRequest("Missing parameter [name]")
		}
	}
}
