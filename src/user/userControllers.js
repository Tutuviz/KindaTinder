const User = require ("./userModel")

const getUserProfile = async (req, res) => {
    const id = req.body.id;
    
    const response = await User.getMyself(id);

    if (response.error || !response.length) {
        return res.json({
            error: response.error || 503,
            message: response.message || "Internal Error",
        });
    }

    const { name, username, email, phone } = response[0];

    return res.json ({name, username, email, phone, id});
}

const getProfile = async (req, res) => {
    const id = req.params.id;

    const response = await User.get(id);

    if (response.error || !response.length) {
        return res.json({
            error: response.error || 503,
            message: response.message || "Internal Error"
        });
    }

    const { name, username, email, phone } = response[0];

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

    if (response.error || !response.length) {
        return res.json({
            error: response.error || 503,
            message: response.message || "Internal Error",
        });
    }

    return res.json({ ...user, id: response[0].id});

}

const updateUserProfile = async (req, res) => {
    const id = req.body.id;
    const { name, username, email, phone, document_id, google_id, facebook_id, password_hash } = req.body;

    const user = {
        name, 
        username, 
        email,
        phone,
        document_id,
        google_id,
        facebook_id,

    }

    const response = await User.update({...user, password_hash}, id)

    if (response.error || !response.length) {
        return res.json({
            error: response.error || 503,
            message: response.message || "Internal Error",
        });
    }

    return res.json(user)

}

const confirmUser = async (req, res) => {
    const id = req.body.id;

}

const disableUser = async (req, res) => {
    const id = req.body.id;

    const response = await User.disable(id);

    if (!response.length  || response.error) {
        return res.json({
            error: response.error || 503,
            message: response.message || "Internal Error"
        });
    }

    const { name, username, email, phone } = response[0];
    return res.json({ 
        message: "User deleted",
        data: {
            name, 
            username, 
            email, 
            phone
        }
    });
}

const uploadPicture = async (req, res) => {
    const id = req.body.id;
    const { file } = req;
    const response = await User.upload (file);

    if (!response || response.error) {
        return res.json ({
            error: 503,
            message: "Internal Error",
        });
    }
}

module.exports = { getUserProfile, getProfile, createUser, updateUserProfile, confirmUser, disableUser, uploadPicture }