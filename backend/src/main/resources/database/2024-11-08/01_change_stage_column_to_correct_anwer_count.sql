--liquibase formatted sql
--changeset mborecki:1

ALTER TABLE learning_flash_cards
DROP COLUMN stage;

ALTER TABLE learning_flash_cards
ADD COLUMN correct_answer_count INTEGER;
