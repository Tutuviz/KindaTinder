// msg, connect, disconnect
const { checkToken, checkMatch } = require('./middleware');

let connected = [];

const socket_io = (io) => {
	io.use(checkToken);
	io.use(checkMatch);
	io.on('connection', (socket) => {
		// verificar duplicidade de id

		socket.join(socket.handshake.query.match_id);

		connected.push(socket.verify.id);
		console.log(`User ${socket.verify.id} connected.`);

		io.emit('users', {
			connected,
		});

		socket.on('chat message', (content) => {
			console.log(
				'user:',
				socket.verify.name,
				'message:',
				content.message,
			);

			// guardar no banco

			io.in(socket.handshake.query.match_id).emit('chat message', {
				message: content.message,
				name: socket.verify.name,
			});
		});

		socket.on('disconnect', (e) => {
			connected = connected.filter(
				(element) => element !== socket.verify.id,
			);
			io.emit('users', {
				connected,
			});
			console.log(`User ${socket.verify.id} disconnected.`);
		});
	});
};

module.exports = socket_io;
