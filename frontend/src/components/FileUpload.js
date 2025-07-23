import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function FileUpload() {
  const [data, setData] = useState([]);
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('userId', '123'); // Replace with real ID

    const res = await axios.post('http://localhost:5000/api/file/upload', formData);
    setData(res.data);
  };

  const keys = data.length ? Object.keys(data[0]) : [];

  const chartData = {
    labels: data.map(d => d[xKey]),
    datasets: [{
      label: yKey,
      data: data.map(d => d[yKey]),
      backgroundColor: 'skyblue'
    }]
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      {keys.length > 0 && (
        <>
          <select onChange={(e) => setXKey(e.target.value)}>
            {keys.map(k => <option key={k}>{k}</option>)}
          </select>
          <select onChange={(e) => setYKey(e.target.value)}>
            {keys.map(k => <option key={k}>{k}</option>)}
          </select>
          <Bar data={chartData} />
        </>
      )}
    </div>
  );
}

export default FileUpload;
