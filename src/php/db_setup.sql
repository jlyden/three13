SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- TOOD: CREATE IF NOT EXISTS SCHEMA statement

CREATE IF NOT EXISTS TABLE `card` (
  `id` TINYINT NOT NULL,
  `suit` ENUM('Clubs', 'Diamonds', 'Hearts', 'Spades', 'Joker') NOT NULL,
  `value` TINYINT NOT NULL,
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Call script to populate card table - db_setup_card.sql

CREATE IF NOT EXISTS TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(500) NOTNULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP,
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS TABLE `game` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP,
  PRIMARY KEY (`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS TABLE `user_game` (
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `user_order` TINYINT NOT NULL,
  `user_score` SMALLINT NOT NULL DEFAULT 0,
  FOREIGN KEY (`game_id`)
  REFERENCES `game`(`id`)
  ON DELETE CASCADE
  FOREIGN KEY (`user_id`)
  REFERENCES `user`(`id`)
  ON DELETE SET NULL
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS `game_round` (
  `game_id` INT NOT NULL,
  `round_id` INT NOT NULL,
  `round_number` TINYINT NOT NULL,
  `end_of_round` BOOLEAN NOT NULL DEFAULT FALSE,
  `user_order_next` TINYINT NOT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP,
  FOREIGN KEY (`game_id`)
  REFERENCES `game`(`id`)
  ON DELETE CASCADE
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS `round_deck_card` (
  `round_id` INT NOT NULL,
  `card_id` TINYINT NOT NULL,
  FOREIGN KEY (`round_id`)
  REFERENCES `round`(`id`)
  ON DELETE CASCADE
  FOREIGN KEY (`card_id`)
  REFERENCES `card`(`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE IF NOT EXISTS `round_user_card` (
  `round_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `card_id` TINYINT NOT NULL,
  FOREIGN KEY (`round_id`)
  REFERENCES `round`(`id`)
  ON DELETE CASCADE
  FOREIGN KEY (`user_id`)
  REFERENCES `user`(`id`)
  ON DELETE CASCADE
  FOREIGN KEY (`card_id`)
  REFERENCES `card`(`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=utf8;
