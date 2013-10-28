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
   dest: __dirname + '/static',
   compile: function(string, filePath) {
      return stylus(string)
         .set('filename', filePath)
         .set('compress', true)
         .use(nib());
   }
}));
app.use('/static', express.static(__dirname + '/static'));

app.get(/\/(.*)/, function (req, res, matches) {
   res.render('index', {
      matches: matches
   });
});

/*
 * Database
 */

var db = new sqlite3.Database('records.db');

/*
 * HTTP Server
 */

var server = http.createServer(app).listen(8003);

/*
 * Socket IO server
 */

var io = socket_io.listen(server);

var hugePrimeConstant = 1000000007;

io.sockets.on('connection', function(socket) {
   socket.on('request', function(data) {
      db.all('SELECT term.value AS value, term_x_game.is_called AS is_called FROM game INNER JOIN term_x_game ON game.id = term_x_game.game_id INNER JOIN term ON term_x_game.term_id = term.id WHERE game.id = (?) ORDER BY ' + hugePrimeConstant + ' % (' + parseInt(hashStringToUInt16(data.seed)) + ' + term.id)', 1, function(err, rows) {
         io.sockets.emit('response', rows);
      });
   });
});

/*
 * Auxiliary functions
 */

function hashStringToUInt16(seed) {
   return Buffer.prototype.readUInt16LE.call(require('crypto').createHash('md5').update(seed + '').digest(), 0);
}
