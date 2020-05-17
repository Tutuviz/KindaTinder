const nodemailer = require('nodemailer');
const mailConfig = require('./config');

const Mail = nodemailer.createTransport(mailConfig);

const sendMail = (message) => {
	Mail.sendMail({
		...mailConfig.default,
		...message,
	});
};

module.exports = sendMail;
