const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: String,
  data: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
