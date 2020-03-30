SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- TOOD: CREATE IF NOT EXISTS SCHEMA statement

CREATE IF NOT EXISTS TABLE `game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_count` int(2) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS `round` (
  `game_id` int(11) NOT NULL,
  `round` int(11) NOT NULL,
  `end_of_round` boolean NOT NULL DEFAULT FALSE,
  `deck` varchar(500) NOT NULL,
  `user_order_next` int(2) NOT NULL
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp,
  FOREIGN KEY (`game_id`)
  REFERENCES `game`(`id`)
  ON DELETE CASCADE
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS TABLE `game_user` (
  `game_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_order` int(2) NOT NULL,
  `user_score` int(11) NOT NULL DEFAULT 0,
  `user_hand` varchar(500) NOT NULL
  FOREIGN KEY (`game_id`)
  REFERENCES `game`(`id`)
  ON DELETE CASCADE
  FOREIGN KEY (`user_id`)
  REFERENCES `user`(`id`)
  ON DELETE SET NULL
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
