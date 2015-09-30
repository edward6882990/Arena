var _     = require('underscore');

var app   = require('http').createServer(handler);
var io    = require('socket.io')(app);

var arena = require('./arena');

var Player = require('./player');

app.listen(3030);

function handler(req, res){
  try {
    res.writeHead(200);
    res.end('');
  } catch(err) {
    res.writeHead(500);
    return res.end('Error occurred');
  }
}

function authenticate(token) {
  // TODO: Implement Me
  return true;
}

function broadcastGameRoomsUpdated(io){
  io.sockets.emit('gamerooms:updated', {
    totalPages : totalPages()
  });
}

function totalPages(){
  return Math.max(
    Math.ceil(arena.lobby.numOfAllGames() / 10), 1);
}

io.on('connection', function(socket){
  var self = this;
  var player = new Player(socket);

  arena.checkInPlayer(player);

  var withAuthentication = function(token, callback, args){
    if (authenticate(token)) {
      callback.apply(self, args);
    } else {
      socket.emit('error', { message: 'Unauthorized Access: Token is invalid!' });
    }
  };

  socket.on('gamerooms:get-update', function(data){
    var games = arena.lobby.gamesByPage(data.page);

    socket.emit('gamerooms:receive-update', {
      totalPages  : totalPages(),
      currentPage : data.page,
      games       : _.map(games, function(game){ return game.id; })
    });
  });

  socket.on('create:gameroom', function(data){
    socket.join(player.id);

    player.leaveCurrentGame();

    var game = arena.lobby.createGame({
      id: player.id,
      type: data.type,
      owner: player
    });

    socket.emit('create:gameroom:success', {
      game_id: game.id,
      players: _.map(game.allPlayers(), function(player){ return player.id; })
    });

    broadcastGameRoomsUpdated(io);
  });

  socket.on('join:gameroom', function(data){
    socket.join(data.gameId);

    player.resetStatus();

    arena.lobby.findGameById(data.gameId);
    if(game.usherPlayer(player)) {
      socket.emit('joined:gameroom', {
        id: game.id,
        players: game.allPlayers().map(function(p){ p.id })
      })
    }
  });

  socket.on('leave:gameroom', function(data){
    if (player.isInGame()){
      arena.lobby.ejectPlayerFromCurrentGame(player);

      socket
        .broadcast
        .to(player.currentGameId())
        .emit('player:left:gameroom');
    }

    socket.emit('left:gameroom');
    broadcastGameRoomsUpdated(io);
  });

  socket.on('ready', function(data){
    socket
      .broadcast
      .to(player.currentGameId())
      .emit('player:ready');

    player.setReady();

    if (player.currentGame().isAllPlayerReady())
      socket
        .broadcast
        .to(player.currentGameId())
        .emit('game:load');
  });

  socket.on('loaded', function(data){
    player.setLoaded();

    if (player.currentGame().isAllPlayerLoaded()){
      player.currentGame().start();
    }
  });

  socket.on('user:input', function(data){
    player.bufferInputs(data);
  });

  socket.on('disconnect', function(){
    arena.checkOutPlayer(player);
    player = null;
  });
});

