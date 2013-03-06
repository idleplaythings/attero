package models.events;

import play.api.libs.json._

object EventFactory
{
    def makeEvent(eventName: String, userid: Int, json: JsValue): Event =
    {
        eventName match
        {
            case move if move == "MoveEvent" => parseMoveEvents(userid, json)
        }
    }

    def parseMoveEvents(userid: Int, json: JsValue) : MoveRouteEvent =
    {
        println(json);
        var unitId: Int = (json \ "payload" \ "unitId").as[String].toInt
        var eventId: Int = (json \ "id").as[Int]
        var route: String = (json \ "payload" \ "moveroute").as[String]

        new MoveRouteEvent(
            userid,
            eventId,
            unitId,
            route.split(";").map(parseMoveEvent(userid, eventId, unitId, _)).toList);
    }

    def parseMoveEvent(userid: Int, id: Int,  unitid: Int, args: String): MoveEvent =
    {
        args.split(",").map(_.toInt) match {
            case Array(x:Int, y:Int, tf:Int, uf:Int) => new MoveEvent(userid, id, unitid, x, y, tf, uf)
            case _ => throw new IllegalArgumentException("invalid arguments '"+args+"' suplied for MoveEvent")
        }
    }
}