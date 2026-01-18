# Excel Analytics Platform 📊

Your Excel Analytics Platform is now running!

## 🚀 Access the Website

**Frontend:** [http://localhost:3000](http://localhost:3000)
**Backend API:** [http://localhost:5000](http://localhost:5000)

## 📋 Server Status

✅ **Frontend Server** - Running on Port 3000
- Simple HTML interface with beautiful UI
- File upload functionality
- File analytics and statistics

✅ **Backend Server** - Running on Port 5000
- Express.js API
- Excel file processing with xlsx library
- File upload endpoints
- Running in demo mode (MongoDB optional)

## 🎨 Features

### Frontend UI
- Modern gradient design with purple theme
- Drag-and-drop file upload
- File size and format validation
- Real-time upload status
- File processing statistics
- Responsive design

### Backend API
- `/api/file/upload` - POST endpoint for file uploads
- `/api/file/test` - GET endpoint to test backend connectivity
- `/api/auth` - Authentication routes
- Multer support for file handling
- CORS enabled for cross-origin requests

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
Body: { file: <binary> }
```

### Test Connection
```
GET /api/file/test
```

### Auth Routes
```
Available under /api/auth
```

---

Enjoy analyzing your Excel files! 📊
