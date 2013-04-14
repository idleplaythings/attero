package models.repositories;

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import models.tiles._
import play.api.libs.json._
import play.api.libs.json.Json._

class TileRepository(gameid: Long) extends Repository(gameid)
{
    implicit def intToBool(i: Int) = if (i == 1) true else false

    val (width, height) = TileRepository.getMapDetails(gameid);

    val tiles: Array[(Byte,Byte,Byte)] = TileRepository.getTiles(gameid);

    lazy val tileConcealments: Array[Short] = tiles.map(ActiveGameTile.getTileConcealment(_)).toArray;

    def getTileConcealment(pos: (Int, Int)): (Int, Int, Int, Int, Boolean) =
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

        (concealment, element, elevation, height, cont)
    }

    def getTileByXY(pos: (Int, Int)): Option[ActiveGameTile] =
    {
        val (x,y) = pos;
        if (x < 0 || y < 0 || x > width || y > height)
            None
        else
        {
            val tileid = getTileIdFromXY(pos);
            Some(ActiveGameTile.buildTile(tileid, pos, this.tiles(tileid)))
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

    def getTileDefinitionForClient(): JsValue =
    {
        DB.withConnection { implicit c =>
          val tileSql = SQL("""
            SELECT
                id,
                type,
                name,
                img,
                brush,
                difficulty,
                hide,
                cover,
                concealment,
                height,
                traits,
                effects
            FROM
                tile_member
            ORDER BY id ASC""")();

            sqlTileDefToJson(tileSql);
        }
    }

    def sqlTileDefToJson(rows: Stream[anorm.SqlRow]): JsValue =
    {
        val members = rows.map(row =>
            JsObject(
              Seq(
                "id" -> JsNumber(row[Int]("id")),
                "type" -> JsString(row[String]("type")),
                "name" -> JsString(row[String]("name")),
                "img" -> JsString(row[String]("img")),
                "brush" -> JsString(row[Option[String]]("brush").getOrElse("")),
                "difficulty" -> JsNumber(row[Int]("difficulty")),
                "hide" -> JsNumber(row[Int]("hide")),
                "cover" -> JsNumber(row[Int]("cover")),
                "concealment" -> JsNumber(row[Int]("concealment")),
                "height" -> JsNumber(row[Int]("height")),
                "traits" -> JsString(row[String]("traits")),
                "effects" -> JsString(row[String]("effects"))
              )
            )
        ).toArray;

        Json.toJson(members)
    }
}