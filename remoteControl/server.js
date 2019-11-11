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

  // same as using the 'dispatch function above'

  socket.on('mousemove', function (obj) {
    io.emit('mousemove', obj)
  })
}

function _onDisconnected () {
  console.log('A user is disconnected')
}

// EVENT LISTENERS FROM OSC
receiver.on('/mousemove', function (mouseX, mouseY) {
  console.log('OSC mouse move ', mouseX, mouseY)
  io.emit('mousemove', {
    x: mouseX,
    y: mouseY
  })
})
