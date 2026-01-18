import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIAnalyzer.css';

function AIAnalyzer({ data }) {
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('general');
  const [query, setQuery] = useState('');
  const [metric, setMetric] = useState('');
  const [groupBy, setGroupBy] = useState('');
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  // Reset results when new data is uploaded
  useEffect(() => {
    setResult(null);
    setQuery('');
    setMetric('');
    setGroupBy('');
    setActiveTab('analysis');
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="ai-analyzer">Please upload data first</div>;
  }

  const columns = Object.keys(data[0]);

  // General AI Analysis
  const handleAnalyze = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', {
        data,
        query
      });
      setResult({
        type: 'general',
        data: res.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    }
    setLoading(false);
  };

  // Specific Analysis
  const handleSpecificAnalysis = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/specific', {
        data,
        type: analysisType
      });
      setResult({
        type: 'specific',
        data: res.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    }
    setLoading(false);
  };

  // Comparative Analysis
  const handleComparison = async () => {
    if (!metric || !groupBy) {
      alert('Please select metric and group by column');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/compare', {
        data,
        metric,
        groupBy
      });
      setResult({
        type: 'comparison',
        data: res.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    }
    setLoading(false);
  };

  // Data Quality Report
  const handleQualityReport = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/quality-report', {
        data
      });
      setResult({
        type: 'quality',
        data: res.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    }
    setLoading(false);
  };

  // Data Summary
  const handleDataSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/data-summary', {
        data
      });
      setResult({
        type: 'summary',
        data: res.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    }
    setLoading(false);
  };

  // Recommendations
  const handleRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/ai/recommendations', {
        data
      });
      setResult({
        type: 'recommendations',
        data: res.data,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (error) {
      alert('Analysis failed: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="ai-analyzer">
      <div className="analyzer-header">
        <h2>🤖 AI Analytics Engine</h2>
        <p>Advanced Data Analysis with Groq AI</p>
      </div>

      <div className="analyzer-container">
        {/* Left Panel - Analysis Options */}
        <div className="analysis-panel">
          <div className="tab-buttons">
            <button 
              className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('analysis');
                setResult(null);
              }}
            >
              General Analysis
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specific' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('specific');
                setResult(null);
              }}
            >
              Deep Analysis
            </button>
            <button 
              className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('compare');
                setResult(null);
              }}
            >
              Compare
            </button>
            <button 
              className={`tab-btn ${activeTab === 'quality' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('quality');
                setResult(null);
              }}
            >
              Quality
            </button>
          </div>

          {/* General Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="analysis-section">
              <h3>Ask AI About Your Data</h3>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., What are the sales trends? Find correlations between columns. Identify patterns..."
                rows={5}
              />
              <button 
                onClick={handleAnalyze} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
              </button>
            </div>
          )}

          {/* Specific Analysis Tab */}
          {activeTab === 'specific' && (
            <div className="analysis-section">
              <h3>Deep Analysis</h3>
              <select 
                value={analysisType} 
                onChange={(e) => setAnalysisType(e.target.value)}
              >
                <option value="correlation">Correlation Analysis</option>
                <option value="regression">Regression & Trends</option>
                <option value="anomaly">Anomaly Detection</option>
                <option value="clustering">Clustering</option>
              </select>
              <button 
                onClick={handleSpecificAnalysis} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? '⏳ Analyzing...' : '📊 Analyze'}
              </button>
            </div>
          )}

          {/* Comparative Analysis Tab */}
          {activeTab === 'compare' && (
            <div className="analysis-section">
              <h3>Compare Metrics</h3>
              <label>Metric to Compare:</label>
              <select 
                value={metric} 
                onChange={(e) => setMetric(e.target.value)}
              >
                <option value="">Select metric...</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>

              <label>Group By:</label>
              <select 
                value={groupBy} 
                onChange={(e) => setGroupBy(e.target.value)}
              >
                <option value="">Select column...</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>

              <button 
                onClick={handleComparison} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? '⏳ Comparing...' : '⚖️ Compare'}
              </button>
            </div>
          )}

          {/* Quality Tab */}
          {activeTab === 'quality' && (
            <div className="analysis-section">
              <h3>Data Quality Analysis</h3>
              <p>Get detailed quality metrics for your data including completeness, outliers, and recommendations.</p>
              <button 
                onClick={handleQualityReport} 
                disabled={loading}
                className="btn-primary"
              >
                {loading ? '⏳ Analyzing...' : '✅ Quality Report'}
              </button>
              <button 
                onClick={handleDataSummary} 
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? '⏳ Generating...' : '📈 Data Summary'}
              </button>
              <button 
                onClick={handleRecommendations} 
                disabled={loading}
                className="btn-secondary"
              >
                {loading ? '⏳ Generating...' : '💡 Get Recommendations'}
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="results-panel">
          {result ? (
            <div className="result-container">
              <div className="result-header">
                <h3>Analysis Result</h3>
                <span className="timestamp">{result.timestamp}</span>
              </div>

              {/* General Analysis Result */}
              {result.type === 'general' && (
                <div className="result-content">
                  <div className="info-badge">
                    <span>Provider: {result.data.provider}</span>
                    <span>Records: {result.data.recordsAnalyzed}</span>
                  </div>
                  <div className="analysis-text">
                    {result.data.analysis}
                  </div>
                </div>
              )}

              {/* Specific Analysis Result */}
              {result.type === 'specific' && (
                <div className="result-content">
                  <div className="info-badge">
                    <span>Type: {result.data.type}</span>
                    <span>Provider: {result.data.provider}</span>
                  </div>
                  <div className="analysis-text">
                    {result.data.analysis}
                  </div>
                </div>
              )}

              {/* Comparison Result */}
              {result.type === 'comparison' && (
                <div className="result-content">
                  <div className="info-badge">
                    <span>Metric: {result.data.metric}</span>
                    <span>Group By: {result.data.groupBy}</span>
                  </div>
                  <div className="analysis-text">
                    {result.data.analysis}
                  </div>
                </div>
              )}

              {/* Quality Report Result */}
              {result.type === 'quality' && (
                <div className="result-content">
                  <h4>Quality Metrics</h4>
                  <div className="quality-grid">
                    {Object.entries(result.data.report.columns).map(([col, metrics]) => (
                      <div key={col} className="quality-card">
                        <h5>{col}</h5>
                        <div className="quality-metric">
                          <span>Completeness:</span>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{width: `${metrics.completeness}%`}}
                            ></div>
                          </div>
                          <span className="metric-value">{metrics.completeness.toFixed(1)}%</span>
                        </div>
                        <div className="quality-metric">
                          <span>Quality Score:</span>
                          <div className="score-badge" style={{
                            backgroundColor: metrics.overallScore > 80 ? '#4caf50' : metrics.overallScore > 60 ? '#ff9800' : '#f44336'
                          }}>
                            {metrics.overallScore}
                          </div>
                        </div>
                        {metrics.hasOutliers && (
                          <div className="outlier-warning">
                            ⚠️ {metrics.outlierPercentage}% outliers
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Summary Result */}
              {result.type === 'summary' && (
                <div className="result-content">
                  <h4>Data Summary</h4>
                  <div className="summary-header">
                    <span>Records: {result.data.recordCount}</span>
                    <span>Columns: {result.data.columnCount}</span>
                  </div>
                  <div className="summary-stats">
                    {Object.entries(result.data.summary.columns).map(([col, info]) => (
                      <div key={col} className="stat-item">
                        <strong>{col}</strong>
                        <p>Type: {info.type}</p>
                        <p>Completeness: {info.dataCompleteness}%</p>
                        {info.type === 'numeric' && result.data.summary.statistics[col] && (
                          <details>
                            <summary>Statistics</summary>
                            <div className="stat-details">
                              <p>Mean: {result.data.summary.statistics[col].mean}</p>
                              <p>Median: {result.data.summary.statistics[col].median}</p>
                              <p>Std Dev: {result.data.summary.statistics[col].stdDev}</p>
                              <p>Min: {result.data.summary.statistics[col].min}</p>
                              <p>Max: {result.data.summary.statistics[col].max}</p>
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations Result */}
              {result.type === 'recommendations' && (
                <div className="result-content">
                  <h4>AI Recommendations</h4>
                  <div className="quality-score">
                    Overall Quality Score: <strong>{result.data.qualityScore.toFixed(2)}/100</strong>
                  </div>
                  <div className="recommendations-text">
                    {result.data.recommendations}
                  </div>
                </div>
              )}

              {/* Error Result */}
              {result.data.error && (
                <div className="result-error">
                  ❌ Error: {result.data.error}
                </div>
              )}

              {/* Fallback Result */}
              {result.data.fallback && (
                <div className="result-fallback">
                  <strong>Fallback Analysis:</strong>
                  <pre>{result.data.fallback}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="no-result">
              <p>👈 Select an analysis type and click analyze</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIAnalyzer;
