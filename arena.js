var Lobby = require('./lobby');

function Arena(){
  this.playersBySocketId = {};

  this.lobby = new Lobby();

  this.checkInPlayer = function (player){
    if (!player.socket) throw "Player does not have a socket connection!";

    this.playersBySocketId[player.socket.id] = player;
  };

  this.checkOutPlayer = function(player){
    if (!player.socket) throw "Player does not have a socket connection!";

    this.playersBySocketId[player.socket.id] = null;
    player.redisClient.quit();

    delete this.playerBySocketId[player.socket.id];
    delete player;
  };

  this.isPlayerCheckedIn = function(player){
    return !!this.playersBySocketId[player.socket.id];
  };
}

module.exports = new Arena();