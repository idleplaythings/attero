package models

import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

case class GameTile(
  texture: Short,
  tOffset: Short,
  tMask: Short,
  elevation: Short,
  element: Short,
  eOffset: Short,
  eVariance: Short,
  eAngle: Short
)
{
  override def toString: String =
  {
    this.texture + ","
    + this.tOffset + ","
    + this.tMask + ","
    + this.elevation + ","
    + this.element + ","
    + this.eOffset + ","
    + this.eVariance + ","
    + this.eAngle + ""
  }
}

object GameTile
{
  def fromString(serialized: String) : GameTile =
  {
    val l: Array[Short] = serialized.split(",").map(_.toShort)
    GameTile(l(0), l(1), l(2),l(3), l(4), l(5), l(6), l(7))
  }

  def serialize(tiles: List[GameTile]): String =
  {
    tiles.map(_.toString).mkString(";")
  }

  val parserGameTiles = {
    get[Short]("texture") ~
    get[Short]("toffset") ~
    get[Short]("tmask") ~
    get[Short]("elevation") ~
    get[Short]("element") ~
    get[Short]("eoffset") ~
    get[Short]("evariance") ~
    get[Short]("eangle") map {
      case texture~toffset~tmask~elevation~element~eoffset~evariance~eangle =>
        GameTile(texture, toffset, tmask, elevation, element, eoffset, evariance, eangle)
    }
  }

  def load(mapid: Long): List[GameTile] =
  {
    DB.withConnection { implicit c =>
      SQL("""SELECT
            texture,
            toffset,
            tmask,
            elevation,
            element,
            eoffset,
            evariance,
            eangle
          FROM GameTile
          WHERE mapid = {mapid}
          ORDER BY tileid""")
      .on('mapid -> mapid)
      .as(parserGameTiles *)
      }
  }
}