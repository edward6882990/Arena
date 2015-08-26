function Input(data){
  this.initialize = function(){
    _validateInputData();

    this.badge      = data.badge;
    this.position   = data.position;
    this.directions = _vectorToDirection(data.direction);
  }

  // ================ Private ==================

  function _validateInputData(){
    if (!data.badge)      throw "Input data must have a badge!"
    if (!data.position)   throw "Input data must have a position value!"
    if (!data.position.x) throw "Input data position must have a value of X coordinate!"
    if (!data.position.y) throw "Input data position must have a value of Y coordinate!"
  }

  function _vectorToDirection(vector){
    var directions = [];

    if (vector.x > 0) directions.push("right");
    if (vector.x < 0) directions.push("left");
    if (vector.y > 0) directions.push("up");
    if (vector.y < 0) directions.push("down");

    return directions;
  }

  this.initialize();
}

module.exports = Input;