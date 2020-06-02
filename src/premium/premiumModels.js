const Pool = require('../utils/db/db');

const pay = async (id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE users SET premium = NOW() WHERE id = $1 RETURNING *',
			[id],
		);
		return rows.shift();
	} catch (err) {
		return {
			error: 503,
			message: 'Internal Error',
		};
	}
};

module.exports = {
	pay,
};
