const express = require('express');
const router = express.Router();
const { 
    analyzeExcelWithAI, 
    performAnalysis, 
    performComparison,
    generateQualityReport,
    prepareDataSummary
} = require('../ai/aiAnalyzer');

/**
 * POST /api/ai/analyze
 * Analyze Excel data with AI
 * Body: { data: Array, query: String }
 */
router.post('/analyze', async (req, res) => {
    try {
        const { data, query } = req.body;

        if (!data || !query) {
            return res.status(400).json({
                success: false,
                error: 'Data and query are required'
            });
        }

        const result = await analyzeExcelWithAI(data, query);
        res.json(result);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/ai/specific
 * Perform specific analysis (correlation, regression, anomaly, clustering)
 * Body: { data: Array, type: String }
 */
router.post('/specific', async (req, res) => {
    try {
        const { data, type } = req.body;

        if (!data || !type) {
            return res.status(400).json({
                success: false,
                error: 'Data and analysis type are required'
            });
        }

        const result = await performAnalysis(data, type);
        res.json(result);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/ai/compare
 * Perform comparative analysis
 * Body: { data: Array, metric: String, groupBy: String }
 */
router.post('/compare', async (req, res) => {
    try {
        const { data, metric, groupBy } = req.body;

        if (!data || !metric || !groupBy) {
            return res.status(400).json({
                success: false,
                error: 'Data, metric, and groupBy column are required'
            });
        }

        // Validate that columns exist
        if (!data[0][metric] || !data[0][groupBy]) {
            return res.status(400).json({
                success: false,
                error: 'Invalid metric or groupBy column names'
            });
        }

        const result = await performComparison(data, metric, groupBy);
        res.json(result);

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/ai/quality-report
 * Generate data quality report
 * Body: { data: Array }
 */
router.post('/quality-report', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || data.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Data is required'
            });
        }

        const report = generateQualityReport(data);
        res.json({
            success: true,
            report: report,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/ai/data-summary
 * Get detailed data summary with statistics
 * Body: { data: Array }
 */
router.post('/data-summary', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || data.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Data is required'
            });
        }

        const summary = prepareDataSummary(data);
        res.json({
            success: true,
            summary: summary,
            recordCount: data.length,
            columnCount: Object.keys(data[0]).length,
            timestamp: new Date()
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/ai/recommendations
 * Get AI recommendations based on data analysis
 * Body: { data: Array }
 */
router.post('/recommendations', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || data.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Data is required'
            });
        }

        const summary = prepareDataSummary(data);
        const qualityReport = generateQualityReport(data);

        const prompt = `
Based on this Excel data summary and quality report, provide actionable recommendations:

DATA SUMMARY:
${JSON.stringify(summary, null, 2)}

QUALITY REPORT:
${JSON.stringify(qualityReport, null, 2)}

PROVIDE:
1. Data quality improvements needed
2. Columns with data issues
3. Suggested data cleaning steps
4. Best analysis approaches for this dataset
5. Potential risks or limitations
6. Recommended follow-up analyses
7. Best practices for this data type

Be specific and actionable.
`;

        const { analyzeExcelWithAI } = require('../ai/aiAnalyzer');
        
        // Use Groq directly for recommendations
        const Groq = require('groq-sdk');
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });

        const response = await groq.messages.create({
            model: 'mixtral-8x7b-32768',
            max_tokens: 1500,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        res.json({
            success: true,
            recommendations: response.content[0].text,
            qualityScore: Object.values(qualityReport.columns).reduce((sum, col) => sum + parseFloat(col.overallScore), 0) / Object.keys(qualityReport.columns).length,
            timestamp: new Date(),
            provider: 'Groq Mixtral'
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
