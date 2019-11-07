CREATE TABLE `battleshipdb`.`GameRoom` (
  `id` INT NOT NULL,
  `player_1` VARCHAR(100) NULL,
  `player_2` VARCHAR(100) NULL,
  `board_id` INT NULL,
  `chat_lobby_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `player_1_fk_idx` (`player_1` ASC),
  INDEX `player_2_fk_idx` (`player_2` ASC),
  INDEX `chat_lobby_id_idx` (`chat_lobby_id` ASC),
  CONSTRAINT `player_1_fk`
    FOREIGN KEY (`player_1`)
    REFERENCES `battleshipdb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `player_2_fk`
    FOREIGN KEY (`player_2`)
    REFERENCES `battleshipdb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chat_lobby_id_fk`
    FOREIGN KEY (`chat_lobby_id`)
    REFERENCES `battleshipdb`.`Chat` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `board_id_fk`
    FOREIGN KEY (`board_id`)
    REFERENCES `battleshipdb`.`BoardInfo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
