require('./spec_helper');
arena = require('../arena');

describe("Arena", function(){
  describe("checkInPlayer", function(){
    it("checks in a player", function(){
      var player = new generatePlayer();

      arena.checkInPlayer(player);
      expect(!!arena.playersBySocketId[player.id]).to.equal(true);
    });

    context("when player does not have a socket", function(){
      var playerWithoutSocket = generatePlayer();
      playerWithoutSocket.socket = null;

      it("throws an exception", function(){
        (function(){
          arena.checkInPlayer(playerWithoutSocket);
        }).should.throw("Player does not have a socket connection!");
      });
    });
  });

  describe("checkOutPlayer", function(){
    it("checks out a player", function(){
      var player = new generatePlayer();

      arena.checkInPlayer(player);
      expect(!!arena.playersBySocketId[player.id]).to.equal(true);

      arena.checkOutPlayer(player);
      expect(!!arena.playersBySocketId[player.id]).to.equal(false);
    });

    context("when player does not have a socket", function(){
      var playerWithoutSocket = generatePlayer();
      playerWithoutSocket.socket = null;

      it("throws an exception", function(){
        (function(){
          arena.checkInPlayer(playerWithoutSocket);
        }).should.throw("Player does not have a socket connection!");
      });
    });
  });

  describe("isPlayerCheckedIn", function(){
    context("when the given player is checked in", function(){
      var player = generatePlayer();
      arena.checkInPlayer(player);

      it("returns true", function(){
        expect(
          arena.isPlayerCheckedIn(player)
        ).to.equal(true);
      });
    });

    context("when the given player is not checked in", function(){
      var player = generatePlayer();

      it("returns false", function(){
        expect(
          arena.isPlayerCheckedIn(player)
        ).to.equal(false);
      });
    });
  });
});