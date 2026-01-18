# AI Integration Setup Guide

This guide helps you set up AI analysis for the Excel Analytics Platform.

## Free AI API: Groq

We use **Groq API** which offers free high-speed AI inference.

### Step 1: Get Groq API Key

1. Go to https://console.groq.com
2. Sign up for a free account
3. Create an API key
4. Copy the key

### Step 2: Configure Backend

1. Create a `.env` file in the `backend` folder:

```
GROQ_API_KEY=gsk_your_api_key_here
PORT=5000
NODE_ENV=development
```

2. Install dependencies:

```bash
cd backend
npm install
```

3. Start the backend:

```bash
npm start
```

The server will run on `http://localhost:5000`

### Step 3: Start Frontend

1. In another terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

### Step 4: Test AI Features

1. Upload an Excel file
2. Ask a question in the query bar
3. The AI will analyze your data and provide answers
4. Use the AI feature buttons (Correlation, Regression, Anomalies, Clustering)

## API Endpoints

### Query Analysis
```
POST /api/ai/analyze
Body: {
  data: Array,      // Excel data rows
  query: String     // User question
}

Response: {
  success: Boolean,
  analysis: String,
  recordsAnalyzed: Number
}
```

### Specific Analysis
```
POST /api/ai/specific
Body: {
  data: Array,      // Excel data rows
  type: String      // 'correlation', 'regression', 'anomaly', 'clustering'
}

Response: {
  success: Boolean,
  analysis: String,
  type: String
}
```

## Features Powered by AI

1. **Query Analysis** - Ask any question about your data
2. **Correlation Analysis** - Find relationships between columns
3. **Regression Analysis** - Identify trends and patterns
4. **Anomaly Detection** - Find outliers and unusual data
5. **Clustering Analysis** - Group similar records

## Troubleshooting

### Issue: "AI unavailable"
- Check if backend is running on port 5000
- Verify Groq API key is set correctly
- Check network connection

### Issue: Analysis is slow
- Groq API is rate-limited on free tier
- Wait a few seconds between queries
- Reduce data size if possible

### Issue: "Invalid API Key"
- Log in to https://console.groq.com
- Create a new API key
- Update .env file with new key
- Restart backend server

## Alternative: OpenAI

If you prefer OpenAI, modify `backend/ai/aiAnalyzer.js`:

```javascript
const OpenAI = require('openai').default;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Use openai.chat.completions.create() instead of groq
```

## Performance Tips

1. Keep Excel files under 10,000 rows for best performance
2. Batch multiple queries together
3. Use specific column names in queries
4. Ask clear, concise questions

## Security Notes

- Never commit .env files to GitHub
- Use .gitignore to exclude .env
- Keep API keys private
- Rotate keys periodically

## Support

For issues, refer to:
- Groq Documentation: https://groq.com/
- GitHub Issues: https://github.com/Austin-Joshua/excel-analytics-platform/issues
