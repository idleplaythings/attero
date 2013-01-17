package controllers

import models._
import anorm._
import anorm.SqlParser._
import play.api.db._
import play.api.Play.current

object GameCreator
{
  def initializeGameDatabase(untis: List[Unit], map: GameMap)
  {
    DB.withTransaction { implicit c =>
      val gameid = SQL("""
        INSERT INTO Game (leftplayer, rightplayer)
        VALUES (1,2)""").executeInsert()

      SQL("""CREATE DATABASE Game_{gameid}""")
        .on('gameid -> gameid)
        .execute()

      SQL("""
        CREATE TABLE `Game_{gameid}.Units` (
          `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
          `owner` int(11) unsigned DEFAULT NULL,
          `type` int(11) DEFAULT NULL,
          `amount` int(11) DEFAULT NULL,
          `hide` int(11) DEFAULT NULL,
          `spot` int(11) DEFAULT NULL,
          `location` int(11) DEFAULT 0
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      """).on('gameid -> gameid)
          .execute()

      SQL("""
        CREATE TABLE `Game_{gameid}.GameTile` (
          `tileid` int(11) DEFAULT NULL,
          `x` int(11) DEFAULT 0,
          `y` int(11) DEFAULT 0,
          `texture` tinyint(4) DEFAULT NULL,
          `toffset` tinyint(4) DEFAULT NULL,
          `tmask` tinyint(4) DEFAULT NULL,
          `elevation` tinyint(4) DEFAULT NULL,
          `element` tinyint(4) DEFAULT NULL,
          `eoffset` tinyint(4) DEFAULT NULL,
          `evariance` tinyint(4) DEFAULT NULL,
          `eangle` tinyint(4) DEFAULT NULL,
          `concealment` tinyint(4) DEFAULT NULL,
          `cover` tinyint(4) DEFAULT NULL,
          `terrain` tinyint(4) DEFAULT NULL,
          `hide` tinyint(4) DEFAULT NULL,
          PRIMARY KEY (`tileid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
      """).on('gameid -> gameid)
          .execute()

    }
  }
}