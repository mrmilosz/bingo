#!/usr/bin/env node

var express   = require('express'  )
  , http      = require('http'     )
  , socket_io = require('socket.io')
  , sqlite3   = require('sqlite3'  )
  , stylus    = require('stylus'   )
  , nib       = require('nib'      )
  ;

/*
 * Database
 */

sqlite3.verbose();
var db = new sqlite3.Database('records.db');

/*
 * Express app
 */

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.compress());
app.use(express.logger('dev'));
app.use(express.favicon(__dirname + '/static/favicon.ico'));
app.use(stylus.middleware({
   src: __dirname + '/styles',
   dest: __dirname,
   compile: function(string, filePath) {
      return stylus(string)
         .set('filename', filePath)
         .set('compress', true)
         .use(nib());
   }
}));
app.use('/static', express.static(__dirname + '/static'));

// If the request subdomain does not correspond to a game, throw an error
app.use(function(request, response, next) {
   var gameName = request.headers.host.split('.')[0];
   var query = '   SELECT game.name                               \n' +
               '     FROM game                                    \n' +
               'LEFT JOIN game_alias                              \n' +
               '       ON game.id = game_alias.game_id            \n' +
               '    WHERE game.name = (?) OR game_alias.name = (?)\n' +
               ' GROUP BY game.id                                   ';
   db.all(query, [gameName, gameName], function(error, rows) {
      if (error) {
         response.render('error', {
            error: 'database error: ' + error.toString()
         });
      }
      else if (rows.length === 0) {
         response.render('error', {
            error: 'no game named ' + gameName + ' exists'
         });
      }
      else {
         next();
      }
   });
});

app.get('/', function(request, response) {
   response.render('index');
});

app.get(/^\/(.+)$/, function (request, response) {
   var gameName = request.headers.host.split('.')[0];
   var hugePrimeConstant = 1000000007;
   var seed = parseInt(hashStringToUInt16(request.params[0]));
   var query = '    SELECT  term.value AS value                    \n' +
               '           ,term.id    AS id                       \n' +
               '           ,game.name  AS game_name                \n' +
               '      FROM game                                    \n' +
               'INNER JOIN term_x_game                             \n' +
               '        ON game.id = term_x_game.game_id           \n' +
               'INNER JOIN term                                    \n' +
               '        ON term_x_game.term_id = term.id           \n' +
               ' LEFT JOIN game_alias                              \n' +
               '        ON game.id = game_alias.game_id            \n' +
               '     WHERE game.name = (?) OR game_alias.name = (?)\n' +
               '  GROUP BY term.id                                 \n' +
               '  ORDER BY ' + hugePrimeConstant + ' % (' + seed + ' + term.id)';
   db.all(query, [gameName, gameName], function(error, rows) {
      if (rows.length > 0) {
         response.render('board', {
            gameName: rows[0].game_name,
            rows: rows
         });
      }
      else {
         response.render('error', {
            error: 'game ' + gameName + ' has no terms'
         });
      }
   });
});

/*
 * HTTP server
 */

var server = http.createServer(app).listen(8003);

/*
 * Socket IO server
 */

var io = socket_io.listen(server);

io.sockets.on('connection', function(socket) {
   socket.on('call', function(data) {
      socket.broadcast.to(socket.roomName).emit('call', data);
   });

   socket.on('join', function(data) {
      socket.join(data.roomName);
      socket.roomName = data.roomName;
   });
});

/*
 * Auxiliary functions
 */

function hashStringToUInt16(seed) {
   return Buffer.prototype.readUInt16LE.call(require('crypto').createHash('md5').update(seed + '').digest(), 0);
}
