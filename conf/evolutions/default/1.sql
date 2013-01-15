# Tasks schema

# --- !Ups

CREATE TABLE `GameMap` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT '',
  `width` tinyint(4) unsigned DEFAULT NULL,
  `height` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `GameTile` (
  `mapid` int(11) NOT NULL,
  `tileid` int(11) DEFAULT NULL,
  `texture` tinyint(4) DEFAULT NULL,
  `toffset` tinyint(4) DEFAULT NULL,
  `tmask` tinyint(4) DEFAULT NULL,
  `elevation` tinyint(4) DEFAULT NULL,
  `element` tinyint(4) DEFAULT NULL,
  `eoffset` tinyint(4) DEFAULT NULL,
  `evariance` tinyint(4) DEFAULT NULL,
  `eangle` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`mapid`, `tileid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# --- !Downs

DROP TABLE `GameMap`;
DROP TABLE `GameTile`;
