package models.events;

import play.api.libs.json._

class Event(val name: String, userid: Int, json: JsValue)
{
  var stopped = false;
  def stopPropagation() = { stopped = true };
  def isStopped() : Boolean = stopped;
}