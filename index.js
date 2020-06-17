const express = require('express');
require('express-async-errors');
const Sentry = require('@sentry/node');

const server = express();
const app = require('http').createServer(server);
const io = require('socket.io')(app);
const sentryConfig = require('./src/utils/sentry');
const routes = require('./routes');

const client = require('./src/chat');

client(io);

Sentry.init(sentryConfig);
server.use(Sentry.Handlers.requestHandler());

server.use('/static', express.static('uploads'));

server.use(express.json());
server.use(routes);

server.use(Sentry.Handlers.errorHandler());

app.listen(process.env.PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server rodando na porta ${process.env.PORT}`);
});
