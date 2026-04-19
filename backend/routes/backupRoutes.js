const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const auth = require('../middleware/authMiddleware');
const {
    uploadFile,
    getFiles,
    restoreFile
} = require('../controllers/backupController');

router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/files', auth, getFiles);
router.get('/restore/:id', auth, restoreFile);

module.exports = router;