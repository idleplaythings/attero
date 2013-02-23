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
        var unitid: Int = (json \ "payload" \ "unitId").as[String].toInt
        var route: String = (json \ "payload" \ "moveroute").as[String]
        println(route);

        route.split(";").map(parseMoveEvent(userid, unitid, _)).toList
    }

    def parseMoveEvent(userid: Int, unitid: Int, args: String): MoveEvent =
    {
        args.split(",").map(_.toInt) match {
            case Array(x:Int, y:Int, tf:Int, uf:Int) => new MoveEvent(userid, unitid, x, y, tf, uf)
            case _ => throw new IllegalArgumentException("invalid arguments '"+args+"' suplied for MoveEvent")
        }

    }
}