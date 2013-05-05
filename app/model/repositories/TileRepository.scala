package models.repositories;

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import models.tiles._
import play.api.libs.json._
import play.api.libs.json.Json._
import models.raytracing.TileDetailsForRaytrace

class TileRepository(gameid: Long) extends Repository(gameid)
{
    implicit def intToBool(i: Int) = if (i == 1) true else false

    val (width, height) = TileRepository.getMapDetails(gameid);

    val tiles: Array[(Byte,Byte,Byte)] = TileRepository.getTiles(gameid);

    val tileDefinition: TileDefinition = new TileDefinition();

    lazy val tileConcealments: Array[Short] = tiles.map(ActiveGameTile.getTileConcealment(_, tileDefinition)).toArray;

    def getTileDetailsForRaytrace(pos: (Int, Int)): TileDetailsForRaytrace =
    {
        val mask:Short = 2047;
        val tileid = getTileIdFromXY(pos)

        val bit = tileConcealments(tileid)
        val cont:Boolean = (bit >> 14)
        val height:Int = (bit >> 13)
        val concealment: Int = (bit & 2047)

        val tile = tiles(tileid);
        val elevation = tile._3.toInt
        val element = tile._2.toInt;

        new TileDetailsForRaytrace(pos, concealment, element, elevation, height, cont)
    }

    def getTileByXY(pos: (Int, Int)): Option[ActiveGameTile] =
    {
        val (x,y) = pos;
        if (x < 0 || y < 0 || x > width || y > height)
            None
        else
        {
            val tileid = getTileIdFromXY(pos);
            Some(ActiveGameTile.buildTile(tileid, pos, this.tiles(tileid), tileDefinition))
        }
    }

    def getTileElevationByXY(pos:(Int, Int)): Int =
    {
        val (x,y) = pos;
        if (x < 0 || y < 0 || x > width || y > height)
            0
        else
            tiles(getTileIdFromXY(pos))._3.toInt
    }

    def getTileIdFromXY(pos:(Int, Int)): Int =
    {
        val (x, y) = pos
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
            (row[Int]("texture").toByte, row[Int]("element").toByte, row[Int]("elevation").toByte)
          ).toArray;
        }
    }
}