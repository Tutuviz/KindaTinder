const pagarme = require('@tutuviz/pagar.me');

const client = pagarme(process.env.PAGARME_API_KEY);

module.exports = client;
