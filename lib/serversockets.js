var io;// = require('socket.io');
var http = require('http')
const connected = {};

function setup(server) { 
  console.log('inside setup')
  io = require('socket.io')(server);
  console.log('this is io: ', io)
  io.on('connection', function (socket) {
    console.log(socket.id)
    connected[socket.id] = socket;
    socket.emit('init', {id: socket.id})
  }); 
}






module.exports = { setup }