const multer = require('multer');
const path = require('path');

const checkFile = (req, file, next) => {
	const ext = path.extname(file.originalname);
	if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
		// Tratar isso
		return next({
			error: 409,
			message: 'Bad Request',
		});
	}
	return next(null, true);
};

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
		);
	},
});

const Uploader = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: checkFile,
}).single('file');

const uploadFile = (req, res, next) => {
	Uploader(req, res, (err) => {
		if (err) {
			return res.json({
				error: 503,
				message: 'Internal Error',
			});
		}
		return next();
	});
};

module.exports = { checkFile, uploadFile };
