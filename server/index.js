var express = require('express');
var app = express();
var cors = require('cors');
// app.use(cors({
//     origin: 'http://localhost:8000/',
//     credentials: true
// }));
app.use(express.static('public'));
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

  socket.on("message", function (data) {
    console.log(data);
    var replyData = "this is very good";
    console.log(sid);
    io.to('room1').emit("message", data);
  });

  socket.on("engage", function (data) {
    io.emit("engage", data);
  });

  socket.on("putPoint", function (data) {
    io.emit("putPoint", data);
  })

  socket.on("disengage", function (data) {
    io.emit("disengage", data);
  })
  socket.on("typing", function (data) {
    io.emit("typing", data);
  })
  socket.on("stop typing", function (data) {
    io.emit("stop typing", data);
  })

})

server.listen(8000, function () {
  console.log("listening on port 3000");
});