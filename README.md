# Excel Analytics Platform 📊

Advanced AI-powered Excel data analysis platform with real-time insights and intelligent data processing.

## 🚀 Access the Website

**Frontend:** [http://localhost:3000](http://localhost:3000)
**Backend API:** [http://localhost:5000](http://localhost:5000)

## 📋 Server Status

✅ **Frontend Server** - Running on Port 3000
- React-based analytics interface with modern UI
- Drag-and-drop file upload functionality
- Real-time AI analytics and insights
- Interactive charts and data visualization
- Responsive design with mobile support

✅ **Backend Server** - Running on Port 5000
- Express.js API with AI analysis capabilities
- Excel/CSV file processing with xlsx library
- Groq AI integration for intelligent analysis
- Advanced analytics: anomaly detection, clustering, predictions
- Running in demo mode (MongoDB optional)

## 🎨 Features

### Frontend UI (React + HTML5)
- **Modern Design**: Gradient UI with purple theme
- **File Upload**: Instant processing with validation
- **AI Analytics**: Real-time analysis with Groq AI
- **Data Visualization**: Interactive charts and statistics
- **Smart Notifications**: Streamlined toast notifications (no duplicates)
- **Responsive Layout**: Works on all devices

### Backend AI Capabilities
- **General Analysis**: Ask AI questions about your data
- **Deep Analysis**: Correlation, regression, anomalies, clustering
- **Comparative Analysis**: Compare metrics across groups
- **Data Quality Reports**: Detailed quality metrics and recommendations
- **Data Summaries**: Statistical overviews
- **Predictions**: AI-powered trend analysis

### Latest Improvements (Jan 2026)
- ✅ Fixed multiple notification cards on rapid file uploads
- ✅ Improved state management to prevent data duplication
- ✅ Streamlined notification flow (Processing → Success only)
- ✅ Auto-trigger file analysis on upload
- ✅ Reset analytics on new file upload
- ✅ Cleanup of redundant UI states

## 📁 Project Structure

```
excel-analytics-platform/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html (Beautiful UI)
    ├── server.js (HTTP server)
    └── package.json
```

## 🛠️ Running the Servers

The servers are already running in background processes:

### Backend (Port 5000)
```bash
cd backend
node server.js
```

### Frontend (Port 3000)
```bash
cd frontend
node server.js
```

## 📝 Next Steps

1. Open http://localhost:3000 in your browser
2. Upload an Excel file (.xlsx, .xls, or .csv)
3. Click "Upload & Analyze" to process the file
4. View statistics and analytics

## 🔧 Configuration

To enable MongoDB:
1. Update the MONGO_URI in `.env` file
2. Restart the backend server

Example MongoDB URI:
```
MONGO_URI=mongodb://localhost:27017/excel-analytics
```

## 📦 Dependencies

### Backend
- express
- cors
- mongoose
- dotenv
- multer
- bcryptjs
- jsonwebtoken
- xlsx

### Frontend
- express (for serving static files)
- Basic HTML/CSS/JavaScript

## 🎯 API Endpoints

### File Upload
```
POST /api/file/upload
Content-Type: multipart/form-data
Body: { file: <binary>, userId: string }
Returns: Array of data objects
```

### AI Analysis Endpoints
```
POST /api/ai/analyze - General AI analysis with natural language queries
POST /api/ai/specific - Specific analysis (correlation, regression, anomaly, clustering)
POST /api/ai/compare - Comparative analysis between metrics
POST /api/ai/quality-report - Data quality assessment
POST /api/ai/data-summary - Statistical summary
POST /api/ai/recommendations - AI recommendations
```

### Auth Routes
```
Available under /api/auth
```

### Health Check
```
GET /api/health
```

## 📝 Recent Changes (v1.6)

### Bug Fixes
- **Fixed Multiple Notifications**: Resolved issue where duplicate notification cards appeared on rapid file uploads
- **State Management**: Improved React component state to prevent card duplication
- **Notification System**: Enhanced toast notifications with automatic deduplication

### Improvements
- Auto-trigger file analysis immediately upon upload
- Clear previous analysis results when uploading new files
- Reset chart selections on each new file upload
- Streamlined tab switching with result clearing

### Components Updated
- `frontend/src/components/FileUpload.js` - Added state reset on upload
- `frontend/src/components/AIAnalyzer.js` - Added useEffect for data cleanup
- `frontend/public/index.html` - Enhanced toast notification system

---

Enjoy analyzing your Excel files with AI! 📊✨
