const ss = require('simple-statistics');

/**
 * Generates AI-powered insights from data
 * Analyzes patterns and creates human-readable summaries
 */
function generateInsights(data) {
  try {
    if (!data || data.length === 0) {
      return {
        success: false,
        message: 'No data to analyze'
      };
    }

    const insights = [];
    const firstRow = data[0];
    const numericColumns = [];
    const textColumns = [];

    // Categorize columns
    for (const [key, value] of Object.entries(firstRow)) {
      if (!isNaN(parseFloat(value))) {
        numericColumns.push(key);
      } else {
        textColumns.push(key);
      }
    }

    // Analyze each numeric column
    numericColumns.forEach(column => {
      const columnInsights = analyzeNumericColumn(data, column);
      insights.push(...columnInsights);
    });

    // Analyze correlations between numeric columns
    if (numericColumns.length >= 2) {
      const correlations = analyzeCorrelations(data, numericColumns);
      insights.push(...correlations);
    }

    // Analyze categorical data
    textColumns.forEach(column => {
      const catInsights = analyzeCategoricalColumn(data, column);
      insights.push(...catInsights);
    });

    // Generate overall data quality insights
    const dataQualityInsights = analyzeDataQuality(data);
    insights.push(...dataQualityInsights);

    return {
      success: true,
      totalInsights: insights.length,
      dataShape: {
        rows: data.length,
        columns: Object.keys(firstRow).length,
        numericColumns: numericColumns.length,
        textColumns: textColumns.length
      },
      insights: insights.sort((a, b) => b.importance - a.importance)
    };
  } catch (error) {
    return {
      success: false,
      message: `Error generating insights: ${error.message}`
    };
  }
}

function analyzeNumericColumn(data, columnName) {
  const insights = [];
  const values = data
    .map(row => parseFloat(row[columnName]))
    .filter(v => !isNaN(v));

  if (values.length < 2) return insights;

  const mean = ss.mean(values);
  const median = ss.median(values);
  const stdDev = ss.standardDeviation(values);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  // Insight 1: Central tendency
  if (Math.abs(mean - median) > stdDev * 0.5) {
    insights.push({
      type: 'distribution',
      importance: 7,
      column: columnName,
      message: `${columnName} has a skewed distribution with mean (${mean.toFixed(2)}) significantly different from median (${median.toFixed(2)})`,
      severity: 'info'
    });
  }

  // Insight 2: Variability
  const coefficientOfVariation = (stdDev / mean) * 100;
  if (coefficientOfVariation > 50) {
    insights.push({
      type: 'variability',
      importance: 6,
      column: columnName,
      message: `${columnName} shows high variability (CV: ${coefficientOfVariation.toFixed(1)}%) - high spread in values`,
      severity: 'warning'
    });
  } else if (coefficientOfVariation < 5) {
    insights.push({
      type: 'variability',
      importance: 5,
      column: columnName,
      message: `${columnName} is very consistent with low variability (CV: ${coefficientOfVariation.toFixed(1)}%)`,
      severity: 'info'
    });
  }

  // Insight 3: Range and scale
  if (range > mean * 10) {
    insights.push({
      type: 'scale',
      importance: 5,
      column: columnName,
      message: `${columnName} has a large range (${min} to ${max}) relative to its mean`,
      severity: 'info'
    });
  }

  // Insight 4: Outliers
  const outlierCount = values.filter(v => Math.abs((v - mean) / stdDev) > 3).length;
  if (outlierCount > 0) {
    insights.push({
      type: 'outliers',
      importance: 8,
      column: columnName,
      message: `${columnName} contains ${outlierCount} potential outliers (${((outlierCount / values.length) * 100).toFixed(1)}% of data)`,
      severity: 'warning'
    });
  }

  // Insight 5: Positive/Negative distribution
  const negativeCount = values.filter(v => v < 0).length;
  if (negativeCount > 0 && negativeCount < values.length) {
    insights.push({
      type: 'mixed_values',
      importance: 6,
      column: columnName,
      message: `${columnName} contains both positive and negative values (${negativeCount} negative out of ${values.length})`,
      severity: 'info'
    });
  }

  return insights;
}

function analyzeCategoricalColumn(data, columnName) {
  const insights = [];
  const valueCounts = {};
  const nullCount = data.filter(row => !row[columnName] || row[columnName].toString().trim() === '').length;

  data.forEach(row => {
    if (row[columnName]) {
      const val = row[columnName].toString().trim();
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    }
  });

  const uniqueValues = Object.keys(valueCounts).length;
  const totalValues = data.length;
  const nullPercentage = (nullCount / totalValues) * 100;

  // Insight 1: Missing values
  if (nullCount > 0) {
    insights.push({
      type: 'missing_values',
      importance: nullPercentage > 10 ? 8 : 6,
      column: columnName,
      message: `${columnName} has ${nullCount} missing values (${nullPercentage.toFixed(1)}% of data)`,
      severity: nullPercentage > 10 ? 'warning' : 'info'
    });
  }

  // Insight 2: Cardinality
  if (uniqueValues === totalValues - nullCount) {
    insights.push({
      type: 'high_cardinality',
      importance: 5,
      column: columnName,
      message: `${columnName} has unique values for each record - likely an identifier`,
      severity: 'info'
    });
  } else if (uniqueValues < 5) {
    insights.push({
      type: 'low_cardinality',
      importance: 6,
      column: columnName,
      message: `${columnName} has only ${uniqueValues} unique categories`,
      severity: 'info'
    });
  }

  // Insight 3: Imbalanced categories
  const sortedCounts = Object.values(valueCounts).sort((a, b) => b - a);
  if (sortedCounts[0] / totalValues > 0.8) {
    insights.push({
      type: 'imbalanced_categories',
      importance: 6,
      column: columnName,
      message: `${columnName} is highly imbalanced - top category represents ${((sortedCounts[0] / totalValues) * 100).toFixed(1)}% of values`,
      severity: 'warning'
    });
  }

  return insights;
}

function analyzeCorrelations(data, numericColumns) {
  const insights = [];

  // Calculate correlation between pairs
  for (let i = 0; i < numericColumns.length - 1; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i];
      const col2 = numericColumns[j];

      const pairs = data
        .map(row => [parseFloat(row[col1]), parseFloat(row[col2])])
        .filter(([a, b]) => !isNaN(a) && !isNaN(b));

      if (pairs.length > 2) {
        const correlation = ss.sampleCorrelation(
          pairs.map(p => p[0]),
          pairs.map(p => p[1])
        );

        if (Math.abs(correlation) > 0.7) {
          insights.push({
            type: 'correlation',
            importance: Math.abs(correlation) > 0.9 ? 8 : 7,
            columns: [col1, col2],
            message: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation detected between ${col1} and ${col2} (r = ${correlation.toFixed(2)})`,
            severity: 'info'
          });
        }
      }
    }
  }

  return insights;
}

function analyzeDataQuality(data) {
  const insights = [];
  const totalCells = data.length * Object.keys(data[0]).length;
  let emptyCount = 0;

  data.forEach(row => {
    Object.values(row).forEach(val => {
      if (!val || val.toString().trim() === '') {
        emptyCount++;
      }
    });
  });

  const completeness = ((totalCells - emptyCount) / totalCells) * 100;

  if (completeness < 95) {
    insights.push({
      type: 'data_quality',
      importance: 8,
      message: `Data completeness is ${completeness.toFixed(1)}% - ${emptyCount} missing values detected`,
      severity: 'warning'
    });
  } else {
    insights.push({
      type: 'data_quality',
      importance: 5,
      message: `Data is ${completeness.toFixed(1)}% complete - good data quality`,
      severity: 'info'
    });
  }

  return insights;
}

module.exports = {
  generateInsights
};
