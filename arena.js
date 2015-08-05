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

    if (player.currentGameId) {
      var game = lobby.findGameById(player.currentGameId);
      game.ejectPlayer(player);
    }

    this.playersBySocketId[player.socket.id] = null;
    player.redisClient.quit();

    player = null;
  };

  this.isPlayerCheckedIn = function(player){
    return !!this.playersBySocketId[player.socket.id];
  };
}

module.exports = new Arena();