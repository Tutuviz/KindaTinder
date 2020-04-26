const Pool = require ("../../db/db");

const getId = async (email) => {
    try {
        const { rows } = await Pool.query(
            'SELECT id FROM users WHERE email = $1', [email]
        );
        return rows
    } catch (err) {
        return {
            error: 503,
            message: "Internal Error",
        }
    }   
}

module.exports = { getId }