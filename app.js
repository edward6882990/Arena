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
    // withAuthentication(data.token, function(data){
    // }, [data]);

    socket.join(player.id);
    arena.lobby.createGame({
      id: player.id,
      type: data.type,
      owner: player
    });
  });

  socket.on('join:gameroom', function(data){
    // withAuthentication(data.token, function(data){

    // }, [data]);
  });

  socket.on('leave:gameroom', function(data){
    // withAuthentication(data.token, function(data){

    // }, [data]);
  });

  socket.on('received:instructions', function(data){
    // withAuthentication(data.token, function(data){

    // }, [data]);
  });

  socket.on('disconnect', function(){
    arena.checkOutPlayer(player);
    player = null;
  });
});

