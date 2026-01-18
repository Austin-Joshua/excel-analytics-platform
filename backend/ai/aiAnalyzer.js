const Groq = require('groq-sdk');
const axios = require('axios');

// Determine which AI provider to use
const USE_OPENAI = process.env.OPENAI_API_KEY ? true : false;
const USE_GROQ = process.env.GROQ_API_KEY ? true : false;

// Initialize Groq client (free AI API)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || ''
});

// Initialize OpenAI client (ChatGPT)
let openai = null;
if (USE_OPENAI) {
    const OpenAI = require('openai').default;
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
}

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
        
        // Create enhanced AI prompt with detailed context
        const prompt = `
You are an expert data analyst with deep statistical knowledge. Analyze the following Excel sheet data and answer the user's query.

## DATASET OVERVIEW
Total Records: ${data.length}
Column Names: ${Object.keys(data[0]).join(', ')}

## DETAILED DATA ANALYSIS
${JSON.stringify(dataSummary, null, 2)}

## USER QUERY
"${query}"

## ANALYSIS INSTRUCTIONS
Please provide a comprehensive, data-driven analysis:

1. **Direct Answer**: Clearly answer the user's specific query
2. **Statistical Insights**: Use the provided statistics (mean, median, std dev, quartiles)
3. **Data Quality Assessment**: Comment on completeness, outliers, and data reliability
4. **Correlation Analysis**: Highlight significant column relationships if any
5. **Patterns & Anomalies**: Identify trends, outliers (using IQR method), and unusual patterns
6. **Confidence Level**: Indicate confidence in findings based on data quality
7. **Recommendations**: Suggest next steps or data improvements

Use quantitative metrics from the data. Be precise and reference specific numbers.
`;

        let response;
        let provider = 'unknown';

        // Try OpenAI first if available
        if (USE_OPENAI && openai) {
            try {
                response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    max_tokens: 1000,
                    temperature: 0.7
                });

                return {
                    success: true,
                    analysis: response.choices[0].message.content,
                    timestamp: new Date(),
                    recordsAnalyzed: data.length,
                    provider: 'OpenAI GPT-3.5'
                };
            } catch (openaiError) {
                console.warn('OpenAI API error, falling back to Groq:', openaiError.message);
                // Fall through to Groq
            }
        }

        // Fall back to Groq
        if (USE_GROQ && groq) {
            response = await groq.messages.create({
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
                recordsAnalyzed: data.length,
                provider: 'Groq Mixtral'
            };
        }

        // If no AI provider available
        return {
            success: false,
            error: 'No AI provider configured. Set OPENAI_API_KEY or GROQ_API_KEY',
            fallback: provideFallbackAnalysis(data, query)
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
 * Prepare data summary for AI with enhanced accuracy
 * @param {Array} data - Excel data
 * @returns {Object} Data summary
 */
function prepareDataSummary(data) {
    const summary = {
        totalRecords: data.length,
        columns: {},
        statistics: {},
        dataQuality: {},
        correlations: {}
    };

    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    columns.forEach(col => {
        const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined);
        const numValues = values.filter(v => !isNaN(v) && v !== '');
        const isNumeric = numValues.length > values.length * 0.7;

        summary.columns[col] = {
            type: isNumeric ? 'numeric' : 'text',
            nullCount: data.length - values.length,
            nullPercentage: ((data.length - values.length) / data.length * 100).toFixed(2),
            uniqueCount: new Set(values.map(v => v.toString())).size,
            uniquePercentage: (new Set(values.map(v => v.toString())).size / values.length * 100).toFixed(2),
            sampleValues: values.slice(0, 5),
            dataCompleteness: ((values.length / data.length) * 100).toFixed(2)
        };

        // Enhanced statistics for numeric columns
        if (numValues.length > 0) {
            const numericVals = numValues.map(v => parseFloat(v));
            const sorted = numericVals.sort((a, b) => a - b);
            const sum = numericVals.reduce((a, b) => a + b, 0);
            const mean = sum / numericVals.length;
            const variance = numericVals.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / numericVals.length;
            const stdDev = Math.sqrt(variance);

            summary.statistics[col] = {
                min: Math.min(...numericVals),
                max: Math.max(...numericVals),
                range: Math.max(...numericVals) - Math.min(...numericVals),
                mean: mean.toFixed(2),
                median: sorted[Math.floor(sorted.length / 2)].toFixed(2),
                stdDev: stdDev.toFixed(2),
                variance: variance.toFixed(2),
                q1: sorted[Math.floor(sorted.length * 0.25)],
                q3: sorted[Math.floor(sorted.length * 0.75)],
                count: numericVals.length
            };

            // Detect outliers using IQR method
            const q1 = sorted[Math.floor(sorted.length * 0.25)];
            const q3 = sorted[Math.floor(sorted.length * 0.75)];
            const iqr = q3 - q1;
            const outliers = numericVals.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr);
            summary.dataQuality[col] = {
                outlierCount: outliers.length,
                outlierPercentage: (outliers.length / numericVals.length * 100).toFixed(2),
                outlierValues: outliers.slice(0, 3)
            };
        }
    });

    // Calculate correlations between numeric columns
    const numericCols = Object.entries(summary.columns)
        .filter(([_, info]) => info.type === 'numeric')
        .map(([col, _]) => col);

    if (numericCols.length > 1) {
        for (let i = 0; i < numericCols.length; i++) {
            for (let j = i + 1; j < numericCols.length; j++) {
                const col1 = numericCols[i];
                const col2 = numericCols[j];
                const correlation = calculateCorrelation(data, col1, col2);
                if (Math.abs(correlation) > 0.3) { // Only significant correlations
                    summary.correlations[`${col1} <-> ${col2}`] = parseFloat(correlation.toFixed(2));
                }
            }
        }
    }

    return summary;
}

/**
 * Calculate Pearson correlation between two numeric columns
 * @param {Array} data - Excel data
 * @param {String} col1 - First column name
 * @param {String} col2 - Second column name
 * @returns {Number} Correlation coefficient (-1 to 1)
 */
function calculateCorrelation(data, col1, col2) {
    const pairs = data
        .map(row => [parseFloat(row[col1]), parseFloat(row[col2])])
        .filter(pair => !isNaN(pair[0]) && !isNaN(pair[1]));

    if (pairs.length < 2) return 0;

    const n = pairs.length;
    const sum1 = pairs.reduce((s, p) => s + p[0], 0);
    const sum2 = pairs.reduce((s, p) => s + p[1], 0);
    const sumProduct = pairs.reduce((s, p) => s + p[0] * p[1], 0);
    const sum1Sq = pairs.reduce((s, p) => s + p[0] * p[0], 0);
    const sum2Sq = pairs.reduce((s, p) => s + p[1] * p[1], 0);

    const numerator = n * sumProduct - sum1 * sum2;
    const denominator = Math.sqrt((n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2));

    return denominator === 0 ? 0 : numerator / denominator;
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
        const dataSummary = prepareDataSummary(data);

        switch (type.toLowerCase()) {
            case 'correlation':
                analysisPrompt = `
## CORRELATION ANALYSIS REQUEST
Perform a detailed correlation analysis on this dataset.

${JSON.stringify(dataSummary, null, 2)}

PLEASE PROVIDE:
1. Pearson correlation coefficients for numeric column pairs
2. Strength interpretation (strong/moderate/weak)
3. Which columns move together and why (business context)
4. Correlation matrix summary
5. Multicollinearity concerns if any
6. Actionable insights from relationships
`;
                break;
            case 'regression':
                analysisPrompt = `
## REGRESSION & TREND ANALYSIS REQUEST
Identify trends and perform regression analysis on this dataset.

${JSON.stringify(dataSummary, null, 2)}

PLEASE PROVIDE:
1. Overall trend direction and strength
2. Time-based or sequential trends if applicable
3. Regression insights (which factors influence outcomes)
4. Rate of change calculations
5. Forecast considerations
6. R-squared or goodness-of-fit indicators
7. Confidence intervals
`;
                break;
            case 'anomaly':
                analysisPrompt = `
## ANOMALY & OUTLIER DETECTION
Identify anomalies, outliers, and unusual patterns in this dataset.

${JSON.stringify(dataSummary, null, 2)}

PLEASE PROVIDE:
1. Outliers detected using IQR method (already flagged in data quality)
2. Statistical anomalies (beyond 3 standard deviations)
3. Contextual anomalies (unusual patterns)
4. Frequency of anomalies
5. Severity assessment (critical, moderate, minor)
6. Potential causes of anomalies
7. Recommended data cleaning or investigation steps
`;
                break;
            case 'clustering':
                analysisPrompt = `
## CLUSTERING & SEGMENTATION ANALYSIS
Group similar records and identify natural clusters in this dataset.

${JSON.stringify(dataSummary, null, 2)}

PLEASE PROVIDE:
1. Potential clusters based on similarity
2. Number of suggested clusters
3. Cluster characteristics and profiles
4. Within-cluster vs between-cluster variance
5. Records per cluster distribution
6. Silhouette or separation quality
7. Business interpretation of clusters
8. Use cases for each cluster
`;
                break;
            default:
                return { error: 'Unknown analysis type' };
        }

        let response;
        let provider = 'unknown';

        // Try OpenAI first if available
        if (USE_OPENAI && openai) {
            try {
                response = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: analysisPrompt
                    }],
                    max_tokens: 1000,
                    temperature: 0.7
                });

                return {
                    success: true,
                    type: type,
                    analysis: response.choices[0].message.content,
                    timestamp: new Date(),
                    provider: 'OpenAI GPT-3.5'
                };
            } catch (openaiError) {
                console.warn('OpenAI API error, falling back to Groq:', openaiError.message);
                // Fall through to Groq
            }
        }

        // Fall back to Groq
        if (USE_GROQ && groq) {
            response = await groq.messages.create({
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
                timestamp: new Date(),
                provider: 'Groq Mixtral'
            };
        }

        return {
            success: false,
            error: 'No AI provider configured'
        };

    } catch (error) {
        console.error('Analysis Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Perform comparative analysis
 * @param {Array} data - Excel data
 * @param {String} metric - Metric to compare
 * @param {String} groupBy - Column to group by
 * @returns {Promise} Comparison analysis
 */
async function performComparison(data, metric, groupBy) {
    try {
        const dataSummary = prepareDataSummary(data);
        
        // Group data and calculate metrics
        const groups = {};
        data.forEach(row => {
            const key = row[groupBy];
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
        });

        const comparison = {};
        Object.entries(groups).forEach(([key, groupData]) => {
            const values = groupData.map(r => parseFloat(r[metric])).filter(v => !isNaN(v));
            if (values.length > 0) {
                comparison[key] = {
                    count: values.length,
                    sum: values.reduce((a, b) => a + b, 0),
                    mean: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
                    min: Math.min(...values),
                    max: Math.max(...values)
                };
            }
        });

        const prompt = `
Perform a comparative analysis of the metric "${metric}" grouped by "${groupBy}".

Dataset Summary:
${JSON.stringify(dataSummary, null, 2)}

Comparative Data:
${JSON.stringify(comparison, null, 2)}

PROVIDE:
1. Comparison summary between groups
2. Best and worst performing groups
3. Statistical significance
4. Percentage differences
5. Trends across groups
6. Key findings and insights
`;

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
            type: 'comparison',
            metric: metric,
            groupBy: groupBy,
            analysis: response.content[0].text,
            timestamp: new Date(),
            provider: 'Groq Mixtral'
        };

    } catch (error) {
        console.error('Comparison Analysis Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate data quality report
 * @param {Array} data - Excel data
 * @returns {Object} Quality report
 */
function generateQualityReport(data) {
    const dataSummary = prepareDataSummary(data);
    const report = {
        totalRecords: data.length,
        columnCount: Object.keys(data[0]).length,
        columns: {}
    };

    Object.entries(dataSummary.columns).forEach(([col, info]) => {
        const quality = {
            completeness: parseFloat(info.dataCompleteness),
            uniqueness: parseFloat(info.uniquePercentage),
            nullPercentage: parseFloat(info.nullPercentage),
            isDuplicated: info.uniquePercentage < 50,
            hasOutliers: dataSummary.dataQuality[col] ? parseFloat(dataSummary.dataQuality[col].outlierPercentage) > 0 : false,
            outlierPercentage: dataSummary.dataQuality[col]?.outlierPercentage || 0,
            overallScore: 0
        };

        // Calculate quality score (0-100)
        quality.overallScore = (
            quality.completeness * 0.5 +
            Math.min(quality.uniqueness, 100) * 0.3 -
            parseFloat(quality.outlierPercentage) * 0.2
        ).toFixed(2);

        report.columns[col] = quality;
    });

    return report;
}

module.exports = {
    analyzeExcelWithAI,
    performAnalysis,
    performComparison,
    prepareDataSummary,
    calculateCorrelation,
    generateQualityReport,
    provideFallbackAnalysis
};
