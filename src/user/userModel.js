const Pool = require('../utils/db/db');

const DEFAULT_ERR = {
	error: 503,
	message: 'Internal Error',
};

const verify = async (email) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT id, password_hash FROM users WHERE email = $1',
			[email],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const getMyself = async (id) => {
	try {
		const { rows } = await Pool.query('SELECT * FROM users WHERE id = $1', [
			id,
		]);

		const user = rows[0];
		if (user.deleted_at) {
			return {
				error: 401,
				message: 'Unauthorized',
			};
		}

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const get = async (id) => {
	try {
		const { rows } = await Pool.query('SELECT * FROM users WHERE id = $1', [
			id,
		]);

		const user = rows[0];
		if (user.deleted_at) {
			return {
				error: 401,
				message: 'Unauthorized',
			};
		}

		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const store = async (user) => {
	const {
		name,
		username,
		email,
		phone,
		document_id,
		google_id,
		facebook_id,
		password_hash,
	} = user;

	const userExists = await verify(email);

	if (userExists) {
		return {
			error: 409,
			message: 'User already exists',
		};
	}

	try {
		const {
			rows,
		} = await Pool.query(
			'INSERT INTO users (name, username, email, phone, document_id, google_id, facebook_id, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
			[
				name,
				username,
				email,
				phone,
				document_id,
				google_id,
				facebook_id,
				password_hash,
			],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const update = async (user, id) => {
	const { name, username, email, phone, document_id, password_hash } = user;
	if (
		!name
		|| !username
		|| !email
		|| !phone
		|| !document_id
		|| !password_hash
	) {
		return {
			error: 400,
			message: 'Bad Request',
		};
	}

	const response = await getMyself(id);
	if (response.error || !response.length) {
		return {
			error: 400,
			message: 'Bad Request',
		};
	}
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE users SET name = $2, username = $3, email = $4, phone = $5, password_hash = $6, document_id =$7, updated_at = NOW() WHERE id = $1 RETURNING *',
			[id, name, username, email, phone, password_hash, document_id],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const confirm = async () => {
	try {
		const { rows } = await Pool.query();
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const disable = async (id) => {
	const response = await getMyself(id);
	if (response.error || !response.length) {
		return {
			error: 400,
			message: 'Bad Request',
		};
	}
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING *',
			[id],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const upload = async (url) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'INSERT INTO users_pictures url = $1 RETURNING *',
			[url],
		);
		return rows;
	} catch (err) {
		return DEFAULT_ERR;
	}
};

module.exports = {
	getMyself,
	get,
	store,
	update,
	confirm,
	disable,
	upload,
};
