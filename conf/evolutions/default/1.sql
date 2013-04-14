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

CREATE TABLE tile_member (
  "id" integer NOT NULL,
  "type" varchar(200) NOT NULL,
  "version" integer NOT NULL,
  "name" varchar(200) NOT NULL,
  "img" varchar(200) NOT NULL,
  "brush" varchar(200) DEFAULT NULL,
  "difficulty" smallint DEFAULT NULL,
  "hide" smallint DEFAULT NULL,
  "cover" smallint DEFAULT NULL,
  "concealment" smallint DEFAULT NULL,
  "height" smallint DEFAULT NULL,
  "traits" varchar(400) DEFAULT NULL,
  "effects" varchar(400) DEFAULT NULL,
  PRIMARY KEY ("id", "type")
);

INSERT INTO tile_member
  (id, type, version, name, img, brush, difficulty, hide, cover, concealment, height, traits, effects)
VALUES
  (1,  'element', 1, 'Small trees',          '/assets/textures/firtreessmall.png',          NULL, 0, 0, 0, 20, 2, '', ''),
  (2,  'element', 1, 'Large trees',          '/assets/textures/firtreesmany.png',           NULL, 0, 0, 0, 20, 3, '', ''),
  (4,  'element', 1, 'Undergrowth',          '/assets/textures/bushesmany.png',             NULL, 0, 0, 0, 10, 1, '', ''),
  (21, 'element', 1, 'Small houses',         '/assets/textures/cottage1.png',              NULL, 0, 0, 0, 150, 1, '', 'shadow'),
  (31, 'element', 1, 'Large houses',         '/assets/textures/rowhouses1.png',             NULL, 0, 0, 0, 300, 2, '', 'shadow'),
  (32, 'element', 1, 'Industrial buildings', '/assets/textures/hall.png',                   NULL, 0, 0, 0, 300, 2, '', 'shadow'),
  (41, 'element', 1, 'Dirt roads',           '/assets/textures/road1.png',                  NULL, 0, 0, 0, 0, 1, 'road, continuous', ''),
  (42, 'element', 1, 'Paved roads',          '/assets/textures/road2.png',                  NULL, 0, 0, 0, 0, 1, 'road, continuous', ''),
  (51, 'element', 1, 'Low rock wall',        '/assets/textures/rockwalls.png',              NULL, 0, 0, 0, 50, 1, 'wall, continuous, unique', 'shadow'),
  (52, 'element', 1, 'Bocage',               '/assets/textures/rockwalls2.png',             NULL, 0, 0, 0, 100, 1, 'wall, continuous, unique', 'shadow'),
  (53, 'element', 1, 'Hedge',                '/assets/textures/hedge.png',                  NULL, 0, 0, 0, 50, 1, 'wall, continuous, unique', 'shadow'),
  (61, 'element', 1, 'Boulders',             '/assets/textures/boulders.png',               '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 50, 1, '', ''),
  (1,  'texture', 1, 'Grass',                '/assets/textures/grass1.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 2, 1, '', ''),
  (5,  'texture', 1, 'Long grass',           '/assets/textures/grass2.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 10, 1, '', ''),
  (2,  'texture', 1, 'Bare ground',          '/assets/textures/grass3.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 2, 1, '', ''),
  (21, 'texture', 1, 'Rough ground',         '/assets/textures/rocks1.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 10, 1, '', 'border'),
  (31, 'texture', 1, 'Dirt',                 '/assets/textures/dirt1.png',                  '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 0, 1, '', 'border'),
  (41, 'texture', 1, 'Wheat',                '/assets/textures/field.png',                  '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 0, 1, '', 'border'),
  (42, 'texture', 1, 'Wheat',                '/assets/textures/field2.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 0, 1, '', 'border'),
  (43, 'texture', 1, 'Plowed field',         '/assets/textures/field3.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 0, 1, '', 'border'),
  (44, 'texture', 1, 'Ochard',               '/assets/textures/field4.png',                 '1,2,3,4,5,6,7,8,9,10,11,12', 0, 0, 0, 0, 1, '', 'border');

# --- !Downs

DROP TABLE tile_member;
DROP TABLE game_map;
DROP TABLE game_tile;
DROP TABLE game;
