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

function broadcastLobbyUpdated(io){
  io.sockets.emit('lobby:updated', {
    totalPages : totalPages()
  });
}

function totalPages(){
  return Math.max(
    Math.ceil(arena.lobby.numOfAllGames() / 10), 1);
}

function eventLog(socket, msg){
  console.log(socket.id + ": " + msg);
}

io.on('connection', function(socket){
  var self = this;
  var player = new Player(socket);

  arena.checkInPlayer(player);

  eventLog(socket, 'connected');

  var withAuthentication = function(token, callback, args){
    if (authenticate(token)) {
      callback.apply(self, args);
    } else {
      socket.emit('error', { message: 'Unauthorized Access: Token is invalid!' });
    }
  };

  socket.on('lobby:get-update', function(data){
    eventLog(socket, 'lobby:get-update');

    var games = arena.lobby.gamesByPage(data.page);

    socket.emit('lobby:receive-update', {
      totalPages  : totalPages(),
      currentPage : data.page,
      games       : _.map(games, function(game){ return game.id; })
    });
  });

  socket.on('create:gameroom', function(data){
    eventLog(socket, 'create:gameroom');

    socket.join(player.id);

    player.leaveCurrentGame();

    var game = arena.lobby.createGame({
      id: player.id,
      type: data.type,
      owner: player
    });

    socket.emit('create:gameroom:success', {
      game_id: game.id,
      players: _.map(game.allPlayers(), function(player){
        return { id: player.id, owner : player.id == game.owner.id };
      })
    });

    broadcastLobbyUpdated(io);
  });

  socket.on('join:gameroom', function(data){
    eventLog(socket, 'join:gameroom');

    socket.join(data.gameId);

    player.resetStatus();

    var game = arena.lobby.findGameById(data.gameId);
    if(game.usherPlayer(player)) {
      var data = {
        game_id: game.id,
        players: _.map(game.allPlayers(), function(player){
          return { id: player.id, owner : player.id == game.owner.id };
        })
      };

      socket.emit('join:gameroom:success', data);
      socket.broadcast.to(player.currentGameId()).emit('gameroom:updated', data);
    }
  });

  socket.on('leave:gameroom', function(data){
    eventLog(socket, 'leave:gameroom');

    if (player.isInGame()){
      var game = arena.lobby.ejectPlayerFromCurrentGame(player);

      if (game != null) {
        var data = {
          game_id: game.id,
          players: _.map(game.allPlayers(), function(player){
            return { id: player.id, owner : player.id == game.owner.id };
          })
        };

        socket.broadcast.to(game.id).emit('gameroom:updated', data);
      }
    }

    socket.emit('left:gameroom');
    broadcastLobbyUpdated(io);
  });

  socket.on('ready', function(data){
    eventLog(socket, 'ready');

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
    eventLog(socket, 'ready');

    player.setLoaded();

    if (player.currentGame().isAllPlayerLoaded()){
      player.currentGame().start();
    }
  });

  socket.on('user:input', function(data){
    eventLog(socket, 'user:input');

    player.bufferInputs(data);
  });

  socket.on('disconnect', function(){
    eventLog(socket, 'disconnect');

    if (player.isInGame()) arena.lobby.ejectPlayerFromCurrentGame(player);
    arena.checkOutPlayer(player);
    player = null;
  });
});

