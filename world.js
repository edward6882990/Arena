var _ = require('underscore');

var Input  = require('./input');
var Events = require('./events');

function World(players){
  var UPDATE_INTERVAL = 100;

  this.players = players;

  this.initialize = function(){
    this._iterate();

    this.broadcast('game:start');
  };

  this.update = function(){
    var inputData = _getInputData(this.players);

    var executedInputs = [];

    while(inputData.length > 0){
      try {
        var inputDatum = inputData.pop();
        var player = this.findPlayerByBadge(inputDatum.badge);

        this.executeInputForPlayer(player, inputDatum)

        executedInputs.push(inputDatum);
      } catch(err){
      }
    }

    this.broadcast('server:world:update', executedInputs);
  };

  this.executeInputForPlayer = function(player, inputDatum){
    var input = new Input(inputDatum);
    var isMovable = true;
    var world = this;

    _.each(this.players, function(anotherPlayer){
      if (player.id == anotherPlayer.id) return;

      if (input.directions.indexOf(Events.directionOfContact(player, anotherPlayer)) > -1){
        Events.contact(player, anotherPlayer);
        isMovable = false;
      }
    });

    if (isMovable) player.updatePosition(input.position.x, input.position.y);

    world = null;
  }

  this.findPlayerByBadge = function(badge){
    return _.findWhere(this.players, { badge: badge });
  }

  this.pause = function(){
    clearInterval(this.interval);
  };

  this.resume = function(){
    this._iterate();
  };

  this.destroy = function(){
    clearInterval(this.invterval);
  };

  // ============ Private ==============

  this._iterate = function(){
    this.interval = setInterval(this.update, UPDATE_INTERVAL);
  };

  this.broadcast = function(message, data){
    _.each(this.players, function(player){
      player.socket.emit(message, data);
    });
  };

  function _getInputData(players){
    var inputData = [];

    _.each(players, function(player){
      inputData = inputData.concat(player.inputs);

      player.clearInputBuffer();
    });

    inputData.sort(function(a,b){
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return inputData;
  }

  this.initialize();
}

module.exports = World;