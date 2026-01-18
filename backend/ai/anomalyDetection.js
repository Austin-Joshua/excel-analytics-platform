const ss = require('simple-statistics');

/**
 * Detects anomalies in numeric columns using statistical methods
 * Uses Z-score method: values with |z-score| > 3 are considered anomalies
 */
function detectAnomalies(data, columnName) {
  try {
    // Extract numeric values from the column
    const values = data
      .map(row => {
        const val = parseFloat(row[columnName]);
        return isNaN(val) ? null : val;
      })
      .filter(val => val !== null);

    if (values.length < 2) {
      return {
        success: false,
        message: 'Not enough numeric data to detect anomalies'
      };
    }

    // Calculate mean and standard deviation
    const mean = ss.mean(values);
    const stdDev = ss.standardDeviation(values);

    if (stdDev === 0) {
      return {
        success: false,
        message: 'All values are identical, no anomalies to detect'
      };
    }

    // Calculate Z-scores and identify anomalies
    const anomalies = [];
    const zScores = values.map((val, idx) => {
      const zScore = (val - mean) / stdDev;
      if (Math.abs(zScore) > 3) {
        anomalies.push({
          value: val,
          zScore: zScore.toFixed(2),
          deviation: 'extreme',
          index: idx
        });
      } else if (Math.abs(zScore) > 2) {
        anomalies.push({
          value: val,
          zScore: zScore.toFixed(2),
          deviation: 'moderate',
          index: idx
        });
      }
      return zScore;
    });

    return {
      success: true,
      columnName: columnName,
      totalValues: values.length,
      anomaliesFound: anomalies.length,
      statistics: {
        mean: mean.toFixed(2),
        median: ss.median(values).toFixed(2),
        stdDev: stdDev.toFixed(2),
        min: Math.min(...values),
        max: Math.max(...values)
      },
      anomalies: anomalies.slice(0, 20) // Return top 20 anomalies
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in anomaly detection: ${error.message}`
    };
  }
}

/**
 * Detects anomalies in all numeric columns
 */
function detectAllAnomalies(data) {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: 'No data provided'
    };
  }

  const results = [];
  const firstRow = data[0];

  for (const column of Object.keys(firstRow)) {
    const sample = parseFloat(firstRow[column]);
    if (!isNaN(sample)) {
      // This is a numeric column
      const result = detectAnomalies(data, column);
      if (result.success && result.anomaliesFound > 0) {
        results.push(result);
      }
    }
  }

  return {
    success: true,
    totalColumnsAnalyzed: Object.keys(firstRow).length,
    columnsWithAnomalies: results.length,
    anomalies: results
  };
}

module.exports = {
  detectAnomalies,
  detectAllAnomalies
};
