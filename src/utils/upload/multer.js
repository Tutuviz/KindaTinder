const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const checkFile = (req, file, next) => {
	const ext = path.extname(file.originalname);
	if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
		// Tratar isso
		// return res.json({
		//   error: 409,
		//   message: 'Bad Request',
		// });
		//
	}
	// useTabs = true => Eslint = no-tabs

	// useTabs = false => Eslint = Expecting tabs

	return next(null, true);
};

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
});

const S3Storage = {
	storage: multerS3({
		s3,
		acl: 'public-read',
		bucket: process.env.AWS_S3_BUCKETNAME,
		metadata: (req, file, cb) => {
			cb(null, { fieldName: file.fieldname });
		},
		key: (req, file, cb) => {
			const uniquePrefix = `${Date.now()}-${Math.round(
				Math.random() * 1e9,
			)}`;
			const fileExtension = path.extname(file.originalname);
			cb(null, uniquePrefix + fileExtension);
		},
	}),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
	fileFilter: checkFile,
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

const DiskStorage = {
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 mb
	fileFilter: checkFile,
};

const Uploader = multer(
	process.env.UPLOAD_STORAGE === 'diskstorage' ? DiskStorage : S3Storage,
).single('file');

// const Uploader = multer({
// 	storage,
// 	limits: { fileSize: 5 * 1024 * 1024 },
// 	fileFilter: checkFile,
// }).single('file');

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
