const User = require ("./userModel")

const getUserProfile = async (req, res) => {
    
}
const getProfile = async (req, res) => {
    
}
const createUser = async (req, res) => {
    const { name, username = "", email = "", phone = "", document_id = "" } = req.body;

    const user = {
        name,
        username,
        email,
        phone,
        document_id,
    };
    
    const response = await User.store({ ...user, password_hash });

    if (!response.length  || response.error) {
        return res.json({
            error: 503,
            message: 'Internal Error'
        });
    }

    return res.json({ ...user, id: response[0].id, response: response });

}
const updateUserProfile = async (req, res) => {
    
}
const confirmUser = async (req, res) => {
    
}
const disableUser = async (req, res) => {
    
}

module.exports = { getUserProfile, getProfile, createUser, updateUserProfile, confirmUser, disableUser }