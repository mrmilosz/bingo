#!/usr/bin/env node

var express   = require('express'  )
  , http      = require('http'     )
  , socket_io = require('socket.io')
  , sqlite3   = require('sqlite3'  )
  , stylus    = require('stylus'   )
  , nib       = require('nib'      )
  ;

/*
 * Express app
 */

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger('dev'));
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

app.get(/^\/(.*)$/, function (req, res, matches) {
   var hugePrimeConstant = 1000000007;
   var seed = parseInt(hashStringToUInt16(req.params[0]));
   var query = '    SELECT  term.value AS value         \n' +
               '           ,term.id    AS id            \n' +
               '      FROM game                         \n' +
               'INNER JOIN term_x_game                  \n' +
               '        ON game.id = term_x_game.game_id\n' +
               'INNER JOIN term                         \n' +
               '        ON term_x_game.term_id = term.id\n' +
               '     WHERE game.id = (?)                \n' +
               '  ORDER BY ' + hugePrimeConstant + ' % (' + seed + ' + term.id)'
   db.all(query, 1, function(err, rows) {
      res.render('index', {
         rows: rows
      });
   });
});

/*
 * Database
 */

var db = new sqlite3.Database('records.db');

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
      io.sockets.emit('call', data);
   });
});

/*
 * Auxiliary functions
 */

function hashStringToUInt16(seed) {
   return Buffer.prototype.readUInt16LE.call(require('crypto').createHash('md5').update(seed + '').digest(), 0);
}
