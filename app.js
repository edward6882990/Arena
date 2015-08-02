var app   = require('http').createServer(handler);
var io    = require('socket.io')(app);
var redis = require('redis');


var redis_client_mapper = require('./redis_client_mapper');

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
}

io.on('connection', function(socket){
  var self = this;
  var redis_client = redis_client_mapper.firstOrCreateClientForSocket(socket);

  var withAuthentication = function(token, callback, args){
    if (authenticate(token)) {
      callback.apply(self, args);
    } else {
      socket.emit('error', { message: 'Unauthorized Access: Token is invalid!' });
    }
  }

  socket.on('create:gameroom', function(data){
    withAuthentication(data.token, function(data){

    }, [data]);
  });

  socket.on('join:gameroom', function(data){
    withAuthentication(data.token, function(data){

    }, [data]);
  });

  socket.on('received:instructions', function(data){
    withAuthentication(data.token, function(data){

    }, [data]);
  });
});

