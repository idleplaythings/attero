# Tasks schema

# --- !Ups

CREATE TABLE `GameMap` (
  `id` int(11) unsigned AUTO_INCREMENT,
  `name` varchar(256),
  `tiles` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

# --- !Downs

DROP TABLE `GameMap`;
