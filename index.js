const express = require('express');
require('express-async-errors');
const Sentry = require('@sentry/node');
const routes = require('./routes');
const sentryConfig = require('./src/utils/sentry');

const server = express();

Sentry.init(sentryConfig);
server.use(Sentry.Handlers.requestHandler());

server.use('/static', express.static('uploads'));

server.use(express.json());
server.use(routes);

server.use(Sentry.Handlers.errorHandler());

server.listen(process.env.PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server rodando na porta ${process.env.PORT}`);
});
