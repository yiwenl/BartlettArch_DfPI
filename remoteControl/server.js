// server.js

// WEB SOCKETS
const PORT_SOCKET = 9876
const app = require('express')()
const server = app.listen(PORT_SOCKET)
const io = require('socket.io')(server)

// OSC
const PORT_OSC = 32000
const OscReceiver = require('osc-receiver')
const receiver = new OscReceiver()
receiver.bind(PORT_OSC)

// EVENT LISTENERS FROM WEBSOCKET
io.on('connection', (socket) => _onConnected(socket))

function dispatch (socket, eventName) {
  socket.on(eventName, function (o) {
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

// EVENT LISTENERS FROM OSC
receiver.on('/server/connect', function () {
  console.log('OSC connected')
})

receiver.on('/server/disconnect', function () {
  console.log('OSC disconnected')
})

receiver.on('/mousemove', function (x, y) {
  console.log('OSC mouse move ', x, y)
})
