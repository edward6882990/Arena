require('./spec_helper');

describe("Game", function(){
  describe("initializing", function(){
    context("when id is not provided", function(){
      var data = {
        id    : null,
        type  : 'private',
        owner : new Player({ id: 'random_id' })
      };

      it("throws an error", function(){
        (function(){
          var game = new Game(data);
        }).should.throw("data[id] must be provided!");
      });
    });

    context("when type is not provided", function(){
      var data = {
        id    : 'random_id',
        type  : null,
        owner : new Player({ id: 'random_id' })
      };

      it("throws an error", function(){
        (function(){
          var game = new Game(data);
        }).should.throw("data[type] must be provided!");
      });
    });

    context("when owner is not provided", function(){
      var data = {
        id    : 'random_id',
        type  : 'private',
        owner : null
      };

      it("throws an error", function(){
        (function(){
          var game = new Game(data);
        }).should.throw("data[owner] must be provided!");
      });
    });

    context("when owner is not a Player", function(){
      var data = {
        id    : 'random_id',
        type  : 'private',
        owner : {}
      };

      it("throws an error", function(){
        (function(){
          var game = new Game(data);
        }).should.throw("data[owner] must be Player!");
      });
    });
  });

  describe("isFull", function(){
    context("when the game has maximum number of players", function(){
      it("returns true", function(){
        var owner = new Player({ id: 'random_id' });
        var game = new Game({ id: owner.id, type: 'private', owner: owner});

        var player1 = new Player({ id: 'random_id2' });
        game.usherPlayer(player1);

        var player2 = new Player({ id: 'random_id3' });
        game.usherPlayer(player2);

        var player3 = new Player({ id: 'random_id4' });
        game.usherPlayer(player3);

        gameIsFull = game.isFull();

        expect(gameIsFull).to.equal(true);
      });
    });

    context("when the game does not have maximum number of players", function(){
      it("returns true", function(){
        var owner = new Player({ id: 'random_id' });
        var game = new Game({ id: owner.id, type: 'private', owner: owner});

        gameIsFull = game.isFull();

        expect(gameIsFull).to.equal(false);
      });
    });
  });

  describe("usherPlayer", function(){
    context("when the game is not full", function(){
      it("ushers the user into the game and return false");
    });

    context("when the game is full", function(){
      it("returns false");
    });
  });

  describe("ejectPlayer", function(){
    it("ejects the player from the game room");
  });
});
