const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.json({
			error: 401,
			message: 'Unauthorized',
		});
	}
	const bearer = authorization.split(' ');
	const token = bearer[1];

	req.id = await jwt.verify(token, process.env.SECRET);

	return next();
};

module.exports = { verifyToken };
