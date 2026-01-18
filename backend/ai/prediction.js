const ss = require('simple-statistics');

/**
 * Linear regression prediction
 * Predicts future values based on historical trend
 */
function linearRegression(data, columnName, forecastPeriods = 5) {
  try {
    // Extract numeric values
    const values = data
      .map(row => {
        const val = parseFloat(row[columnName]);
        return isNaN(val) ? null : val;
      })
      .filter(val => val !== null);

    if (values.length < 2) {
      return {
        success: false,
        message: 'Not enough data for prediction'
      };
    }

    // Prepare data points [x, y] where x is index and y is value
    const points = values.map((val, idx) => [idx, val]);

    // Calculate linear regression
    const regression = ss.linearRegression(points);
    const line = ss.linearRegressionLine(regression);

    // Generate predictions
    const predictions = [];
    const lastIndex = values.length - 1;

    for (let i = 1; i <= forecastPeriods; i++) {
      const predictedIndex = lastIndex + i;
      const predictedValue = line(predictedIndex);
      predictions.push({
        period: i,
        predictedValue: parseFloat(predictedValue.toFixed(2)),
        confidence: 'moderate'
      });
    }

    // Calculate R-squared for accuracy
    const residuals = points.map(([x, y]) => {
      const predicted = line(x);
      return (y - predicted) ** 2;
    });
    const ssRes = residuals.reduce((a, b) => a + b, 0);
    const ssTot = points.reduce((sum, [, y]) => {
      const meanY = ss.mean(values);
      return sum + (y - meanY) ** 2;
    }, 0);
    const rSquared = 1 - (ssRes / ssTot);

    return {
      success: true,
      columnName: columnName,
      totalHistoricalPoints: values.length,
      trend: regression.b > 0 ? 'upward' : 'downward',
      slope: regression.b.toFixed(4),
      intercept: regression.a.toFixed(4),
      accuracy: `${(rSquared * 100).toFixed(1)}%`,
      predictions: predictions,
      lastValue: values[values.length - 1],
      statistics: {
        mean: ss.mean(values).toFixed(2),
        stdDev: ss.standardDeviation(values).toFixed(2)
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in prediction: ${error.message}`
    };
  }
}

/**
 * Moving average prediction
 * Smooths data to identify trends
 */
function movingAverage(data, columnName, windowSize = 3) {
  try {
    const values = data
      .map(row => {
        const val = parseFloat(row[columnName]);
        return isNaN(val) ? null : val;
      })
      .filter(val => val !== null);

    if (values.length < windowSize) {
      return {
        success: false,
        message: `Need at least ${windowSize} data points`
      };
    }

    const movingAverages = [];
    for (let i = 0; i <= values.length - windowSize; i++) {
      const window = values.slice(i, i + windowSize);
      const avg = ss.mean(window);
      movingAverages.push({
        position: i + Math.ceil(windowSize / 2),
        average: parseFloat(avg.toFixed(2))
      });
    }

    return {
      success: true,
      columnName: columnName,
      windowSize: windowSize,
      totalPoints: values.length,
      movingAverages: movingAverages,
      trend: movingAverages[movingAverages.length - 1].average > 
             movingAverages[0].average ? 'upward' : 'downward'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in moving average: ${error.message}`
    };
  }
}

/**
 * Seasonal decomposition (basic)
 * Separates trend and seasonality
 */
function seasonalDecomposition(data, columnName, seasonalPeriod = 4) {
  try {
    const values = data
      .map(row => {
        const val = parseFloat(row[columnName]);
        return isNaN(val) ? null : val;
      })
      .filter(val => val !== null);

    if (values.length < seasonalPeriod * 2) {
      return {
        success: false,
        message: `Need at least ${seasonalPeriod * 2} data points`
      };
    }

    // Calculate trend using centered moving average
    const trend = [];
    for (let i = Math.floor(seasonalPeriod / 2); i < values.length - Math.floor(seasonalPeriod / 2); i++) {
      const window = values.slice(i - Math.floor(seasonalPeriod / 2), i + Math.ceil(seasonalPeriod / 2));
      trend.push(ss.mean(window));
    }

    // Calculate seasonal component
    const seasonal = [];
    for (let i = 0; i < seasonalPeriod; i++) {
      const seasonalValues = [];
      for (let j = i; j < values.length; j += seasonalPeriod) {
        if (j - Math.floor(seasonalPeriod / 2) >= 0 && j - Math.floor(seasonalPeriod / 2) < trend.length) {
          seasonalValues.push(values[j] - trend[j - Math.floor(seasonalPeriod / 2)]);
        }
      }
      seasonal.push({
        season: i,
        factor: parseFloat((ss.mean(seasonalValues) || 0).toFixed(2))
      });
    }

    return {
      success: true,
      columnName: columnName,
      seasonalPeriod: seasonalPeriod,
      trendStrength: 'detected',
      seasonalComponents: seasonal,
      forecastTrend: trend[trend.length - 1] > trend[0] ? 'upward' : 'downward'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in seasonal decomposition: ${error.message}`
    };
  }
}

module.exports = {
  linearRegression,
  movingAverage,
  seasonalDecomposition
};
