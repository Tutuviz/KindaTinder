const Pagarme = require('../utils/payment');
const Premium = require('./premiumModels');

const payment = async (req, res) => {
	const { id } = req;
	const { premium } = req;
	const { card } = req.body;
	const { amount } = req.body;

	if (premium) {
		return res.json({
			error: 409,
			message: 'You are already a premium user',
		});
	}

	const pagamento = await Pagarme.charge(card, amount, true);

	if (!pagamento || pagamento.error) {
		return res.json({
			error: pagamento.error || 503,
			message: pagamento.message || 'Internal Error',
		});
	}

	const response = await Premium.pay(id);

	if (!response || response.error) {
		return res.json({
			error: response.error || 503,
			message: response.message || 'Internal Error',
		});
	}

	const { data } = pagamento;

	return res.json({
		message: 'payment sucessful',
		data,
	});
};

module.exports = {
	payment,
};
