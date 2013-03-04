package models.repositories;

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import controllers.GameManager
import models.tiles._

class TileRepository(gameid: Long) extends Repository(gameid)
{
    val (width, height) = TileRepository.getMapDetails(gameid);

    lazy val tiles: Array[(Byte,Byte,Byte)] = TileRepository.getTiles(gameid);

    def getTileByXY(pos: (Int, Int)): ActiveGameTile =
    {
        val (x, y) = pos
        val tileid = getTileIdFromXY(x,y)
        ActiveGameTile.buildTile(tileid, (x, y), this.tiles(tileid))
    }

    def getTileIdFromXY(x:Int, y:Int): Int =
    {
        (y * this.width) + x;
    }

    def getPositionFromTileId(i:Int): (Int, Int) =
    {
        val x = i % this.width
        val y = math.floor(i / this.height).toInt;
        return (x,y)
    }

}

object TileRepository
{
    def getMapDetails(gameid: Long): (Int, Int) =
    {
        val dbName = "game_"+gameid;

        DB.withConnection { implicit c =>
          SQL("""SELECT width, height
                   FROM """ +dbName+ """.game_map""")
            .as(parserGameDetails.singleOpt).get
        }
    }
    val parserGameDetails =
    {
        get[Int]("width") ~
        get[Int]("height") map {
          case width~height =>
            (width, height)
        }
    }

    def getTiles(gameid: Long): Array[(Byte,Byte,Byte)]=
    {
        val dbName = "game_"+gameid;

        DB.withConnection { implicit c =>
          val tileSql = SQL("""SELECT
            texture,
            elevation,
            element
          FROM """ +dbName+ """.game_tile
          ORDER BY tileid ASC""")

          tileSql().map(row =>
            (row[Int]("texture").toByte, row[Int]("elevation").toByte, row[Int]("element").toByte)
          ).toArray;
        }
    }
}