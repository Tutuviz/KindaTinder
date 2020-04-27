const Pool = require ("../../db/db");

const verify = async (email) => {
    try {
        const { rows } = await Pool.query(
            'SELECT id, password_hash FROM users WHERE email = $1', [email]
        );
        return rows
    } catch (err) {
        return {
            error: 503,
            message: "Internal Error",
        }
    }   
}

module.exports = { verify }