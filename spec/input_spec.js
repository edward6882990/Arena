require('./spec_helper');

var fg = FixtureGenerator;

describe("Input", function(){
  describe("initialize", function(){
    var default_data = {
      badge      : fg.generateRandomBadge(),
      position   : fg.generateRandomPosition(),
      directions : fg.generateRandomDirectionVector()
    };

    context("when badge is not provided", function(){
      var data = cloneObject(default_data);
      data.badge = null;

      it("throws an error", function(){
        (function(){
          var input = new Input(data);
        }).should.throw("Input data must have a badge!");
      });
    });

    context("when position is not provided", function(){
      var data = cloneObject(default_data);
      data.position = null;

      it("throws an error", function(){
        (function(){
          var input = new Input(data);
        }).should.throw("Input data must have a position value!");
      });
    });

    context("when position is provided", function(){
      context("and position.x is falsy", function(){
        var data = cloneObject(default_data);
        data.position.x = null;

        it("throws an error", function(){
          (function(){
            var input = new Input(data);
          }).should.throw("Input data position must have a value of X coordinate!");
        });
      });

      context("and position.y is falsy", function(){
        var data = cloneObject(default_data);
        data.position.y = null;

        it("throws an error", function(){
          (function(){
            var input = new Input(data);
          }).should.throw("Input data position must have a value of Y coordinate!");
        });
      });
    });

    context("when direction is provided", function(){
      context("when x is positive", function(){
        var data = cloneObject(default_data);
        data.directions.x = 1;

        it("has directions that contains 'right'", function(){
          var input = new Input(data);

          expect(input.directions.indexOf('right')).to.be.above(-1);
        });
      });

      context("when x is negative", function(){
        var data = cloneObject(default_data);
        data.directions.x = -1;

        it("has directions that contains 'left'", function(){
          var input = new Input(data);

          expect(input.directions.indexOf('left')).to.be.above(-1);
        });
      });

      context("when x is neutral", function(){
        var data = cloneObject(default_data);
        data.directions.x = 0;

        it("has directions that does not contain either 'left' or 'right'", function(){
          var input = new Input(data);

          expect(input.directions.indexOf('left')).to.be.equal(-1);
          expect(input.directions.indexOf('right')).to.be.equal(-1);
        });
      });

      context("when y is positive", function(){
        var data = cloneObject(default_data);
        data.directions.y = 1;

        it("has directions that contains 'up'", function(){
          var input = new Input(data);

          expect(input.directions.indexOf('up')).to.be.above(-1);
        });
      });

      context('when y is negative', function(){
        var data = cloneObject(default_data);
        data.directions.y = -1;

        it("has directions that contains 'down'", function(){
          var input = new Input(data);

          expect(input.directions.indexOf('down')).to.be.above(-1);
        });

      });

      context("when y is neutral", function(){
        var data = cloneObject(default_data);
        data.directions.y = 0;

        it("has directions that does not contain either 'up' or 'down'", function(){
          var input = new Input(data);

          expect(input.directions.indexOf('up')).to.be.equal(-1);
          expect(input.directions.indexOf('down')).to.be.equal(-1);
        });

      });
    });
  });
});