# Tasks schema

# --- !Ups

CREATE TABLE game_map (
  "id" serial,
  "name" char(256) DEFAULT '',
  "width" smallint DEFAULT NULL,
  "height" smallint DEFAULT NULL,
  PRIMARY KEY ("id")
);


CREATE TABLE game_tile (
  "mapid" integer NOT NULL,
  "tileid" integer DEFAULT NULL,
  "texture" smallint DEFAULT NULL,
  "toffset" smallint DEFAULT NULL,
  "tmask" smallint DEFAULT NULL,
  "elevation" smallint DEFAULT NULL,
  "element" smallint DEFAULT NULL,
  "eoffset" smallint DEFAULT NULL,
  "evariance" smallint DEFAULT NULL,
  "eangle" smallint DEFAULT NULL,
  PRIMARY KEY ("mapid", "tileid")
);

CREATE TABLE game (
  "id" serial,
  "leftplayer" integer DEFAULT NULL,
  "rightplayer" integer DEFAULT NULL,
  PRIMARY KEY ("id")
);

# --- !Downs

DROP TABLE game_map;
DROP TABLE game_tile;
DROP TABLE game;
