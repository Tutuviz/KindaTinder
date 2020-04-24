const express = require ("express");
const { PORT } = require ("./config/config");
const controllers = require ("./src/user/userControllers");
const middleware = require ("./src/user/userMiddleware");
const server = express();

server.use(express.json());

server.get ("/", (req, res) => {
    res.send("Hello World");
});

server.use ("/users/me", controllers.getUserProfile);
server.use ("/users", middleware.encryptPassword, controllers.createUser);


server.listen (PORT, () => {
    console.log (`Server rodando na porta ${PORT}`);
})