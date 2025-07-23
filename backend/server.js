const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/file', require('./routes/fileRoutes'));

app.listen(5000, () => console.log('Server running on port 5000'));
