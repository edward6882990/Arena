var _ = require('underscore');

var Game = require('./game');

function Lobby(){
  var CLEAR_DELETED_GAMES_INTERVAL = 10000;
  var GAMES_PER_PAGE   = 10;
  var VALID_GAME_TYPES = ['private', 'public'];

  var games       = [];
  var gamesByType = {};
  var gamesById   = {};

  this.initialize = function(){
    var cleanDeletedGames = function(){
      _.each(games, function(game){
        if (game.istDeleted) _removeAllReferencesOfGame(game);
      });
    };

    setInterval(cleanDeletedGames, CLEAR_DELETED_GAMES_INTERVAL);
  };

  this.createGame = function(data){
    validateGameParams(data);

    var game = new Game(data);

    gamesByType[game.type] = gamesByType[game.type] ? gamesByType[game.type] : [];
    gamesByType[game.type].push(game);
    gamesById[game.id] = game;
    games.push(game);

    return game;
  };

  this.ejectPlayerFromCurrentGame = function(player){
    var game = player.currentGame();

    player.leaveCurrentGame();
    if(game.numOfPlayers() == 0) {
      this.destroyGame(game);
      game = null;
    }

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
    return games;
  };

  this.numOfAllGames = function(){
    return games.length;
  };

  this.gamesByPage = function(page){
    if (games.length < page * GAMES_PER_PAGE)
      return games;
    else if (games.length - page * GAMES_PER_PAGE < GAMES_PER_PAGE)
      return games.slice((page - 1) * GAMES_PER_PAGE);
    else
      return games.slice((page - 1) * GAMES_PER_PAGE, page * GAMES_PER_PAGE - 1);
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
    delete gamesById[game.id];

    gameIndexByType = gamesByType[game.type].indexOf(game);
    if(gameIndexByType > -1){
      gamesByType[game.type].splice(gameIndexByType, 1);
    }

    gameIndex = games.indexOf(game);
    if(gameIndex > -1){
      games.splice(gameIndex);
    }

    game = null;
  };

  this.initialize();
}

module.exports = Lobby;