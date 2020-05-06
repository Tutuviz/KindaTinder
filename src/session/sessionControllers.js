const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/userModel');

const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);

const auth = async (req, res) => {
	const { email, password } = req.body;

	const response = await User.verify(email);

	if (!response.id || response.error) {
		return res.json({
			error: 503,
			message: 'Internal Error',
		});
	}

	const passwordMatch = await verifyPassword(
		password,
		response.password_hash,
	);

	if (passwordMatch) {
		jwt.sign(response.id, process.env.SECRET, (err, token) => res.json({
			token,
		}));
	} else {
		return res.json({
			error: 401,
			message: 'Unauthorized',
		});
	}
};

module.exports = { auth };
