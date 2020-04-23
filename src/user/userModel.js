const Pool = require ("../../db/db")

const getMyself = async (id) => {
    try {
        const { rows } = await Pool.query(
            `SELECT ${id} FROM users`
        );
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
            `SELECT ${id} FROM users`
        );
        } catch (err) {
            return {
                error: 503,
                message: "Internal Error",
            }
        }    
    }
const store = async (user) => {
    const { name, username, email, phone, document_id } = user
    try {
        const { rows } = await Pool.query(
            `INSERT INTO users (name, username, email, phone, document_id) VALUES ($1, $2, $3, $4, $5) RETURNING *` [name, username, email, phone, document_id]
        );
        } catch (err) {
            return {
                error: 503,
                message: "Internal Error",
            }
        }    
    }
const update = async (user)=> {
    try {
        const { rows } = await Pool.query(
            `SELECT ${id} FROM users`
        );
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
            `SELECT ${id} FROM users`
        );
        } catch (err) {
            return {
                error: 503,
                message: "Internal Error",
            }
        }    
    }
const disable = async (id)=> {
    try {
        const { rows } = await Pool.query(
            `SELECT ${id} FROM users`
        );
        } catch (err) {
            return {
                error: 503,
                message: "Internal Error",
            }
        }    
    }

module.exports = { getMyself, get, store, update, confirm, disable }