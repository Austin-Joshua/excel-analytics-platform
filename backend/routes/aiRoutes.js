const express = require('express');
const router = express.Router();
const { analyzeExcelWithAI, performAnalysis } = require('../ai/aiAnalyzer');

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
 * Perform specific analysis
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

module.exports = router;
