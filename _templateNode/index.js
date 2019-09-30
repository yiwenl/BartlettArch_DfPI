// index.js

const PORT_SOCKET     = 9876;
const PORT_LISTEN_OSC = 95;
let app               = require('express')();
let server            = app.listen(PORT_SOCKET);
let io                = require('socket.io')(server)
const OscReceiver     = require('osc-receiver')

let receiver = new OscReceiver();
receiver.bind(PORT_LISTEN_OSC);


receiver.on('/server/connect', function() { 
	console.log('osc connected');
})

receiver.on('/server/disconnect', function() { 
	console.log('osc disconnected');
})

receiver.on('/test', function(x, y) { 
	console.log('clicked', x, y);

	io.emit('clicked', {x, y});
})


//	WEB SOCKETS

io.on('connection', (socket)=>_onConnected(socket));

function _onConnected(socket) {
	console.log('A user is connected : ', socket.id);

	socket.on('disconnect', ()=>_onDisconnected() );
}
