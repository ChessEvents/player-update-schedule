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
    title: String,
    rating: String
});

var Player = mongoose.model('Player', playerSchema);

var list = [];
var counter =

fs.readFile( './data/player-data-all.xml', function ( err, data ) {

  parser.parseString(data, function ( err, result ) {

    for(var i = 0; i < result.playerslist.player.length; i++) {

      var item = {
        fideid: result.playerslist.player[i]
      };

      list.push(item);
    }
    console.log('Done.');
    addPlayers();
  });

});

function addPlayers() {

// don't try this at home:
//  Player.create(list);

  for(var i = 0; i < list.length; i++) {
    console.log(list[i].name.toString());
    //savePlayer(list[i]);
  }
}


function savePlayer(p) {

  var player = new Player({
    fideId: p.fideid[0].toString(),
    name: p.name[0].toString(),
    title: p.title[0].toString(),
    rating: parseInt(p.rating[0], 10).toString()
  });

  player.save(function (err, player) {
    if(err){
      return console.error(err);
    }
  });

}
