var redis = require('redis');

function Player(socket){
  var ready = false;
  var loaded = false;

  var currentGame = null;

  this.socket = socket;
  if (!this.socket)
    throw "Player: socket must be provided!";

  this.id = socket.id;
  if (!this.id)
    throw "Player: id must be provided!";

  this.redisClient = redis.createClient();
  if (!this.redisClient)
    throw "Player: redisClient is not defined!";

  // ========== Actions ============

  this.resetStatus = function(){
    ready = false;
    loaded = false;
    currentGame = null;
  };

  this.setLoaded = function(){
    loaded = true;
  };

  this.setReady = function(){
    ready = true;
  };

  this.currentGameId = function(){
    return currentGame ? currentGame.id : null;
  };

  this.setCurrentGame = function(game){
    currentGame = game;
  };

  this.leaveCurrentGame = function(){
    if (currentGame)
      currentGame.ejectPlayer(this);

    this.resetStatus();
  };

  this.currentGame = function(){
    return currentGame;
  };

  // ============ Statuses ============

  this.isInGame = function(){
    return !!currentGame;
  };

  this.isLoaded = function(){
    return loaded;
  };

  this.isReady = function(){
    return ready;
  };
}

module.exports = Player;