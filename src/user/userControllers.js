const User = require('./userModel');
const sendMail = require('../utils/mail');

const getUserProfile = async (req, res) => {
	const { id } = req;

	const response = await User.getMyself(id);

	if (response.error || !response) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	const { name, username, email, phone } = response;

	return res.json({
		name,
		username,
		email,
		phone,
		id,
	});
};

const getProfile = async (req, res) => {
	const { id } = req.params;

	const response = await User.get(id);

	if (response.error || !response) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	const { name, username, email, phone } = response;

	return res.json({
		name,
		username,
		email,
		phone,
		id,
	});
};

const createUser = async (req, res) => {
	const {
		name = null,
		username = null,
		email = null,
		phone = null,
		document_id = null,
		google_id = null,
		facebook_id = null,
		password_hash = null,
	} = req.body;

	if (!name || !username || !email || !phone || !password_hash) {
		return res.json({
			error: 400,
			message: 'Bad Request',
		});
	}

	const user = {
		name,
		username,
		email,
		phone,
		document_id,
		google_id,
		facebook_id,
		password_hash,
	};

	const response = await User.store(user);

	if (response.error || !response) {
		res.status(response.error || 503);
		return res.json({
			message: response.message || 'Internal Error',
		});
	}

	await sendMail({
		to: `${response.email}`,
		subject: `${response.name}`,
		text: 'Vc se cadastrou, parabens',
	});

	return res.json({ id: response.id, ...user });
};

const updateUserProfile = async (req, res) => {
	const { id } = req;
	const {
		name = null,
		username = null,
		email = null,
		phone = null,
		document_id = null,
		google_id = null,
		facebook_id = null,
		password_hash = null,
	} = req.body;

	const user = await User.get(id);

	const data = {
		name: name || user.name,
		username: username || user.username,
		email: email || user.email,
		phone: phone || user.phone,
		document_id: document_id || user.document_id,
		google_id: google_id || user.google_id,
		facebook_id: facebook_id || user.facebook_id,
		password_hash: password_hash || user.password_hash,
	};

	const response = await User.update(data, id);

	if (response.error || !response) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	return res.json(response);
};

const confirmUser = () => {};

const disableUser = async (req, res) => {
	const { id } = req;

	const response = await User.disable(id);

	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	const { name, username, email, phone } = response;
	return res.json({
		message: 'User deleted',
		data: {
			name,
			username,
			email,
			phone,
		},
	});
};

const uploadPicture = async (req, res) => {
	const { id } = req;
	const { file } = req;

	const response = await User.upload(file, id);

	if (!response || response.error) {
		return res.json({
			error: 503,
			message: 'Internal Error',
		});
	}
	return res.json({
		error: null,
		message: 'Image Uploaded',
	});
};

const updateMyProfile = async (req, res) => {
	const { id } = req;
	const {
		description = null,
		lives_in = null,
		latitude = null,
		longitude = null,
		school = null,
		work = null,
		show_location = null,
		birthday = null,
		min_age = null,
		max_age = null,
	} = req.body;

	const user = await User.get(id);

	const data = {
		description: description || user.description,
		lives_in: lives_in || user.lives_in,
		latitude: latitude || user.latitude,
		longitude: longitude || user.longitude,
		school: school || user.school,
		work: work || user.work,
		show_location: show_location || user.show_location,
		birthday: birthday || user.birthday,
		min_age: min_age || user.min_age,
		max_age: max_age || user.max_age,
	};

	const response = await User.updateProfile(data, id);

	if (response.error || !response) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	return res.json(data);
};

const getRecommendations = async (req, res) => {
	const { id } = req;

	const preferences = await User.get(id);
	if (!preferences.min_age || !preferences.max_age) {
		res.json({
			error: 400,
			message: 'Missing age preferences',
		});
	}

	// const algo = await User.verifyMatch(id);

	const response = await User.getRecommendations(id);
	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	for (let loop = 0; loop < response.length; loop += 1) {
		if (
			response[loop].age < preferences.min_age ||
			response[loop].age > preferences.max_age
		) {
			response.length -= 1;
		}
	}

	if (!response) {
		return res.json({
			error: 404,
			message: 'Not Found',
		});
	}

	return res.json(response);
};

const likeOne = async (req, res) => {
	const user_id = req.id;
	const { match_id } = req.body;

	const liked = await User.verifyMatch(user_id, match_id);

	if (!liked) {
		const match = await User.createMatch(user_id, match_id, true, null);
		return res.json({
			error: match.error,
			message: match.message || 'Liked!',
		});
	}
	if (liked.user_liked && liked.match_liked) {
		return res.json({
			error: 409,
			message: 'Already a match',
		});
	}
	if (liked.user_id === user_id) {
		if (liked.user_liked) {
			return res.json({
				error: 409,
				message: 'Already Liked',
			});
		}
		if (!liked.user_liked) {
			return res.json({
				error: 409,
				message: 'Already disliked',
			});
		}
	}
	if (liked.match_id === user_id) {
		if (liked.match_liked) {
			return res.json({
				error: 409,
				message: 'Already liked',
			});
		}
		if (liked.match_liked === null) {
			const match = await User.updateMatch(
				match_id,
				user_id,
				liked.user_liked,
				true,
			);
			return res.json({
				error: match.error,
				message: match.message || 'Liked!',
			});
		}
		if (!liked.match_liked) {
			return res.json({
				error: 409,
				message: 'Already disliked',
			});
		}
	}
	return res.json({
		error: liked.error || 503,
		message: liked.message || 'Internal Error',
	});
};

const dislikeOne = async (req, res) => {
	const user_id = req.id;
	const { match_id } = req.body;

	const disliked = await User.verifyMatch(user_id, match_id);

	if (!disliked) {
		const match = await User.createMatch(user_id, match_id, false, null);
		return res.json({
			error: match.error,
			message: match.message || 'disliked!',
		});
	}
	if (disliked.user_liked && disliked.match_liked) {
		return res.json({
			error: 409,
			message: 'Already a match',
		});
	}
	if (disliked.user_id === user_id) {
		if (disliked.user_liked) {
			return res.json({
				error: 409,
				message: 'Already liked',
			});
		}
		if (!disliked.user_liked) {
			return res.json({
				error: 409,
				message: 'Already disliked',
			});
		}
	}
	if (disliked.match_id === user_id) {
		if (disliked.match_liked) {
			return res.json({
				error: 409,
				message: 'Already Liked',
			});
		}
		if (disliked.match_liked === null) {
			const r = await User.updateMatch(
				match_id,
				user_id,
				disliked.user_liked,
				false,
			);
			return res.json({
				error: r.error,
				message: r.message || 'disliked!',
			});
		}
		if (!disliked.match_liked) {
			res.json({
				error: 409,
				message: 'Already liked',
			});
		}
	}
	return res.json({
		error: disliked.error || 503,
		message: disliked.message || 'Internal Error',
	});
};

const getMatches = async (req, res) => {
	const { id } = req;
	const response = await User.matches(id);
	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}
	if (!response.length) {
		return res.json({
			error: 404,
			message: 'No matches found',
		});
	}
	return res.json(response);
};

const UndoMatches = async (req, res) => {
	const { id } = req;
	const response = await User.like(id);
	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}
};

module.exports = {
	getUserProfile,
	getProfile,
	createUser,
	updateUserProfile,
	updateMyProfile,
	confirmUser,
	disableUser,
	uploadPicture,
	getRecommendations,
	likeOne,
	dislikeOne,
	getMatches,
	UndoMatches,
};
