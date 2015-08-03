var redis = require('redis');

function Player(socket){
  this.id          = socket.id;
  this.socket      = socket;
  this.redisClient = redis.createClient();
}

module.exports = Player;