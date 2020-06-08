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
		const { rows } = await Pool.query(
			`
			SELECT * FROM (
				SELECT *, date_part('year', AGE(NOW(), birthday)) as age FROM users
				) as users
			WHERE id = $1
			`,
			[id],
		);

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
		const { rows } = await Pool.query(
			`
			SELECT * FROM (
				SELECT *, date_part('year', AGE(NOW(), birthday)) as age FROM users
				) as users
			WHERE id = $1
			`,
			[id],
		);

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
		if (userExists.error) {
			return userExists;
		}
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

	const response = await getMyself(id);
	if (response.error || !response) {
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

const updateProfile = async (user, id) => {
	const {
		description,
		lives_in,
		latitude,
		longitude,
		school,
		work,
		show_location,
		birthday,
		min_age,
		max_age,
		hide_age,
		hide_distance,
	} = user;

	const response = await getMyself(id);
	if (response.error || !response) {
		return {
			error: 400,
			message: 'Bad Request',
		};
	}
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE users SET description = $2, lives_in = $3, latitude = $4, longitude = $5, school = $6, work = $7, show_location = $8, birthday = $9, min_age = $10, max_age = $11, hide_age = $12, hide_distance = $13, updated_at = NOW() WHERE id = $1 RETURNING *',
			[
				id,
				description,
				lives_in,
				latitude,
				longitude,
				school,
				work,
				show_location,
				birthday,
				min_age,
				max_age,
				hide_age,
				hide_distance,
			],
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

const upload = async (url, id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'INSERT INTO users_pictures (url, user_id) VALUES ($1, $2) RETURNING *',
			[url.filename, id],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const verifyMatch = async (user_id, match_id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT * FROM matches WHERE user_id = $1 AND match_id = $2 OR match_id = $1 AND user_id = $2',
			[user_id, match_id],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const getUserPictures = async (id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT array_agg(url) photos FROM users_pictures WHERE user_id = $1',
			[id],
		);
		return rows.shift().photos;
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const getRecommendations = async (id, min_age, max_age) => {
	try {
		const { rows } = await Pool.query(
			`
				SELECT id, name, username, description, school, work, lives_in FROM (
					SELECT id, name, username, description, school, work, lives_in, date_part('year', AGE(NOW(), birthday)) age FROM users
				) as users
				WHERE
					id != $1 AND
					age >= $2 AND
					age <= $3
				`,
			[id, min_age, max_age],
		);
		const users = [];
		// eslint-disable-next-line no-restricted-syntax
		for (const user of rows) {
			// eslint-disable-next-line no-await-in-loop
			const photos = await getUserPictures(user.id);
			users.push({
				...user,
				photos,
			});
		}
		return users;
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const createMatch = async (
	user_id,
	match_id,
	user_liked = false,
	match_liked = false,
) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'INSERT INTO matches (user_id, match_id, user_liked, match_liked) VALUES ($1, $2, $3, $4) RETURNING *',
			[user_id, match_id, user_liked, match_liked],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const updateMatch = async (
	user_id,
	match_id,
	user_liked = false,
	match_liked = false,
) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE matches SET user_liked = $1, match_liked = $2 WHERE user_id = $3 AND match_id = $4 RETURNING *',
			[user_liked, match_liked, user_id, match_id],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const matches = async (id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'SELECT id, user_id, match_id FROM matches WHERE user_id = $1 AND user_liked = true AND match_liked = true AND unmatched = false',
			[id],
		);
		return rows;
	} catch (err) {
		return DEFAULT_ERR;
	}
};

const unmatch = async (user_id, match_id) => {
	try {
		const {
			rows,
		} = await Pool.query(
			'UPDATE matches SET unmatched = true WHERE user_id = $1 AND match_id = $2 OR user_id = $2 AND match_id = $1 RETURNING *',
			[user_id, match_id],
		);
		return rows.shift();
	} catch (err) {
		return DEFAULT_ERR;
	}
};

module.exports = {
	getMyself,
	get,
	store,
	update,
	updateProfile,
	confirm,
	disable,
	upload,
	verify,
	getRecommendations,
	createMatch,
	updateMatch,
	verifyMatch,
	matches,
	unmatch,
	getUserPictures,
};
