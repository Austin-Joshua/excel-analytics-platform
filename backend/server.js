const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection - optional for now
const mongoUri = process.env.MONGO_URI;
if (mongoUri) {
  const mongoose = require('mongoose');
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection failed:', err.message));
} else {
  console.log('MongoDB URI not configured - running in demo mode');
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/file', require('./routes/fileRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    features: ['auth', 'file-upload', 'ai-analysis']
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
