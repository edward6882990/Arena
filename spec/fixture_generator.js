require('./models_helper');

var Player = require('../player');
FixtureGenerator = {
  generateRandomNumber: function(exclusiveCap){
    return Math.floor(Math.random() * exclusiveCap);
  },

  generateRandomId: function(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },

  pickRandomValueFrom: function(values){
    return values[this.generateRandomNumber(values.length)];
  },

  generateRandomDirectionVectorValue: function(){
    return this.pickRandomValueFrom([-1, 0, 1]);
  },

  generateRandomBadge: function(){
    return this.pickRandomValueFrom([1, 2, 3, 4]);
  },

  generateRandomPositiveCoordinate: function(){
    return this.generateRandomNumber(100);
  },

  generateRandomNegativeCoordinate: function(){
    return -this.generateRandomNumber(100);
  },

  generateRandomCoordinate: function(){
    var isNegative = this.pickRandomValueFrom([-1, 1]) < 0;
    var coordinate = isNegative ? this.generateRandomNegativeCoordinate() : this.generateRandomPositiveCoordinate();
    return coordinate;
  },

  generateRandomPosition: function(){
    return {
      x: this.generateRandomCoordinate(),
      y: this.generateRandomCoordinate()
    };
  },

  generateRandomDirectionVector: function(){
    return {
      x: this.generateRandomDirectionVectorValue(),
      y: this.generateRandomDirectionVectorValue()
    };
  },

  generateInput: function(){
    return new Input({
      time       : new Date(),
      badge      : this.generateRandomBadge(),
      position   : this.generateRandomPosition(),
      directions : this.generateRandomDirectionVector()
    })
  },

  generatePlayer: function(){
    return new Player({ id: this.generateRandomId() });
  }
};

module.exports = FixtureGenerator;