--liquibase formatted sql
--changeset mborecki:1

Alter TABLE users drop column login;
