require('./spec_helper');

var fg = FixtureGenerator;

describe("Events", function(){
  describe("directionOfContact", function(){
    context("when a player is touching another player on its left", function(){
      var player = fg.generatePlayer();
      player.position = { x: 25, y: 0 };

      var anotherPlayer = fg.generatePlayer();
      anotherPlayer.position = { x: 0, y: 0 };

      it("returns 'left'", function(){
        var direction = Events.directionOfContact(player, anotherPlayer);
        expect(direction).to.be.equal('left');
      });
    });

    context("when a player is touching another player on its right", function(){
      var player = fg.generatePlayer();
      player.position = { x: 0, y: 0 };

      var anotherPlayer = fg.generatePlayer();
      anotherPlayer.position = { x: 25, y: 0 };

      it("returns 'right'", function(){
        var direction = Events.directionOfContact(player, anotherPlayer);
        expect(direction).to.be.equal('right');
      });
    });

    context("when a player is touching another player on its top", function(){
      var player = fg.generatePlayer();
      player.position = { x: 0, y: 0 };

      var anotherPlayer = fg.generatePlayer();
      anotherPlayer.position = { x: 0, y: 25 };

      it("returns 'up'", function(){
        var direction = Events.directionOfContact(player, anotherPlayer);
        expect(direction).to.be.equal('up');
      });
    });

    context("when a player is touching another player on its bottom", function(){
      var player = fg.generatePlayer();
      player.position = { x: 0, y: 25 };

      var anotherPlayer = fg.generatePlayer();
      anotherPlayer.position = { x: 0, y: 0 };

      it("returns 'down'", function(){
        var direction = Events.directionOfContact(player, anotherPlayer);
        expect(direction).to.be.equal('down');
      });
    });

    context("when the players are not touching each other", function(){
      var player = fg.generatePlayer();
      player.position = { x: 50, y: 50 };

      var anotherPlayer = fg.generatePlayer();
      anotherPlayer.position = { x: 0, y: 0 };

      it("returns null", function(){
        var direction = Events.directionOfContact(player, anotherPlayer);
        expect(direction).to.be.null;
      });
    });
  });

  describe("contact", function(){
    context("when player 1 is zombie and player 2 is not", function(){
      var player1 = fg.generatePlayer();
      var player2 = fg.generatePlayer();

      player1.becomeZombie();

      it("converts player 2 into zombie by player 1", function(){
        chai.spy.on(Events, 'convertIntoZombie');

        expect(player2.isZombie()).not.to.be.true;

        Events.contact(player1, player2);

        expect(Events.convertIntoZombie).to.have.been.called();
        expect(player2.isZombie()).to.be.true;
      });
    });

    context("when player 1 is not zombie and player 2 is", function(){
      var player1 = fg.generatePlayer();
      var player2 = fg.generatePlayer();

      player2.becomeZombie();

      it("converts player 1 into zombie by player 2", function(){
        chai.spy.on(Events, 'convertIntoZombie');

        expect(player1.isZombie()).not.to.be.true;

        Events.contact(player1, player2);

        expect(Events.convertIntoZombie).to.have.been.called();
        expect(player1.isZombie()).to.be.true;
      });
    });
  });

  describe("convertIntoZombie", function(){
    var zombiePlayer, convertedPlayer;

    beforeEach(function(){
      zombiePlayer = fg.generatePlayer();
      zombiePlayer.becomeZombie();

      chai.spy.on(zombiePlayer.socket, 'emit');
      chai.spy.on(zombiePlayer.socket.broadcast, 'to');


      convertedPlayer = fg.generatePlayer();
      chai.spy.on(convertedPlayer.socket, 'emit');
    });

    it("converts the other player into zombie", function(){
      expect(convertedPlayer.isZombie()).not.to.be.true;

      Events.convertIntoZombie(zombiePlayer, convertedPlayer);

      expect(convertedPlayer.isZombie()).to.be.true;
    });

    it("emits messages to both players", function(){
      Events.convertIntoZombie(zombiePlayer, convertedPlayer);

      expect(zombiePlayer.socket.emit).to.have.been.called();
      expect(zombiePlayer.socket.broadcast.to).to.have.been.called();

      expect(convertedPlayer.socket.emit).to.have.been.called();
    });

  });
});