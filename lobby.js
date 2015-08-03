var Game = require('./game');

function Lobby(){
  var VALID_GAME_TYPES = ['private', 'public'];

  this.gamesByType = {};

  this.initialize = function(){
    for(i = 0; i < VALID_GAME_TYPES.length; i++){
      this.gamesByType[VALID_GAME_TYPES[i]] = [];
    }
  };

  this.createGame = function(data){
    validateGameParams(data);

    var game = new Game(data);
    this.gamesByType[game.type] = game;
  };

  this.destroyGame = function(id){
    var game = this.findGameById(id);

    if (game) delete game;
  };

  this.findGameById = function(id){
    var games = this.allGames();

    for(i = 0; i < games.length; i++){
      if(games[i].id == id) return games[i];
    }

    return null;
  };

  this.allGames = function(){
    var games = []

    for(i = 0; i < VALID_GAME_TYPES.length; i++){
      games = games.concat(this.gamesByType[VALID_GAME_TYPES[i]]);
    }

    return games;
  };

  // ============= Private ========================

  var validateGameParams = function(data){
    var gameType = data.type;

    if (!gameType)
      throw "data[gameType] must be specified!";

    if (!isValidGameType(gameType))
      throw "Game Type " + gameType + " is invalid!";
  };

  var isValidGameType = function(gameType){
    return VALID_GAME_TYPES.indexOf(gameType) > -1;
  };

  this.initialize();
}

module.exports = Lobby;