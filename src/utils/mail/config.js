module.exports = {
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
	secure: false,
	default: {
		from: 'KindaTinder no-reply@kindatinder.com',
	},
};
