import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import AIAnalyzer from './AIAnalyzer';
import './FileUpload.css';

function FileUpload() {
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset previous state
    setData([]);
    setXKey('');
    setYKey('');
    setFileName(file.name);
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', '123'); // Replace with real ID

      const res = await axios.post('http://localhost:5000/api/file/upload', formData);
      setData(res.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const keys = data.length ? Object.keys(data[0]) : [];

  const chartData = {
    labels: data.map(d => d[xKey]).slice(0, 50), // Limit to 50 for readability
    datasets: [{
      label: yKey,
      data: data.map(d => parseFloat(d[yKey]) || 0).slice(0, 50),
      backgroundColor: 'rgba(102, 126, 234, 0.6)',
      borderColor: 'rgba(102, 126, 234, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: `${yKey} by ${xKey}`
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <div className="upload-box">
          <input 
            type="file" 
            onChange={handleUpload}
            disabled={uploading}
            accept=".csv,.xlsx,.xls"
            className="file-input"
          />
          {uploading && <p className="uploading">⏳ Uploading...</p>}
          {fileName && !uploading && <p className="file-name">📁 {fileName}</p>}
        </div>
      </div>

      {keys.length > 0 && (
        <div className="data-section">
          <div className="chart-controls">
            <div className="select-group">
              <label>X-Axis:</label>
              <select 
                value={xKey} 
                onChange={(e) => setXKey(e.target.value)}
                className="form-select"
              >
                <option value="">Select X-Axis</option>
                {keys.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="select-group">
              <label>Y-Axis:</label>
              <select 
                value={yKey} 
                onChange={(e) => setYKey(e.target.value)}
                className="form-select"
              >
                <option value="">Select Y-Axis</option>
                {keys.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div className="data-info">
              <span>📊 Records: {data.length}</span>
              <span>📋 Columns: {keys.length}</span>
            </div>
          </div>

          {xKey && yKey && (
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          {/* AI Analyzer Component */}
          <AIAnalyzer data={data} />

          {/* Data Preview */}
          <div className="data-preview">
            <h3>📑 Data Preview</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    {keys.map(key => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, idx) => (
                    <tr key={idx}>
                      {keys.map(key => (
                        <td key={`${idx}-${key}`}>
                          {String(row[key]).substring(0, 30)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 5 && (
                <p className="preview-info">... and {data.length - 5} more rows</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
