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

  socket.on('create:gameroom', function(data){
    socket.join(player.id);

    player.resetStatus();

    arena.lobby.createGame({
      id: player.id,
      type: data.type,
      owner: player
    });
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
      socket
        .broadcast
        .to(player.currentGameId())
        .emit('player:left:gameroom');

      player.leaveCurrentGame();
    }
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
      socket
        .broadcast
        .to(player.currentGameId())
        .emit('game:start');
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

