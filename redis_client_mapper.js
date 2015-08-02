var redis = require('redis');

function RedisClientMapper(){
  this.map = {};

  this.firstOrCreateClientForSocket = function(socket){
    var client = this.map[socket.id];

    if(!client){
      client = redis.createClient();
      this.saveClientForSocket(socket, client);
    }

    return client;
  };

  this.saveClientForSocket = function(socket, client){
    this.map[socket.id] = client;
  };

  this.isSocketAlreadyHasClient = function(socket){
    return !!this.map[socket.id];
  };

  this.destroyClientForSocket = function(socket){
    this.map[socket.id] = null;
  };
}

module.exports = new RedisClientMapper();

