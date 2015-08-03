require('./spec_helper');

describe("Player",function(){
  describe("when initializing", function(){
    context("when id is not provided", function(){
      var params = { id: null };

      it('throws an error', function(){
        (function(){
          var player = new Player(params);
        }).should.throw("Player: id must be provided!");
      });
    });

    context("when socket is not provided", function(){
      var params = null;

      it('throws an error', function(){
        (function(){
          var player = new Player(params);
        }).should.throw("Player: socket must be provided!");
      });
    });
  });
});