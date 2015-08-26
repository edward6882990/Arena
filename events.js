var WIDTH_FROM_CENTER_OF_CHARACTER = 25;
var HEIGHT_FROM_CENTER_OF_CHARACTER = 25;

Events = {
  directionOfContact: function(player, anotherPlayer){
    var differenceX = player.position.x - anotherPlayer.position.x;
    var differenceY = player.position.y - anotherPlayer.position.y;

    var direction = null;

    if (differenceX < 0 && Math.abs(differenceX) <= WIDTH_FROM_CENTER_OF_CHARACTER) {
      direction = "right";
    }

    if (differenceX > 0 && Math.abs(differenceX) <= WIDTH_FROM_CENTER_OF_CHARACTER) {
      direction = "left";
    }

    if (differenceY < 0 && Math.abs(differenceY) <= HEIGHT_FROM_CENTER_OF_CHARACTER) {
      direction = "down";
    }

    if (differenceY > 0 && Math.abs(differenceY) <= HEIGHT_FROM_CENTER_OF_CHARACTER) {
      direction = "up";
    }

    return direction;
  },

  contact: function(player, anotherPlayer){
    if (player.isZombie() && !anotherPlayer.isZombie()){
      this.convertIntoZombie(player, anotherPlayer);
    } else if (!player.isZombie() && anotherPlayer.isZombie()){
      this.convertIntoZombie(anotherPlayer, player);
    } else {
      doNothing();
    }
  },

  doNothing: function(){
  },

  convertIntoZombie: function(zombiePlayer, convertedPlayer){
    zombiePlayer.socket.emit('convert-human-into-zombie');
    convertedPlayer.socket.emit('converted-into-zombie');

    zombiePlayer
      .broadcast('someone-converted-into-zombie', { player: convertedPlayer.badge });
  }
};

module.exports = Events;