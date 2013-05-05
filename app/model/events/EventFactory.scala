package models.events;

import play.api.libs.json._

object EventFactory
{
    def makeEvent(eventName: String, eventId: Int, userid: Int, json: JsValue): Event =
    {
        eventName match
        {
            case move if move == "MoveEvent" => parseMoveEvents(userid, eventId, json);
            case turn if turn == "ChangeTurnEvent" => new ChangeTurnEvent(userid, eventId);
        }
    }

    def parseMoveEvents(userid: Int, eventId: Int, json: JsValue) : MoveRouteEvent =
    {
        var unitId: Int = (json \ "payload" \ "unitId").as[String].toInt
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