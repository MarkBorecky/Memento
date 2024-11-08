--liquibase formatted sql
--changeset mborecki:1

CREATE TABLE learning_flash_cards (
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    flash_card_id INTEGER NOT NULL,
    stage TEXT NOT NULL,
    lastCorrectAnswer INTEGER,
    nextAskingTime INTEGER,
    PRIMARY KEY (user_id, course_id, flash_card_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    FOREIGN KEY (flash_card_id) REFERENCES flash_cards(id) ON DELETE CASCADE
)