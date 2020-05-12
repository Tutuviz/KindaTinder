const bcrypt = require('bcryptjs');

const encryptPassword = async (req, res, next) => {
	const { password } = req.body;

	if (password) {
		const password_hash = await bcrypt.hash(password, 8);
		req.body.password_hash = password_hash;
	}

	return next();
};

module.exports = { encryptPassword };
