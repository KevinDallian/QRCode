import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function LineChart({productName}) {
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: `Orders ${productName}`,
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: `Masterbox ${productName}`,
          data: [60, 40, 100, 20, 40, 52, 46],
          fill: false,
          borderColor: 'rgb(255 0 134)',
          tension: 0.1,
        },
      ],
    };
    const options = {
        scales: {
          x: {
            type: 'category',
            labels: data.labels,
          },
        },
      };
    
    return <Line data={data} options={options} />;
  };
