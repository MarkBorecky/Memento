--liquibase formatted sql
--changeset mborecki:1

CREATE TABLE flash_card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    value_a TEXT NOT NULL,
    value_b TEXT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(id)
);