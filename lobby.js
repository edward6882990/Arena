var Game = require('./game');

function Lobby(){
  var VALID_GAME_TYPES = ['private', 'public'];

  var gamesByType = {};
  var gamesById   = {};

  this.createGame = function(data){
    validateGameParams(data);

    var game = new Game(data);
    gamesByType[game.type] = gamesByType[game.type] ? gamesByType[game.type] : [];
    gamesByType[game.type].push(game);
    gamesById[game.id] = game;

    return game;
  };

  this.destroyGame = function(game){
    _removeAllReferencesOfGame(game);
  };

  this.findGameById = function(id){
    return gamesById[id];
  };

  this.findGamesByType = function(type){
    return gamesByType[type];
  };

  this.allGames = function(){
    var games = []

    for(i = 0; i < VALID_GAME_TYPES.length; i++){
      games = games.concat(
          gamesByType[VALID_GAME_TYPES[i]] ? gamesByType[VALID_GAME_TYPES[i]] : []);
    }

    return games;
  };

  this.clearLobby = function(){
    var games = this.allGames();

    for(i = 0; i < games.length; i++){
      this.destroyGame(games[i]);
    }
  };

  // ============= Private ========================

  var validateGameParams = function(data){
    var gameType = data.type;

    if (!gameType)
      throw "data[type] must be specified!";

    if (!isValidGameType(gameType))
      throw "Game Type " + gameType + " is invalid!";

    var gameId = data.id;

    if (!gameId)
      throw "data[id] must be provided!";

    var owner = data.owner;

    if (!owner)
      throw "data[owner] must be provided!";
  };

  var isValidGameType = function(gameType){
    return VALID_GAME_TYPES.indexOf(gameType) > -1;
  };

  var _removeAllReferencesOfGame = function(game){
    gamesById[game.id] = null;

    gameIndexByType = gamesByType[game.type].indexOf(game);
    if(gameIndexByType > -1){
      gamesByType[game.type].splice(gameIndexByType, 1);
    }

    game = null;
  };
}

module.exports = Lobby;