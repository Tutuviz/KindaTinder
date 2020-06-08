const bcrypt = require('bcryptjs');
const Pool = require('../utils/db/db');

const encryptPassword = async (req, res, next) => {
	const { password } = req.body;

	if (password) {
		const password_hash = await bcrypt.hash(password, 8);
		req.body.password_hash = password_hash;
	}

	return next();
};

const verifyPremium = async (req, res, next) => {
	const { id } = req;

	try {
		const { rows } = await Pool.query(
			`
			SELECT date_part('mons', AGE(NOW(), premium)) mons, date_part('day', AGE(NOW(), premium)) days FROM users WHERE id = $1
			`,
			[id],
		);

		let { days } = rows[0];

		if (rows[0].mons) {
			days += rows.mons * 30;
		}

		if (days !== null && days <= 30) {
			req.premium = true;
		} else {
			req.premium = false;
		}
	} catch (err) {
		return {
			error: 503,
			message: 'Internal Error',
		};
	}

	return next();
};

module.exports = { encryptPassword, verifyPremium };
