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

    lazy val tiles: Map[Int, ActiveGameTile] = TileRepository.getTiles(gameid);

    def getTileByXY(x:Int, y:Int): ActiveGameTile =
    {
        this.tiles(getTileIdFromXY(x, y))
    }

    def getTileIdFromXY(x:Int, y:Int): Int =
    {
        (y * this.width) + x;
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

    def getTiles(gameid: Long): Map[Int, ActiveGameTile] =
    {
        val dbName = "game_"+gameid;

        DB.withConnection { implicit c =>
          val tileSql = SQL("""SELECT
            tileid,
            x,
            y,
            texture,
            elevation,
            element
          FROM """ +dbName+ """.game_tile
          ORDER BY tileid ASC""")

          tileSql().map(row =>
            (row[Int]("tileid"), ActiveGameTile.buildTile(row[Int]("tileid"), row[Int]("x"), row[Int]("y"), row[Int]("texture"), row[Int]("elevation"), row[Int]("element")))
          ).toMap;
        }
    }
}