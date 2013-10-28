PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS term_x_game;
DROP TABLE IF EXISTS term;
DROP TABLE IF EXISTS game_alias;
DROP TABLE IF EXISTS game;

CREATE TABLE game (
   id         INTEGER                        PRIMARY KEY
  ,name       TEXT    NOT NULL
	,UNIQUE(name)
);

CREATE TABLE game_alias (
	 id         INTEGER                        PRIMARY KEY
	,game_id    INTEGER NOT NULL
	,name       TEXT    NOT NULL
	,FOREIGN KEY(game_id) REFERENCES game(id)
	,UNIQUE(name)
);

CREATE TABLE term (
   id         INTEGER                        PRIMARY KEY
  ,value      TEXT    NOT NULL
);

CREATE TABLE term_x_game (
   term_id    INTEGER NOT NULL
  ,game_id    INTEGER NOT NULL
  ,FOREIGN KEY(term_id) REFERENCES term(id)
  ,FOREIGN KEY(game_id) REFERENCES game(id)
);
