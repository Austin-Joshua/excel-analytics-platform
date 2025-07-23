const express = require('express');
const multer = require('multer');
const { uploadFile, getHistory } = require('../controllers/fileController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/history/:userId', getHistory);

module.exports = router;
