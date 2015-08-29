var chai = require('chai');
var spies = require('chai-spies');

var FixtureGenerator = require('./fixture_generator');

function SpecHelper(){
  global.chai = chai;

  chai.use(spies);
  chai.should();

  global.expect = chai.expect;
  global.FixtureGenerator = FixtureGenerator;

  global.generateRandomId = function(){
    return FixtureGenerator.generateRandomId();
  };

  global.generatePlayer = function(){
    return FixtureGenerator.generatePlayer();
  };

  global.cloneObject = function(object){
    var clone = {};

    for(each in object){
      if (object[each] instanceof Object){
        clone[each] = cloneObject(object[each]);
      } else {
        clone[each] = object[each];
      }
    }

    return clone;
  };
}

module.exports = new SpecHelper();
