const express = require ("express");
const Routes = require ("./routes");
const server = express();

server.use(express.json());

server.use (Routes);

server.listen (process.env.PORT, () => {
    console.log (`Server rodando na porta ${process.env.PORT}`);
})

