--liquibase formatted sql
--changeset mborecki:1

CREATE TABLE course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    languageA TEXT NOT NULL,
    languageB TEXT NOT NULL
);