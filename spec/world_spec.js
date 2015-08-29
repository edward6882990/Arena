require('./spec_helper');

var fg = FixtureGenerator;

describe("World", function(){
  var world;

  beforeEach(function(){
    world = fg.generateWorld();
    world.pause();
  });

  describe("initialize", function(){
    it("starts to iterate right after initialize", function(){
      expect(world.interval).not.to.be.null;
    });
  });

  describe("executeInputForPlayer", function(){

    it("executes input for a player", function(){
      var player = world.players[0];
      var input  = fg.generateInput();

      world.executeInputForPlayer(player, input);
      expect(player.position.x).to.be.equal(input.position.x);
      expect(player.position.y).to.be.equal(input.position.y);
    });

    context("when player is touching another player", function(){
      it("triggers a contact event", function(){
        var player = world.players[0];
        var anotherPlayer = world.players[1];

        player.updatePosition(20, 0);
        anotherPlayer.updatePosition(0, 0);

        var input  = fg.generateInput();
        input.position.x = 20;
        input.position.y = 0;
        input.directions.x = -1;
        input.directions.y = 0;

        chai.spy.on(Events, 'contact');

        world.executeInputForPlayer(player, input);

        expect(Events.contact).to.have.been.called();
      });
    });
  });

  describe("update", function(){
    it("clears up the input buffers of all players every literation", function(){
      var player = world.players[0]

      player.bufferInputs([fg.generateRandomInputDatum()]);

      expect(player.inputs.length).to.be.above(0);

      world.update();

      expect(player.inputs.length).to.be.equal(0);
    });
  });

  describe("findPlayerByBadge", function(){
    it("returns all the players except the given player in the world", function(){
      var player = world.findPlayerByBadge(2);

      expect(player).to.be.an.instanceof(Player);
      expect(player.badge).to.be.equal(2);
    });
  });
});