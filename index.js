const express = require ("express");
const { PORT } = require ("./config/config");
const controllers = require ("./src/user/userControllers");
const server = express();

server.get ("/", (req, res) => {
    res.send("Hello World");
});

server.use ("/users/me", controllers.getUserProfile);


server.listen (PORT, () => {
    console.log (`Server rodando na porta ${PORT}`);
})