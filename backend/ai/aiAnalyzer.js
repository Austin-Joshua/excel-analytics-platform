const Groq = require('groq-sdk');
const axios = require('axios');

// Initialize Groq client (free AI API)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_your_key_here'
});

/**
 * Analyze Excel data with AI
 * @param {Array} data - Array of row objects
 * @param {String} query - User query about the data
 * @returns {Promise} AI analysis result
 */
async function analyzeExcelWithAI(data, query) {
    try {
        if (!data || data.length === 0) {
            return { error: 'No data provided' };
        }

        // Prepare data summary for AI
        const dataSummary = prepareDataSummary(data);
        
        // Create AI prompt
        const prompt = `
You are an expert data analyst. Analyze the following Excel sheet data and answer the user's query.

Data Summary:
${JSON.stringify(dataSummary, null, 2)}

Column Names: ${Object.keys(data[0]).join(', ')}
Total Records: ${data.length}

User Query: "${query}"

Please provide a detailed, accurate analysis based on the data provided. Include:
1. Direct answer to the query
2. Key insights
3. Any patterns or anomalies found
4. Recommendations

Be concise but informative.
`;

        // Call Groq API
        const response = await groq.messages.create({
            model: 'mixtral-8x7b-32768',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        return {
            success: true,
            analysis: response.content[0].text,
            timestamp: new Date(),
            recordsAnalyzed: data.length
        };

    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            success: false,
            error: error.message,
            fallback: provideFallbackAnalysis(data, query)
        };
    }
}

/**
 * Prepare data summary for AI
 * @param {Array} data - Excel data
 * @returns {Object} Data summary
 */
function prepareDataSummary(data) {
    const summary = {
        totalRecords: data.length,
        columns: {},
        statistics: {}
    };

    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    columns.forEach(col => {
        const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined);
        const numValues = values.filter(v => !isNaN(v) && v !== '');

        summary.columns[col] = {
            type: numValues.length > values.length * 0.7 ? 'numeric' : 'text',
            nullCount: data.length - values.length,
            uniqueCount: new Set(values.map(v => v.toString())).size,
            sampleValues: values.slice(0, 3)
        };

        if (numValues.length > 0) {
            const numericVals = numValues.map(v => parseFloat(v));
            summary.statistics[col] = {
                min: Math.min(...numericVals),
                max: Math.max(...numericVals),
                avg: (numericVals.reduce((a, b) => a + b, 0) / numericVals.length).toFixed(2),
                count: numericVals.length
            };
        }
    });

    return summary;
}

/**
 * Fallback analysis when AI API fails
 * @param {Array} data - Excel data
 * @param {String} query - User query
 * @returns {String} Analysis result
 */
function provideFallbackAnalysis(data, query) {
    const summary = prepareDataSummary(data);
    let analysis = `Data Analysis Report:\n\n`;

    analysis += `Total Records: ${data.length}\n`;
    analysis += `Columns: ${Object.keys(data[0]).join(', ')}\n\n`;

    Object.entries(summary.columns).forEach(([col, info]) => {
        analysis += `${col}:\n`;
        analysis += `  - Type: ${info.type}\n`;
        analysis += `  - Missing: ${info.nullCount}\n`;
        analysis += `  - Unique Values: ${info.uniqueCount}\n`;
    });

    return analysis;
}

/**
 * Perform specific analysis type
 * @param {Array} data - Excel data
 * @param {String} type - Analysis type (correlation, regression, anomaly, etc.)
 * @returns {Promise} Analysis result
 */
async function performAnalysis(data, type) {
    try {
        let analysisPrompt = '';

        switch (type.toLowerCase()) {
            case 'correlation':
                analysisPrompt = `Analyze the correlation between columns in this dataset. Identify which columns are related: ${JSON.stringify(prepareDataSummary(data))}`;
                break;
            case 'regression':
                analysisPrompt = `Perform regression analysis on this dataset and identify trends: ${JSON.stringify(prepareDataSummary(data))}`;
                break;
            case 'anomaly':
                analysisPrompt = `Identify anomalies and outliers in this dataset: ${JSON.stringify(prepareDataSummary(data))}`;
                break;
            case 'clustering':
                analysisPrompt = `Group similar records in this dataset and identify clusters: ${JSON.stringify(prepareDataSummary(data))}`;
                break;
            default:
                return { error: 'Unknown analysis type' };
        }

        const response = await groq.messages.create({
            model: 'mixtral-8x7b-32768',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: analysisPrompt
            }]
        });

        return {
            success: true,
            type: type,
            analysis: response.content[0].text,
            timestamp: new Date()
        };

    } catch (error) {
        console.error('Analysis Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    analyzeExcelWithAI,
    performAnalysis,
    prepareDataSummary,
    provideFallbackAnalysis
};
