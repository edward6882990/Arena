var chai = require('chai');
var Player = require('../player');
var Game   = require('../game');
var Lobby  = require('../lobby');

function SpecHelper(){
  chai.should();
  global.expect = chai.expect;
  global.Player = Player;
  global.Game   = Game;
  global.Lobby  = Lobby;
  global.generateRandomId = function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}

module.exports = new SpecHelper();
