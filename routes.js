const { Router } = require('express');

const userMiddleware = require('./src/user/userMiddleware');
const userControllers = require('./src/user/userControllers');

const premiumControllers = require('./src/premium/premiumControllers');

const sessionMiddleware = require('./src/session/sessionMiddleware');
const sessionController = require('./src/session/sessionControllers');

const uploadMiddleware = require('./src/utils/upload/multer');

const chatController = require('./src/chat/controller');
const chatMiddleware = require('./src/chat/middleware');

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
	userMiddleware.verifyPremium,
	userControllers.uploadPicture,
);

routes.get(
	'/users/me',
	sessionMiddleware.verifyToken,
	userMiddleware.verifyPremium,
	userControllers.getUserProfile,
);

routes.get(
	'/users/recommendation',
	sessionMiddleware.verifyToken,
	userMiddleware.verifyPremium,
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
	userMiddleware.verifyPremium,
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
	userMiddleware.verifyPremium,
	userControllers.getMatches,
);

routes.put(
	'/match/unmatch',
	sessionMiddleware.verifyToken,
	userControllers.undoMatches,
);

routes.put(
	'/match/like',
	sessionMiddleware.verifyToken,
	userMiddleware.verifyPremium,
	userControllers.likeOne,
);

routes.put(
	'/match/dislike',
	sessionMiddleware.verifyToken,
	userMiddleware.verifyPremium,
	userControllers.dislikeOne,
);

routes.post(
	'/premium/pay',
	sessionMiddleware.verifyToken,
	userMiddleware.verifyPremium,
	premiumControllers.payment,
);

routes.post(
	'/chat/:match_id',
	sessionMiddleware.verifyToken,
	userControllers.sendMessages,
);

routes.get('/chat', chatController.algo2);

// routes.get(
// 	'/chat/:match_id',
// 	sessionMiddleware.verifyToken,
// 	userControllers.getMessages,
// );

routes.post('/auth', sessionController.auth);

routes.get('/teste', sessionMiddleware.verifyToken, userControllers.excluir);

module.exports = routes;
