const { Router } = require("express");

const middleware = require ("./src/user/userMiddleware");
const controllers = require ("./src/user/userControllers");

const routes = Router();

routes.post ("/users", middleware.encryptPassword, controllers.createUser);
routes.get ("/users/:id", controllers.getProfile);

routes.get ("/users/me", (req, res) => {
    res.send("Em Manutenção");
});
rotes.put ("/users/me", (req, res) => {
    res.send("Em Manutenção");
});
routes.put ("/users/me/confirm", (req, res) => {
    res.send("Em Manutenção");
});
routes.put ("/users/me/disable", (req, res) => {
    res.send("Em Manutenção");
});


module.exports = routes;