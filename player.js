var _ = require('underscore');

var redis = require('redis');

function Player(socket){
  var ready = false;
  var loaded = false;

  var currentGame = null;

  var zombie = false;

  this.inputs = [];

  this.socket = socket;
  if (!this.socket)
    throw "Player: socket must be provided!";

  this.id = socket.id;
  if (!this.id)
    throw "Player: id must be provided!";

  this.redisClient = redis.createClient();
  if (!this.redisClient)
    throw "Player: redisClient is not defined!";

  this.badge = null;

  this.position = { x: 0, y: 0 };

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

  this.isZombie = function(){
    return zombie;
  },

  this.becomeZombie = function(){
    zombie = true;
  },

  this.bufferInputs = function(inputs){
    var self = this;

    _.each(inputs, function(input){
      input.badge = self.badge;
      self.inputs.push(input);
    })
  };

  this.clearInputBuffer = function(){
    this.inputs = [];
  };

  this.broadcast = function(message, data){
    this.socket.broadcast.to(this.currentGameId()).emit(message, data);
  };

  this.updatePosition = function(x, y){
    this.position.x = x;
    this.position.y = y;
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