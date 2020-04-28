const bcrypt = require ("bcryptjs");
const jwt = require ("jsonwebtoken");
const Session = require ("./sessionModel")

const verifyPassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
}

const auth = async (req, res) => {
    const { email, password } = req.body;

    response = await Session.verify(email);

    if (!response[0].id || response.error ) {
        return res.json ({
            error: 503,
            message: "Internal Error"
        });
    };

    const passwordMatch = await verifyPassword(password, response[0].password_hash);

    if (passwordMatch) {  
        jwt.sign(response[0].id, process.env.SECRET, (err, token) => {
            return res.json({
                token,
            });
        });
    } else {
        return res.json ({
            error: 401,
            message: "Unauthorized"
        });
    }
        
}

module.exports = { auth };