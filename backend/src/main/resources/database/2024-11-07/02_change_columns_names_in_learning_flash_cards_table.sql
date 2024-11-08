--liquibase formatted sql
--changeset mborecki:2

ALTER TABLE learning_flash_cards
RENAME COLUMN lastCorrectAnswer to last_correct_answer;

ALTER TABLE learning_flash_cards
RENAME COLUMN nextAskingTime to next_asking_time;