-- Create 25 terms
INSERT INTO term (value) VALUES ('Curated list');
INSERT INTO term (value) VALUES ('Database changes');
INSERT INTO term (value) VALUES ('Coffee?');
INSERT INTO term (value) VALUES ('Pow-wow');
INSERT INTO term (value) VALUES ('Moombahton');
INSERT INTO term (value) VALUES ('The power of');
INSERT INTO term (value) VALUES ('Cheermixes');
INSERT INTO term (value) VALUES ('Root context');
INSERT INTO term (value) VALUES ('Push to live');
INSERT INTO term (value) VALUES ('Broken on bugs');
INSERT INTO term (value) VALUES ('Pusha crate');
INSERT INTO term (value) VALUES ('Party Bangaz');
INSERT INTO term (value) VALUES ('Education page');
INSERT INTO term (value) VALUES ('Looks like ass');
INSERT INTO term (value) VALUES ('Diplo');
INSERT INTO term (value) VALUES ('Metrics');
INSERT INTO term (value) VALUES ('A/B testing');
INSERT INTO term (value) VALUES ('Wash!');
INSERT INTO term (value) VALUES ('Where you at?');
INSERT INTO term (value) VALUES ('Mixes to encode');
INSERT INTO term (value) VALUES ('It is what it is');
INSERT INTO term (value) VALUES ('Party room key');
INSERT INTO term (value) VALUES ('Small fixes');
INSERT INTO term (value) VALUES ('Mechanical turk');
INSERT INTO term (value) VALUES ('Give us their emails');

-- Create a game 'legitmix' with alias 'bingo'
INSERT INTO game (name) VALUES ('legitmix');
INSERT INTO game_alias (game_id, name)
     SELECT  id      AS game_id
            ,'bingo' AS name
       FROM game
      WHERE game.name = 'legitmix'
            ;

-- Add all 25 terms to the game 'legitmix'
INSERT INTO term_x_game (term_id, game_id)
     SELECT  term.id AS term_id
            ,game.id AS game_id
       FROM term
 INNER JOIN game
      WHERE game.name = 'legitmix'
            ;
