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