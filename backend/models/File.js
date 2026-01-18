const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: String,
  fileName: String,
  data: Array,
  aiAnalysis: {
    anomalies: mongoose.Schema.Types.Mixed,
    insights: mongoose.Schema.Types.Mixed,
    clustering: mongoose.Schema.Types.Mixed
  },
  metadata: {
    rowCount: Number,
    columnCount: Number,
    uploadedAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
