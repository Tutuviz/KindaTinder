const User = require('./userModel');

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
	const { id } = req;

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

	const user = User.get(id);

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

const getRecommendations = async (req, res) => {};

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
};
