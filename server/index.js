var express = require('express');
var app = express();
var cors = require('cors');
// app.use(cors({
//     origin: 'http://localhost:8000/',
//     credentials: true
// }));
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var sid = [];
io.on("connection", function (socket) {
  sid.push(socket.id);
  socket.join('room1');
  console.log("a new client connection");
  socket.on("disconnect", function () {
    console.log("a client disconnected");
  });

  // socket.on("message", function (data) {
  //   console.log(data);
  //   console.log(sid);
  //   io.to('room1').emit("message", data);
  // });

  socket.on("data", function (data) {
    io.emit("data", data);
  })
  socket.on("keydown", function (data) {
    io.emit("keydown", data);
  })
  socket.on("keyup", function (data) {
    io.emit("keyup", data);
  })
  socket.on("setFood", function (data) {
    io.emit("setFood", data);
  })
})

server.listen(8000, function () {
  console.log("listening on port 3000");
});