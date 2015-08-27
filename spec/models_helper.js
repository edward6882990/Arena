var Player = require('../player');
var Game   = require('../game');
var Lobby  = require('../lobby');
var Input  = require('../input');
var Events = require('../events');
var World  = require('../world');

function ModelsHelper(){
  global.Player = Player;
  global.Game   = Game;
  global.Lobby  = Lobby;
  global.Input  = Input;
  global.World  = World;
};

module.exports = new ModelsHelper();