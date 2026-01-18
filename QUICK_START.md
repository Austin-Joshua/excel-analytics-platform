# ⚡ Quick Start Guide - AI Analytics Platform

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

### Step 3: Upload & Analyze

1. Open `http://localhost:3000`
2. Click to upload an Excel file (.csv, .xlsx, .xls)
3. Select X and Y axes for visualization
4. Click on **AI Analytics Engine** tab
5. Choose analysis type and click analyze!

---

## 📊 What You Can Do

### 🔍 General Analysis
Ask AI questions about your data:
- "What are the sales trends?"
- "Find correlations between columns"
- "Identify anomalies"

### 📈 Deep Analysis (4 Types)
- **Correlation**: Find related columns
- **Regression**: Identify trends
- **Anomaly**: Detect outliers
- **Clustering**: Group similar data

### ⚖️ Compare Metrics
Compare any metric across groups:
- Compare sales by region
- Compare revenue by department
- Compare performance by category

### ✅ Data Quality
Get detailed quality metrics:
- Completeness percentage
- Outlier detection
- Data reliability score
- Improvement recommendations

---

## 🎯 Sample Data to Test

Here's sample sales data you can use:

```csv
Month,Region,Product,Sales,Units,Margin
January,North,A,5000,100,25%
January,North,B,4500,90,22%
January,South,A,4000,80,25%
January,South,B,5500,110,20%
February,North,A,6000,120,26%
February,North,B,5500,110,23%
February,South,A,5000,100,25%
February,South,B,6000,120,21%
```

---

## 🤖 How AI Works

Your platform uses **Groq's Mixtral 8x7B**, a powerful free AI model that:

✅ Analyzes data instantly  
✅ Detects patterns and trends  
✅ Finds correlations  
✅ Spots anomalies  
✅ Provides recommendations  
✅ No API costs!  

---

## 📍 Key Features by Tab

### Tab 1: General Analysis
```
Input:  Your question about data
Output: AI-powered analysis with insights
```
Example: "What are the top 3 performing products?"

### Tab 2: Deep Analysis
```
Select: correlation | regression | anomaly | clustering
Output: Detailed statistical analysis
```

### Tab 3: Compare
```
Select: Metric (e.g., Sales)
Select: Group by (e.g., Region)
Output: Comparative analysis with rankings
```

### Tab 4: Quality
- **Quality Report**: Data quality metrics and scores
- **Data Summary**: Detailed statistics per column
- **Recommendations**: AI suggestions for data improvement

---

## 🎨 UI Guide

### Left Panel
- **Tabs**: 4 analysis types
- **Inputs**: Questions, selections, parameters
- **Button**: Trigger analysis

### Right Panel
- **Results**: AI analysis and findings
- **Charts**: Quality metrics visualization
- **Details**: Expandable statistics

### Top Section
- **File Upload**: Drag & drop or click
- **Chart Controls**: Select X and Y axes
- **Data Info**: Record and column counts

### Bottom Section
- **Data Preview**: First 5 rows
- **Table View**: All columns visible

---

## 🔧 Troubleshooting

### Issue: "Failed to connect to server"
**Solution:** Make sure backend is running on port 5000
```bash
cd backend && npm start
```

### Issue: Groq API error
**Solution:** Check internet connection, wait a moment, retry

### Issue: "Data and query are required"
**Solution:** Upload file first, then enter analysis query

### Issue: No columns showing
**Solution:** Ensure file is valid Excel/CSV format

---

## 📚 Example Workflows

### Workflow 1: Sales Analysis
1. Upload sales.csv
2. Select Month (X) and Sales (Y)
3. Go to General Analysis tab
4. Ask: "What are the monthly trends?"
5. View AI insights
6. Switch to Quality tab for data assessment

### Workflow 2: Data Validation
1. Upload dataset.xlsx
2. Go to Quality tab
3. Click "Quality Report"
4. Review quality scores
5. Click "Get Recommendations"
6. Follow suggested data improvements

### Workflow 3: Pattern Discovery
1. Upload customer_data.csv
2. Go to Deep Analysis tab
3. Select "Clustering"
4. Review customer segments
5. Use "Compare" tab to analyze by segment
6. Export insights

---

## 📊 Data Format Requirements

### Supported Formats
✅ CSV (.csv)  
✅ Excel (.xlsx)  
✅ Excel 97-2003 (.xls)  

### Data Structure
- **First row**: Column headers
- **Format**: Comma-separated (CSV) or Excel format
- **Encoding**: UTF-8 preferred
- **Max size**: Tested with 50,000+ rows

### Example Format
```
Column1,Column2,Column3
Value1,Value2,Value3
Value4,Value5,Value6
```

---

## 🎯 Tips & Tricks

1. **Ask specific questions**
   - ✅ Good: "What are sales by region?"
   - ❌ Bad: "Tell me about this"

2. **Use exact column names**
   - Reference columns exactly as shown

3. **Check data quality first**
   - Run quality report before deep analysis
   - Missing data affects results

4. **Compare related metrics**
   - Group by logical categories
   - Look for statistical significance

5. **Verify anomalies manually**
   - AI detects statistical outliers
   - Check context in original data

---

## 🚀 Next Steps

1. Try the sample data above
2. Upload your own Excel file
3. Explore all 4 analysis types
4. Check data quality
5. Get AI recommendations
6. Share insights with team

---

## 📞 Need Help?

- Check **AI_FEATURES.md** for detailed documentation
- Review error messages carefully
- Ensure data format is correct
- Verify file contains data

---

## 🎉 You're All Set!

Your AI Analytics Platform is ready to explore data!

**Start analyzing now:** 🚀 http://localhost:3000

---

**Happy analyzing!** 📊✨
