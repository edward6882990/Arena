var chai = require('chai');
var Player = require('../player');

function SpecHelper(){
  chai.should();
  global.expect = chai.expect;
  global.Player = Player;
}

module.exports = new SpecHelper();
