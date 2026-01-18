const xlsx = require('xlsx');
const fs = require('fs');
const File = require('../models/File');
const anomalyDetection = require('../ai/anomalyDetection');
const prediction = require('../ai/prediction');
const clustering = require('../ai/clustering');
const insights = require('../ai/insights');

exports.uploadFile = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'No data found in file' 
      });
    }

    // Perform AI analysis
    const aiAnalysis = {
      anomalies: anomalyDetection.detectAllAnomalies(data),
      insights: insights.generateInsights(data),
      clustering: clustering.kMeansClustering(data, 3)
    };

    // Try to save to database (optional)
    let fileRecord = null;
    try {
      fileRecord = await File.create({ 
        userId: req.body.userId || 'demo_user',
        fileName: req.file.originalname,
        data,
        aiAnalysis,
        metadata: {
          rowCount: data.length,
          columnCount: Object.keys(data[0]).length,
          uploadedAt: new Date()
        }
      });
    } catch (dbError) {
      // Database error - continue in demo mode
      console.warn('Database save skipped (demo mode):', dbError.message);
      fileRecord = {
        _id: 'demo_' + Date.now(),
        success: true
      };
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn('Could not delete temp file');
    }
    
    res.json({
      success: true,
      message: 'File analyzed successfully',
      fileId: fileRecord._id,
      rowCount: data.length,
      columnCount: Object.keys(data[0]).length,
      data: data,
      analysis: aiAnalysis
    });
  } catch (error) {
    console.error('Upload error:', error);
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      // Ignore cleanup errors
    }
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed: ' + error.message 
    });
  }
};

/**
 * Get anomalies for a specific column
 */
exports.detectAnomalies = async (req, res) => {
  try {
    const { fileId, columnName, data } = req.body;
    
    // Try to get from database first
    let analysisData = data;
    if (!analysisData && fileId) {
      try {
        const fileRecord = await File.findById(fileId);
        analysisData = fileRecord?.data;
      } catch (e) {
        // Database not available - use provided data
        console.warn('Database query failed, using provided data');
      }
    }

    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data provided or found' 
      });
    }

    const result = anomalyDetection.detectAnomalies(analysisData, columnName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get predictions for a column
 */
exports.predictTrend = async (req, res) => {
  try {
    const { fileId, columnName, method = 'linear', periods = 5, data } = req.body;
    
    // Try to get from database first
    let analysisData = data;
    if (!analysisData && fileId) {
      try {
        const fileRecord = await File.findById(fileId);
        analysisData = fileRecord?.data;
      } catch (e) {
        console.warn('Database query failed, using provided data');
      }
    }

    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data provided or found' 
      });
    }

    let result;
    if (method === 'linear') {
      result = prediction.linearRegression(analysisData, columnName, periods);
    } else if (method === 'moving_average') {
      result = prediction.movingAverage(analysisData, columnName);
    } else if (method === 'seasonal') {
      result = prediction.seasonalDecomposition(analysisData, columnName);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Perform clustering analysis
 */
exports.clusterData = async (req, res) => {
  try {
    const { fileId, method = 'kmeans', numClusters = 3, data } = req.body;
    
    // Try to get from database first
    let analysisData = data;
    if (!analysisData && fileId) {
      try {
        const fileRecord = await File.findById(fileId);
        analysisData = fileRecord?.data;
      } catch (e) {
        console.warn('Database query failed, using provided data');
      }
    }

    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data provided or found' 
      });
    }

    let result;
    if (method === 'kmeans') {
      result = clustering.kMeansClustering(analysisData, numClusters);
    } else if (method === 'hierarchical') {
      result = clustering.hierarchicalClustering(analysisData, numClusters);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get AI insights
 */
exports.getInsights = async (req, res) => {
  try {
    const { fileId, data } = req.body;
    
    // Try to get from database first
    let analysisData = data;
    if (!analysisData && fileId) {
      try {
        const fileRecord = await File.findById(fileId);
        analysisData = fileRecord?.data;
      } catch (e) {
        console.warn('Database query failed, using provided data');
      }
    }

    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data provided or found' 
      });
    }

    const result = insights.generateInsights(analysisData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  const history = await File.find({ userId: req.params.userId });
  res.json(history);
};
