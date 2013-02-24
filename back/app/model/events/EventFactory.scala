package models.events;

import play.api.libs.json._

object EventFactory
{
    def makeEvent(eventname: String, userid: Int, json: JsValue): Event =
    {
        eventname match
        {
            case move if move == "MoveEvent" => parseMoveEvents(userid, json)
        }
    }

    def parseMoveEvents(userid: Int, json: JsValue) : MoveRouteEvent =
    {
        println(json);
        var unitid: Int = (json \ "payload" \ "unitId").as[String].toInt
        var id: Int = (json \ "id").as[Int]
        var route: String = (json \ "payload" \ "moveroute").as[String]

        new MoveRouteEvent(
            id,
            userid,
            unitid,
            route.split(";").map(parseMoveEvent(userid, id,  unitid, _)).toList);
    }

    def parseMoveEvent(userid: Int, id: Int,  unitid: Int, args: String): MoveEvent =
    {
        args.split(",").map(_.toInt) match {
            case Array(x:Int, y:Int, tf:Int, uf:Int) => new MoveEvent(userid, id, unitid, x, y, tf, uf)
            case _ => throw new IllegalArgumentException("invalid arguments '"+args+"' suplied for MoveEvent")
        }
    }
}