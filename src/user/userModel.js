const Pool = require ("../../db/db");

const getMyself = async (id) => {
    try {
        const { rows } = await Pool.query(
            'SELECT * FROM users WHERE id = $1', [id]
        );
        return rows;
    } catch (err) {
        return {
            error: 503,
            message: "Internal Error",
        }
    }
}
const get = async (id) => {
    try {
    const { rows } = await Pool.query(
        'SELECT * FROM users WHERE id = $1', [id]
    );
    return rows;
    } catch (err) {
        return {
            error: 503,
            message: "Internal Error",
        }
    }    
}

const store = async (user) => {
    const { name, username, email, phone, document_id, google_id, facebook_id, password_hash } = user
    try {
        const { rows } = await Pool.query(
            'INSERT INTO users (name, username, email, phone, document_id, google_id, facebook_id, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [name, username, email, phone, document_id, google_id, facebook_id, password_hash]
        );
        return rows;
    } catch (err) {
        return {
            error: 503,
            message: "Internal Error",
        }
    }    
}

const update = async (user, id)=> {
    const { name, username, email, phone, document_id, password_hash } = user
    
    try {
        const { rows } = await Pool.query(
            'UPDATE users SET name = $2, username = $3, email = $4, phone = $5, password_hash = $6, document_id =$7 WHERE id = $1 RETURNING *', [id, name, username, email, phone, password_hash, document_id ]
        );
        return rows;
        } catch (err) {
            return {
                error: 503,
                message: "Internal Error",
            }
        }    
}

const confirm = async (id)=> {
    try {
        const { rows } = await Pool.query(
            'SELECT ${id} FROM users'
        );
        return rows;
        } catch (err) {
            return {
                error: 503,
                message: "Internal Error",
            }
        }    
}

const disable = async (id)=> {
    try {
        const user = await getMyself(id);
        if (!user.error && !user[0].deleted_at) {
            const { rows } = await Pool.query(
                'UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING *', [id]
            );
            return rows;
        }
        return {
            error: 400,
            message: 'Bad Format',
        };
    } catch (err) {
        return {
            error: 503,
            message: "Internal Error",
        }
    }
}

module.exports = { getMyself, get, store, update, confirm, disable }