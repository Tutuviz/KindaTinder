const { Router } = require("express");

const userMiddleware = require ("./src/user/userMiddleware");
const userControllers = require ("./src/user/userControllers");

const sessionMiddleware = require ("./src/session/sessionMiddleware");
const sessionController = require ("./src/session/sessionControllers");

const routes = Router();

routes.post ("/users", userMiddleware.encryptPassword, userControllers.createUser);
routes.get ("/users/:id", userControllers.getProfile);

routes.get ("/users/me", (req, res) => {
    res.send("Em Manutenção");
});
routes.put ("/users/me", (req, res) => {
    res.send("Em Manutenção");
});
routes.put ("/users/me/confirm", (req, res) => {
    res.send("Em Manutenção");
});
routes.put ("/users/me/disable", (req, res) => {
    res.send("Em Manutenção");
});


routes.post ("/auth", sessionController.auth);


module.exports = routes;