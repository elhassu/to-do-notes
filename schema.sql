CREATE DATABASE to_do_notes;

USE to_do_notes;

CREATE TABLE
    users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    passwords (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULl FOREIGN KEY REFERENCES users (id),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        identifier VARCHAR(36) NOT NULL,
        user_id INT NOT NULL FOREIGN KEY REFERENCES users (id),
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );

CREATE TABLE
    notes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW ()
    );