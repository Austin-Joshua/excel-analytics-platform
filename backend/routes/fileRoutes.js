const express = require('express');
const multer = require('multer');
const { 
  uploadFile, 
  getHistory,
  detectAnomalies,
  predictTrend,
  clusterData,
  getInsights
} = require('../controllers/fileController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// File management
router.post('/upload', upload.single('file'), uploadFile);
router.get('/history/:userId', getHistory);

// AI Analysis endpoints
router.post('/anomalies', detectAnomalies);
router.post('/predict', predictTrend);
router.post('/cluster', clusterData);
router.post('/insights', getInsights);

module.exports = router;
