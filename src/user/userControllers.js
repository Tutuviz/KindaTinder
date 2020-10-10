const User = require('./userModel');
const sendMail = require('../utils/mail');

const getUserProfile = async (req, res) => {
	const { id } = req;
	const { premium } = req;

	const response = await User.getMyself(id);

	if (response.error || !response) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	const {
		document_id,
		google_id,
		facebook_id,
		password_hash,
		deleted_at,
		updated_at,
		show_location,
		...user
	} = response;

	return res.json({ ...user, premium });
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

	const { name, username, description, school, work, age } = response;

	return res.json({
		id,
		name,
		username,
		description,
		age,
		school,
		work,
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
	const { premium } = req;
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
		hide_age = null,
		hide_distance = null,
	} = req.body;

	if (!premium && (hide_age || hide_distance)) {
		return res.json({
			error: 402,
			message: 'Sorry, that`s a premium content',
		});
	}

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
		hide_age: hide_age || user.hide_age,
		hide_distance: hide_distance || user.hide_distance,
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
	const { premium } = req;

	const preferences = await User.get(id);
	if (!preferences.min_age || !preferences.max_age) {
		res.json({
			error: 400,
			message: 'Missing age preferences',
		});
	}

	const response = await User.getRecommendations(
		id,
		preferences.min_age,
		preferences.max_age,
	);

	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	/* eslint-disable no-restricted-syntax */
	/* eslint-disable no-await-in-loop */
	const addResponse = [];
	for (const user of response) {
		const some = await User.get(user.id);
		if (some.premium) {
			if (some.hide_age && some.hide_distance) {
				addResponse.push(user);
			} else if (some.hide_age) {
				addResponse.push({ ...user, distance: 'working on it' });
			} else if (some.hide_distance) {
				addResponse.push({ ...user, age: some.age });
			}
		} else {
			addResponse.push({
				...user,
				age: some.age,
				distance: 'working on it',
			});
		}
	}

	const normalRecommendations = [];
	const premiumRecommendations = [];
	for (const matches of addResponse) {
		const they = await User.verifyMatch(id, matches.id);
		if (!they || (they.match_id === id && they.match_liked === null)) {
			normalRecommendations.push(matches);
			if (they && they.user_liked) {
				premiumRecommendations.push({ ...matches, liked: true });
			} else {
				premiumRecommendations.push({ ...matches, liked: false });
			}
		}
	}

	if (!normalRecommendations) {
		return res.json({
			error: 404,
			message: 'Not Found',
		});
	}

	if (premium) {
		return res.json(premiumRecommendations);
	}

	return res.json(normalRecommendations);
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
			if (liked.user_liked) {
				return res.json({
					error: match.error,
					message: match.message || 'Congrats! It`s a match',
				});
			}
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

const undoMatches = async (req, res) => {
	const { id } = req;
	const { match_id } = req.body;
	const response = await User.verifyMatch(id, match_id);

	if (!response) {
		return res.json({
			error: 400,
			message: 'Bad Request',
		});
	}
	if (response.unmatched) {
		return res.json({
			error: 409,
			message: 'Already unmatched',
		});
	}

	if (response.user_liked && response.match_liked) {
		const Unmatch = await User.unmatch(id, match_id);
		return res.json(Unmatch);
	}

	return res.json({
		error: response.error || 401,
		message: response.message || 'That`s not a match',
	});
};

const excluir = async (req, res) => {
	const { id } = req;
	const algo = await User.getUserPictures(id);
	res.json(algo);
};

const sendMessages = async (req, res) => {
	const { id } = req;
	const { match_id } = req.params;
	const { message } = req.body;
	const match = await User.verifyMatch(id, match_id);

	if (!match || match.error) {
		return res.json({
			error: match.error || 401,
			message: match.message || 'That`s not a match',
		});
	}

	const response = await User.sendMessage(id, match.id, message);

	return res.json(response);
};

const getMessages = async (req, res) => {
	const { id } = req;
	const { match_id } = req.params;

	const match = await User.verifyMatch(id, match_id);

	if (!match || match.unmatched || match.error) {
		return res.json({
			error: match.error || 401,
			message: match.message || 'That`s not a match',
		});
	}

	const response = await User.viewMessage(match.id);

	return res.json(response);
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
	undoMatches,
	excluir,
	getMessages,
	sendMessages,
};
