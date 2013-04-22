package models.tiles;

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current
import play.api.libs.json._
import play.api.libs.json.Json._

class TileDefinition
{
    def getTexture(id: Int): TileTexture =
    {
        this.tileTextures.get(id).asInstanceOf[TileTexture];
    }

    def getElement(id: Int): TileElement =
    {
        this.tileTextures.get(id).asInstanceOf[TileElement];
    }

    lazy private val tileElements: Map[Int, TileMember] = TileDefinition.getTileElements;

    lazy private val tileTextures: Map[Int, TileMember] = TileDefinition.getTileTextures;

}

object TileDefinition
{
    def getTileTextures: Map[Int, TileMember] =
    {
         DB.withConnection { implicit c =>
          val tileSql = SQL("""
            SELECT
                id,
                type,
                difficulty,
                hide,
                cover,
                concealment,
                height,
                traits,
            FROM
                tile_member
            WHERE
                type = 'texture'
            ORDER BY id ASC""")();

            resolveTileMembers(tileSql);
        }
    }

    def getTileElements: Map[Int, TileMember] =
    {
        DB.withConnection { implicit c =>
          val tileSql = SQL("""
            SELECT
                id,
                type,
                difficulty,
                hide,
                cover,
                concealment,
                height,
                traits,
            FROM
                tile_member
            WHERE
                type = 'element'
            ORDER BY id ASC""")();

            resolveTileMembers(tileSql);
        }
    }

    def resolveTileMembers(
        rows: Stream[anorm.SqlRow]): Map[Int, TileMember] =
    {
        rows.map(row =>
            (
                row[Int]("id"),
                TileMember.getTileMember(
                    row[Int]("id"),
                    row[String]("type"),
                    row[Int]("difficulty"),
                    row[Int]("hide"),
                    row[Int]("cover"),
                    row[Int]("concealment"),
                    row[Int]("height"),
                    row[String]("traits")
                )
            )
        ).toMap
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