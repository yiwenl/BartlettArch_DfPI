// server.js

const PORT_SOCKET = 9876
const app = require('express')()
const server = app.listen(PORT_SOCKET)
const io = require('socket.io')(server)

// WEB SOCKETS

io.on('connection', (socket) => _onConnected(socket))

function dispatch (socket, eventName) {
  socket.on(eventName, function (o) {
    if (Math.random() > 0.99) {
      console.log('Event', eventName, o)
    }
    io.emit(eventName, o)
  })
}

function _onConnected (socket) {
  console.log('A user is connected : ', socket.id)

  socket.on('disconnect', () => _onDisconnected())

  dispatch(socket, 'cameramove')
  dispatch(socket, 'tilt')
}

function _onDisconnected () {
  console.log('A user is disconnected')
}
