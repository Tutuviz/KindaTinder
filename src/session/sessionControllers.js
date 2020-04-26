const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const Session = require ("./sessionModel")
const { SECRET } = require ("./sessionConfig");

const auth = async (req, res) => {
    const { email, password } = req.body;

    response = await Session.getId(email);

    if (!response[0] || response.error ) {
        return res.json ({
            error: 503,
            message: "Internal Error"
        });
    };

    jwt.sign(response[0], SECRET, (err, token) => {
        res.json({
            token,
        });
    });

}

module.exports = { auth };