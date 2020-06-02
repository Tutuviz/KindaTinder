const Premium = require('./premiumModels');

const payment = async (req, res) => {
	const { id } = req;
	const { premium } = req;

	if (premium) {
		return res.json({
			error: 409,
			message: 'You are already a premium user',
		});
	}

	const response = await Premium.pay(id);

	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	return res.json({
		message: 'payment sucessful',
	});
};

module.exports = {
	payment,
};
