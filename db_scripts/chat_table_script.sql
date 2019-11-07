CREATE TABLE `battleshipdb`.`Chat` (
  `id` INT NOT NULL,
  `game_id` INT NULL,
  `username` VARCHAR(100) NULL,
  `message` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `username_fk_idx` (`username` ASC),
  CONSTRAINT `username_fk`
    FOREIGN KEY (`username`)
    REFERENCES `battleshipdb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

