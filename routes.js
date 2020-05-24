const { Router } = require('express');

const userMiddleware = require('./src/user/userMiddleware');
const userControllers = require('./src/user/userControllers');

const sessionMiddleware = require('./src/session/sessionMiddleware');
const sessionController = require('./src/session/sessionControllers');

const uploadMiddleware = require('./src/utils/upload/multer');

const routes = Router();

routes.post(
	'/users',
	userMiddleware.encryptPassword,
	userControllers.createUser,
);

routes.post(
	'/users/upload',
	sessionMiddleware.verifyToken,
	uploadMiddleware.uploadFile,
	userControllers.uploadPicture,
);

routes.get(
	'/users/me',
	sessionMiddleware.verifyToken,
	userControllers.getUserProfile,
);

routes.get(
	'/users/recommendation',
	sessionMiddleware.verifyToken,
	userControllers.getRecommendations,
);

routes.get('/users/:id', userControllers.getProfile);

routes.put(
	'/users/me',
	sessionMiddleware.verifyToken,
	userMiddleware.encryptPassword,
	userControllers.updateUserProfile,
);

routes.put(
	'/users/me/profile',
	sessionMiddleware.verifyToken,
	userControllers.updateMyProfile,
);

routes.put(
	'/users/me/confirm',
	sessionMiddleware.verifyToken,
	userControllers.confirmUser,
); // Manutencao

routes.put(
	'/users/me/disable',
	sessionMiddleware.verifyToken,
	userControllers.disableUser,
);

routes.get(
	'/match/all',
	sessionMiddleware.verifyToken,
	userControllers.getMatches,
);

routes.put(
	'/match/like',
	sessionMiddleware.verifyToken,
	userControllers.likeOne,
);

routes.put(
	'/match/dislike',
	sessionMiddleware.verifyToken,
	userControllers.dislikeOne,
);

routes.post('/auth', sessionController.auth);

module.exports = routes;
