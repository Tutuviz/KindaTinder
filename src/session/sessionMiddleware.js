const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.json({
			error: 401,
			message: 'Unauthorized',
		});
	}
	const bearer = authorization.split(' ');
	const token = bearer[1];

	req.id = jwt.decode(token);

	return next();
};

module.exports = { verifyToken };
