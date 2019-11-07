CREATE TABLE `battleshipdb`.`BoardInfo` (
  `id` INT NOT NULL,
  `board_state_1` VARCHAR(100) NULL,
  `board_state_2` VARCHAR(100) NULL,
  `turn` TINYINT(2) NULL,
  `max_turn` INT NULL,
  `game_terminated` TINYINT(2) NULL,
  PRIMARY KEY (`id`));
