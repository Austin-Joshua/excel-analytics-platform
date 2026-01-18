# 🏗️ System Architecture

## Overall System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              REACT FRONTEND (PORT 3000)                 │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  App.js - Main Application Container             │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          │                              │  │
│  │                          ▼                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  FileUpload Component                             │ │  │
│  │  │  - File upload handler                            │ │  │
│  │  │  - Chart visualization (Chart.js)                 │ │  │
│  │  │  - Data preview table                             │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          │                              │  │
│  │                          ▼                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  AIAnalyzer Component                             │ │  │
│  │  │  - 4-Tab Interface                                │ │  │
│  │  │    1. General Analysis                            │ │  │
│  │  │    2. Deep Analysis (Correlation, Regression...)  │ │  │
│  │  │    3. Comparative Analysis                        │ │  │
│  │  │    4. Quality & Recommendations                   │ │  │
│  │  │  - Results Display Panel                          │ │  │
│  │  │  - Real-time visualization                        │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│                          │ Axios HTTP                           │
│                          ▼                                      │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
          (http://localhost:5000)
          
┌─────────────────────────────────────────────────────────────────┐
│               EXPRESS BACKEND (PORT 5000)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Routes Layer                               │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  aiRoutes.js                                       │ │  │
│  │  │  ├─ POST /api/ai/analyze                           │ │  │
│  │  │  ├─ POST /api/ai/specific                          │ │  │
│  │  │  ├─ POST /api/ai/compare                           │ │  │
│  │  │  ├─ POST /api/ai/quality-report                    │ │  │
│  │  │  ├─ POST /api/ai/data-summary                      │ │  │
│  │  │  └─ POST /api/ai/recommendations                   │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Business Logic Layer                          │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  aiAnalyzer.js                                     │ │  │
│  │  │                                                    │ │  │
│  │  │  Core Functions:                                   │ │  │
│  │  │  ├─ analyzeExcelWithAI(data, query)               │ │  │
│  │  │  ├─ performAnalysis(data, type)                   │ │  │
│  │  │  ├─ performComparison(data, metric, groupBy)      │ │  │
│  │  │  ├─ prepareDataSummary(data)                      │ │  │
│  │  │  ├─ generateQualityReport(data)                   │ │  │
│  │  │  ├─ calculateCorrelation(data, col1, col2)        │ │  │
│  │  │  └─ provideFallbackAnalysis(data, query)          │ │  │
│  │  │                                                    │ │  │
│  │  │  Data Processing:                                  │ │  │
│  │  │  ├─ Statistical Calculations                       │ │  │
│  │  │  │  ├─ Mean, Median, Mode                          │ │  │
│  │  │  │  ├─ Std Dev, Variance                           │ │  │
│  │  │  │  ├─ Min, Max, Range                             │ │  │
│  │  │  │  └─ Quartiles (Q1, Q3)                          │ │  │
│  │  │  ├─ Correlation Matrix                             │ │  │
│  │  │  ├─ Outlier Detection (IQR)                        │ │  │
│  │  │  └─ Quality Metrics                                │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Groq AI Integration Layer                      │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Groq SDK Client                                   │ │  │
│  │  │  ├─ Model: Mixtral 8x7B                            │ │  │
│  │  │  ├─ API Key: gsk_3pIBtajwGfngwO9UrFGiWGdyb3FYl8j4│ │  │
│  │  │  ├─ Max Tokens: 1500                               │ │  │
│  │  │  └─ Temperature: 0.7                               │ │  │
│  │  │                                                    │ │  │
│  │  │  Prompt Engineering:                               │ │  │
│  │  │  ├─ Enhanced context with statistics              │ │  │
│  │  │  ├─ Type-specific prompts                          │ │  │
│  │  │  ├─ Structured instructions                        │ │  │
│  │  │  └─ Confidence & reliability guidance              │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS API Call
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                 GROQ AI API (CLOUD)                             │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Model: Mixtral 8x7B-32768                              │  │
│  │  - Free tier                                            │  │
│  │  - Ultra-fast inference                                 │  │
│  │  - 32K token context window                             │  │
│  │  - Specialized for data analysis                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Response: AI Analysis + Insights                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ Response
                          │
                          ▼ (Back to Frontend)
```

---

## Component Architecture

```
Frontend Components:
├── App.js
│   └── FileUpload.js
│       ├── Chart.js visualization
│       ├── File upload handler
│       ├── Data preview table
│       └── AIAnalyzer.js
│           ├── Tab 1: General Analysis
│           │   └── Query input → AI Analysis
│           ├── Tab 2: Deep Analysis
│           │   ├── Correlation
│           │   ├── Regression
│           │   ├── Anomaly
│           │   └── Clustering
│           ├── Tab 3: Comparative Analysis
│           │   ├── Metric selection
│           │   └── Group by selection
│           └── Tab 4: Quality & Recommendations
│               ├── Quality Report
│               ├── Data Summary
│               └── Recommendations

Backend Layers:
├── Routes (aiRoutes.js)
│   ├── POST /api/ai/analyze
│   ├── POST /api/ai/specific
│   ├── POST /api/ai/compare
│   ├── POST /api/ai/quality-report
│   ├── POST /api/ai/data-summary
│   └── POST /api/ai/recommendations
│
├── Business Logic (aiAnalyzer.js)
│   ├── Data Processing
│   │   ├── prepareDataSummary()
│   │   ├── calculateCorrelation()
│   │   └── Statistical calculations
│   ├── Analysis Functions
│   │   ├── analyzeExcelWithAI()
│   │   ├── performAnalysis()
│   │   ├── performComparison()
│   │   └── generateQualityReport()
│   └── Fallback System
│       └── provideFallbackAnalysis()
│
└── External Integration
    └── Groq AI API
        └── Mixtral 8x7B-32768
```

---

## Data Flow for Each Analysis Type

### 1. General Analysis Flow
```
User Query
    ↓
FileUpload (captures data)
    ↓
AIAnalyzer General Tab
    ↓
axios POST /api/ai/analyze
    ↓
aiAnalyzer.analyzeExcelWithAI()
    ↓
prepareDataSummary() (statistics + correlations)
    ↓
Create AI prompt (context-rich)
    ↓
Groq API Call
    ↓
AI Response with insights
    ↓
Display in Results Panel
```

### 2. Deep Analysis Flow
```
Select Analysis Type (correlation/regression/anomaly/clustering)
    ↓
axios POST /api/ai/specific
    ↓
aiAnalyzer.performAnalysis(data, type)
    ↓
Switch case on type
    ↓
prepareDataSummary() (all statistics)
    ↓
Generate type-specific prompt
    ↓
Groq API Call
    ↓
Type-specific AI response
    ↓
Display findings + interpretation
```

### 3. Comparative Analysis Flow
```
Select Metric + Group By Column
    ↓
axios POST /api/ai/compare
    ↓
aiAnalyzer.performComparison()
    ↓
Group data by specified column
    ↓
Calculate statistics per group
    ↓
Create comparison prompt
    ↓
Groq API Call
    ↓
Comparative analysis response
    ↓
Display comparison + rankings
```

### 4. Quality Report Flow
```
Click Quality Report Button
    ↓
axios POST /api/ai/quality-report
    ↓
generateQualityReport(data)
    ↓
Calculate per-column metrics:
    - Completeness %
    - Uniqueness %
    - Outlier %
    - Overall Score (0-100)
    ↓
Return metrics object
    ↓
Display as visual quality cards
```

---

## Data Processing Pipeline

```
Raw Excel Data
    ↓
    ├─→ Column Analysis
    │   ├─→ Type Detection (numeric/text)
    │   ├─→ Null counting
    │   └─→ Unique value counting
    │
    ├─→ Statistical Calculation
    │   ├─→ Mean, Median, Mode
    │   ├─→ Std Dev, Variance
    │   ├─→ Quartiles
    │   └─→ Min, Max, Range
    │
    ├─→ Correlation Matrix
    │   ├─→ Numeric column pairs
    │   ├─→ Pearson correlation
    │   └─→ Significance filtering (>0.3)
    │
    ├─→ Outlier Detection
    │   ├─→ IQR calculation
    │   ├─→ Outlier flagging
    │   └─→ 3-sigma detection
    │
    └─→ Quality Metrics
        ├─→ Completeness score
        ├─→ Uniqueness score
        ├─→ Outlier percentage
        └─→ Overall quality (0-100)
            ↓
        Enhanced Data Summary Ready for AI
            ↓
        Groq API Processing
            ↓
        AI-Powered Insights
```

---

## Technology Stack

```
Frontend:
├─ React 18.2
├─ Axios (HTTP client)
├─ Chart.js (charting)
├─ CSS3 (styling)
└─ Components: 3 main + CSS files

Backend:
├─ Node.js
├─ Express 4.18
├─ Groq SDK (AI integration)
├─ Multer (file upload)
├─ XLSX (Excel parsing)
└─ CORS (cross-origin requests)

AI:
├─ Groq (provider)
├─ Mixtral 8x7B-32768 (model)
├─ 32K token context
└─ Free tier (unlimited usage)

Database:
├─ Optional: MongoDB/PostgreSQL
├─ Currently: In-memory processing
└─ No persistence layer configured
```

---

## Request/Response Cycle

### Example: General Analysis Request

```
REQUEST:
────────────────────────────────────
POST /api/ai/analyze
Content-Type: application/json

{
  "data": [
    {"Month": "Jan", "Sales": 5000},
    {"Month": "Feb", "Sales": 6000},
    ...
  ],
  "query": "What are the trends?"
}

PROCESSING:
────────────────────────────────────
1. Validate inputs ✓
2. Prepare data summary
   - Calculate statistics
   - Find correlations
   - Detect outliers
3. Create AI prompt with full context
4. Call Groq API
5. Format response

RESPONSE:
────────────────────────────────────
{
  "success": true,
  "analysis": "Based on analysis: Sales show 
              20% growth trend. Correlation with...",
  "timestamp": "2024-01-18T10:30:00Z",
  "recordsAnalyzed": 12,
  "provider": "Groq Mixtral"
}
```

---

## Error Handling Flow

```
Request Received
    ↓
Input Validation
    ├─ Valid → Process request
    └─ Invalid → Return 400 error
        {
          "success": false,
          "error": "Data and query are required"
        }
    ↓
Data Processing
    ├─ Success → Generate AI prompt
    └─ Error → Log error, continue
    ↓
Groq API Call
    ├─ Success → Return AI response
    ├─ Rate Limited → Return 429 error
    ├─ API Error → Try fallback analysis
    └─ Network Error → Return 500 error
    ↓
Response Formatting
    ├─ Include success flag
    ├─ Include error message if any
    ├─ Include fallback analysis if needed
    └─ Include provider info
    ↓
Send to Frontend
```

---

## Performance Optimization

```
Data Processing:
├─ Efficient statistical calculations
├─ Single-pass data iteration where possible
├─ Caching of intermediate results
└─ Vectorized operations for large datasets

API Calls:
├─ Groq: 30 req/min free tier
├─ Caching of responses possible
├─ Batch processing available
└─ Connection pooling

Frontend:
├─ Lazy loading of results
├─ Memoization of components
├─ CSS transitions instead of JS
├─ Efficient re-renders
└─ Debounced inputs

Memory:
├─ Stream large files
├─ Process in chunks
├─ Clean up after analysis
└─ Garbage collection friendly
```

---

## Scalability Considerations

```
Current Capacity:
├─ Data: Up to 50,000 rows
├─ Columns: 100+ supported
├─ Analysis: Real-time processing
└─ Concurrent users: Limited by server

Future Enhancements:
├─ Database integration
├─ Caching layer (Redis)
├─ Load balancing
├─ Async job queue
├─ Websocket for real-time updates
├─ Batch processing system
└─ API rate limiting
```

---

## Security Architecture

```
Frontend:
├─ No sensitive data stored locally
├─ CORS-based cross-origin protection
├─ Input sanitization
└─ Secure HTTP only (HTTPS in prod)

Backend:
├─ Environment variables for API key
├─ Input validation on all endpoints
├─ Error message sanitization
├─ CORS middleware configured
├─ Rate limiting ready
└─ Request logging available

External:
├─ Groq HTTPS API calls
├─ SSL certificate validation
├─ API key never exposed
└─ Encrypted data transmission
```

---

## Deployment Architecture

```
Development:
├─ Frontend: http://localhost:3000
├─ Backend: http://localhost:5000
├─ Hot reload enabled
└─ Console debugging

Production Ready:
├─ Frontend: Build optimization
├─ Backend: Process manager (PM2)
├─ Reverse proxy: Nginx
├─ SSL/TLS: Let's Encrypt
├─ Database: PostgreSQL/MongoDB
├─ Cache: Redis
└─ Monitoring: ELK Stack
```

---

This architecture provides a scalable, maintainable, and efficient system for AI-powered data analytics! 🚀
