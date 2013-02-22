package models.events;

import play.api.libs.json._

object EventFactory
{
    def makeEvent(eventname: String, userid: Int, json: JsValue): List[Event] =
    {
        eventname match
        {
            case move if move == "MoveEvent" => parseMoveEvents(userid, json)
            case _ => List.empty[Event]
        }
    }

    def parseMoveEvents(userid: Int, json: JsValue) : List[MoveEvent] =
    {
        var unitid: String = (json \ "payload" \ "unitId").as[String]
        var route: String = (json \ "payload" \ "moveroute").as[String]
        println(route);

        route.split(";").map(new MoveEvent(userid, unitid, _)).toList
    }
}