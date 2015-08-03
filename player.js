var redis = require('redis');

function Player(socket){
  this.socket = socket;
  if (!this.socket)
    throw "Player: socket must be provided!";

  this.id = socket.id;
  if (!this.id)
    throw "Player: id must be provided!";

  this.redisClient = redis.createClient();
  if (!this.redisClient)
    throw "Player: redisClient is not defined!";
}

module.exports = Player;