var _ = require('underscore');

var World = require('./world');

function Game(data){
  // TODO: May change it so this is adjustable
  var MAX_NUM_PLAYERS = 4;
  var players = [];

  this.owner     = null;
  this.isStarted = false;

  this.initialize = function(){
    _validateGameParams(data);

    this.id   = data.id;
    this.type = data.type
    this.owner = data.owner;

    this.usherPlayer(this.owner);
  };

  this.usherPlayer = function(player){
    if (this.isFull()){
      return false;
    } else {
      player.setCurrentGame(this);
      players.push(player);
      return true;
    }
  };

  this.ejectPlayer = function(player){
    for(i = 0; i < players.length; i++){
      if(players[i].socket.id == player.socket.id){
        player.setCurrentGame(null);
        players.splice(i, 1);

        if(!players.length == 0)
          this.owner = players[0];

        break;
      }
    }
  };

  this.numOfPlayers = function(){
    return players.length;
  };


  this.allPlayers = function(){
    return players;
  };

  // ============= Statuses =================

  this.isFull = function(){
    return players.length >= MAX_NUM_PLAYERS;
  };

  this.isPlayerInGame = function(player){
    for(i = 0; i < players.length; i++){
      if(players[i].id == player.id) return true;
    }

    return false;
  };

  this.isAllPlayerReady = function(){
    for(i = 0; i < players.length; i++){
      if (!players[i].ready) return false;
    }

    return true;
  };

  this.isAllPlayerLoaded = function(){
    for(i = 0; i < players.length; i++){
      if (!players[i].loaded) return false;
    }

    return true;
  };

  this.start = function(){
    var badges = _shuffle([1,2,3,4]);

    _.each(players, function(player){
      var badge = badges.pop();

      player.badge = badge;
    });

    this.world = new World(players);

    this.isStarted = true;
  };

  this.end = function(){
    this.world.destroy();

    this.isEnded = true;
  };

  // =============== Private =================

  var _shuffle = function(array){
    var counter = array.length, temp, index;

    while (counter > 0) {
      index = Math.floor(Math.random() * counter);

      counter--;

      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  };


  var _validateGameParams = function(data){
    if (!data.id)
      throw "data[id] must be provided!";

    if (!data.type)
      throw "data[type] must be provided!";

    if (!data.owner)
      throw "data[owner] must be provided!";

    if (!(data.owner.constructor.name == 'Player'))
      throw "data[owner] must be Player!";
  };

  this.initialize();
}

module.exports = Game;