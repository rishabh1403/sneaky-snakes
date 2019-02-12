var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var sockets = [];
io.on("connection", function (socket) {
  sockets.push(socket);
  console.log("a new client connection " + socket.id);
  if (sockets.length === 2) {
    io.emit('ready');
    const socket1 = sockets[0];
    const socket2 = sockets[1];

    socket1.on('keydown', (...args) => {
      socket2.emit('keydown', ...args);
    })

    socket1.on('keyup', (...args) => {
      socket2.emit('keyup', ...args);
    })

    socket2.on('keydown', (...args) => {
      socket1.emit('keydown', ...args);
    })

    socket2.on('keyup', (...args) => {
      socket1.emit('keyup', ...args);
    })
  }
});

server.listen(8000, function () {
  console.log("listening on port 8000");
});