package models;
import play.api.libs.json._

trait MessageSender
{
    var players: Map[Int, PlayerInGame];

    def sendMessageToPlayer(userid: Int, msg: JsValue)
    {
        if (players.contains(userid))
        {
            players(userid).channel.push(msg);
        }
    }
}