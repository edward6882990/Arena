var chai = require('chai');
var Player = require('../player');
var Game   = require('../game');

function SpecHelper(){
  chai.should();
  global.expect = chai.expect;
  global.Player = Player;
  global.Game   = Game;
}

module.exports = new SpecHelper();
