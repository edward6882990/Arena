var _ = require('underscore');

var Input  = require('./input');
var Events = require('./events');

function World(players){
  var UPDATE_INTERVAL = 100;

  this.players = players;

  this.initialize = function(){
    this.interval = setInterval(this.update, UPDATE_INTERVAL);
  };

  this.update = function(){
    var inputData = _getInputData(this.players);

    while(inputs.length > 0){
      var inputDatum = inputData.pop();
      var player = this.findPlayerByBadge(inputDatum.badge);

      executeInputForPlayer(player, inputDatum)
    }
  };

  this.executeInputForPlayer = function(player, inputDatum){
    var input = new Input(inputDatum);
    var isMovable = true;
    var otherPlayers = this.getOtherPlayers(player);

    _.each(otherPlayers, function(anotherPlayer){
      if (input.direction == Events.directionOfContact(player, anotherPlayer)){
        Event.contact(player, anotherPlayer);
        isMovable = false;
      }
    });

    if (isMovable) player.updatePosition(input.position);
  }

  this.getOtherPlayers = function(p){
    var others = [];
    var world = this;

    _.each(this.players, function(player){
      if (p.id != player.id) others.push(player);
    });

    world = null;

    return others;
  };

  this.findPlayerByBadge = function(badge){
    _.findWhere(this.players, { badge: badge });
  }

  this.destroy = function(){
    clearInterval(this.invterval);
  };

  // ============ Private ==============


  function _getInputData(players){
    var inputData = []

    _.each(players, function(player){
      inputs += player.inputs;

      player.clearInputBuffer();
    });

    inputData.sort(function(a,b){
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    return inputData;
  }
}