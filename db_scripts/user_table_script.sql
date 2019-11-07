CREATE TABLE `battleshipdb`.`User` (
  `id` VARCHAR(100) NOT NULL,
  `wins` INT NULL,
  `losses` INT NULL,
  `chat_id` INT NOT NULL,
  PRIMARY KEY (`id`));
