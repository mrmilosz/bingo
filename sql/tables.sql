PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS term_x_game;
DROP TABLE IF EXISTS term;
DROP TABLE IF EXISTS game;

CREATE TABLE game (
   id         INTEGER                        PRIMARY KEY
  ,board_size INTEGER NOT NULL
);

CREATE TABLE term (
   id         INTEGER                        PRIMARY KEY
  ,value      TEXT    NOT NULL
);

CREATE TABLE term_x_game (
   term_id    INTEGER NOT NULL
  ,game_id    INTEGER NOT NULL
  ,is_called  BOOLEAN NOT NULL DEFAULT false
  ,FOREIGN KEY(term_id) REFERENCES term(id)
  ,FOREIGN KEY(game_id) REFERENCES game(id)
);
