--liquibase formatted sql
--changeset mborecki:1

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    language_a TEXT NOT NULL,
    language_b TEXT NOT NULL
);