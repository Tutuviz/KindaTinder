const express = require ("express");
const { PORT } = require ("./config/config");
const Routes = require ("./routes");
const server = express();

server.use(express.json());

server.use (Routes);

server.listen (PORT, () => {
    console.log (`Server rodando na porta ${PORT}`);
})

