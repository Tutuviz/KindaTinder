/* eslint-disable no-param-reassign */
const jwt = require('jsonwebtoken');
const { getMatchById } = require('../user/userModel');

const checkToken = async (socket, next) => {
	if (!socket.handshake.query) {
		return next(new Error('Authentication Error'));
	}
	if (socket.handshake.query.token) {
		try {
			socket.verify = await jwt.verify(
				socket.handshake.query.token,
				process.env.SECRET,
			);
		} catch (error) {
			return next(new Error('Authentication Error'));
		}
	}

	return next();
};

// eslint-disable-next-line consistent-return
const checkMatch = async (socket, next) => {
	if (!socket.handshake.query) {
		return next(new Error('Authentication Error'));
	}
	if (socket.handshake.query.match_id) {
		getMatchById(socket.handshake.query.match_id);
	}
};

module.exports = { checkToken, checkMatch };
