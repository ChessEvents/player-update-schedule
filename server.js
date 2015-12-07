var connect     = require('connect'),
    serveStatic = require('serve-static'),
    fs          = require('fs'),
    xml2js      = require('xml2js'),
    util        = require('util'),
    inspect     = require('eyes').inspector({styles: {all: 'magenta'}}),
    mongoose = require('mongoose');


connect().use( serveStatic( __dirname ) ).listen( 8080 );

mongoose.connect('mongodb://localhost/chess_players');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.info('yey');
});

// Logging initialization
console.log('Run player download');

var parser = new xml2js.Parser();

var playerSchema = mongoose.Schema({
    fideId: String,
    name: String,
    rating: String,
    title: String
});

var Player = mongoose.model('Player', playerSchema);

fs.readFile( './data/player-data-all.xml', function ( err, data ) {

  parser.parseString(data, function ( err, result ) {

    for(var i = 0; i < result.playerslist.player.length; i++) {

      var item = result.playerslist.player[i];

      var player = new Player({
        fideId: item.fideid[0],
        name: item.name[0],
        title: item.title[0],
        rating: parseInt(item.rating[0], 10)
      });
      player.save();
      console.log('new player added! ' + player.name);
    }
    console.log('Done.');
  });

});
