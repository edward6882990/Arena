require('./spec_helper');

describe("Game", function(){
  describe("initializing", function(){
    context("when id is not provided", function(){
      var data = {
        id    : null,
        type  : 'private',
        owner : new Player({ id: generateRandomId() })
      };

      it("throws an error", function(){
        (function(){
          var game = new Game(data);
        }).should.throw("data[id] must be provided!");
      });
    });

    context("when type is not provided", function(){
      var data = {
        id    : generateRandomId(),
        type  : null,
        owner : new Player({ id: generateRandomId() })
      };

      it("throws an error", function(){
        (function(){
          var game = new Game(data);
        }).should.throw("data[type] must be provided!");
      });
    });

    context("when owner is not provided", function(){
      var data = {
        id    : generateRandomId(),
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
        id    : generateRandomId(),
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
        var owner = new Player({ id: generateRandomId() });
        var game = new Game({ id: owner.id, type: 'private', owner: owner});

        var player1 = new Player({ id: generateRandomId() });
        game.usherPlayer(player1);

        var player2 = new Player({ id: generateRandomId() });
        game.usherPlayer(player2);

        var player3 = new Player({ id: generateRandomId() });
        game.usherPlayer(player3);

        gameIsFull = game.isFull();

        expect(gameIsFull).to.equal(true);
      });
    });

    context("when the game does not have maximum number of players", function(){
      it("returns true", function(){
        var owner = new Player({ id: generateRandomId() });
        var game = new Game({ id: owner.id, type: 'private', owner: owner});

        gameIsFull = game.isFull();

        expect(gameIsFull).to.equal(false);
      });
    });
  });

  describe("usherPlayer", function(){
    var owner = new Player({ id: generateRandomId() });

    context("when the game is not full", function(){
      var game = new Game({ id: owner.id, type: 'private', owner: owner});

      it("ushers the user into the game and return false", function(){
        var gameIsFull = game.isFull();
        expect(gameIsFull).to.eq(false);

        var player = new Player({ id: generateRandomId() });

        var playerInGame = game.isPlayerInGame(player);
        expect(playerInGame).to.eq(false);

        game.usherPlayer(player);

        var playerInGame = game.isPlayerInGame(player);
        expect(playerInGame).to.eq(true);
      });
    });

    context("when the game is full", function(){
      var game = new Game({ id: owner.id, type: 'private', owner: owner});

      it("returns false", function(){
        var player = new Player({ id: generateRandomId() });

        var otherPlayer1 = new Player({ id: generateRandomId() });
        game.usherPlayer(otherPlayer1);
        var otherPlayer2 = new Player({ id: generateRandomId() });
        game.usherPlayer(otherPlayer2);
        var otherPlayer3 = new Player({ id: generateRandomId() });
        game.usherPlayer(otherPlayer3);

        var gameIsFull = game.isFull();
        expect(gameIsFull).to.eq(true);

        var playerInGame = game.isPlayerInGame(player);
        expect(playerInGame).to.eq(false);

        var result = game.usherPlayer(player);
        var playerInGame = game.isPlayerInGame(player);
        expect(result).to.eq(false);
        expect(playerInGame).to.eq(false);

      });
    });
  });

  describe("ejectPlayer", function(){
    var owner = new Player({ id: generateRandomId() });

    it("ejects the player from the game room", function(){
      var game = new Game({ id: owner.id, type: 'private', owner: owner});
      var player = new Player({ id: generateRandomId() });

      game.usherPlayer(player);
      expect(game.isPlayerInGame(player)).to.eq(true);

      game.ejectPlayer(player);
      expect(game.isPlayerInGame(player)).to.eq(false);

      expect(game.numOfPlayers()).to.eq(1)  ;
    });
  });
});
