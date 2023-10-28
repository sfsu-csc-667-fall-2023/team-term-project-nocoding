CREATE DATABASE GameDB;

USE GameDB;

CREATE TABLE Players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,

);

CREATE TABLE Cards (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    card_name VARCHAR(255),

);

CREATE TABLE Games (
    game_id INT PRIMARY KEY AUTO_INCREMENT,
    game_title VARCHAR(255),
    player_count INT,

);

CREATE TABLE PlayerGame (
    player_id INT,
    game_id INT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (game_id) REFERENCES Games(game_id),

);

CREATE TABLE DiscardPile (
    game_id INT,
    card_id INT,
    FOREIGN KEY (game_id) REFERENCES Games(game_id),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id),

);

CREATE TABLE PlayerHand (
    player_id INT,
    card_id INT,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (card_id) REFERENCES Cards(card_id),

);
