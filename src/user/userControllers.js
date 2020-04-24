const User = require ("./userModel")

const getUserProfile = async (req, res) => {
    
}
const getProfile = async (req, res) => {
    const id = req.params.id;

    const response = await User.get(id);
    const {name, username, email, phone} = response[0];

    return res.json ({name, username, email, phone, id});
}

const createUser = async (req, res) => {
    const { name, username, email, phone, document_id, google_id, facebook_id, password_hash } = req.body;

    const user = {
        name,
        username,
        email,
        phone,
        document_id,
        google_id, 
        facebook_id
    };

    const response = await User.store({ ...user, password_hash });

    if (!response.length  || response.error) {
        return res.json({
            error: 503,
            message: 'Internal Error'
        });
    }

    return res.json({ ...user, id: response[0].id});

}

const updateUserProfile = async (req, res) => {
    
}
const confirmUser = async (req, res) => {
    
}
const disableUser = async (req, res) => {
    
}

module.exports = { getUserProfile, getProfile, createUser, updateUserProfile, confirmUser, disableUser }