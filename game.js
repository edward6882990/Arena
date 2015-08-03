function Game(data){
  // TODO: May change it so this is adjustable
  var MAX_NUM_PLAYERS = 4;
  var players = [];

  this.owner   = null;

  this.initialize = function(){
    validateGameParams(data);

    this.id   = data.id;
    this.type = data.type
    this.owner = data.owner;

    this.usherPlayer(this.owner);
  };

  this.isFull = function(){
    return players.length >= MAX_NUM_PLAYERS;
  };

  this.usherPlayer = function(player){
    if (this.isFull()){
      return false;
    } else {
      players.push(player);
      return true;
    }
  };

  this.ejectPlayer = function(player){
    for(i = 0; i < players.length; i++){
      if(players[i].socket.id == player.socket.id){
        this.player[i].slice(i, 1);
        break;
      }
    }
  };

  this.numOfPlayers = function(){
    return players.length;
  };

  // =============== Private =================

  var validateGameParams = function(data){
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