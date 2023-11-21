import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { responsiveFontSizes } from '@mui/material';
import './Box.css'; 

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Box = () => {
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Demande',
      data: [],
      fill: true,
      borderColor: 'rgba(125, 211, 252, 0.3)',
    }],
  });

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Demande',
      data: [],
      fill: true,
      backgroundColor: ['rgba(125, 211, 252, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 205, 86, 0.6)'],
      borderColor: ['rgba(125, 211, 252, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)'],
    }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/dashboard');

        if (data && data.data) {
          setLineChartData({
            labels: data.data.map((item) => item.mois),
            datasets: [{
              label: 'Demande',
              data: data.data.map((item) => item.nombre_demandes),
              fill: true,
              borderColor: 'rgba(125, 211, 252, 0.3)',
            }],
          });

          setPieChartData({
            labels: data.data.map((item) => item.mois),
            datasets: [{
              label: 'Demande',
              data: data.data.map((item) => item.nombre_demandes),
              fill: true,
              backgroundColor: ['rgba(125, 211, 252, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 205, 86, 0.6)'],
              borderColor: ['rgba(125, 211, 252, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)'],
            }],
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="chart">
          <div className="line-chart-container">
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Demande Mensuel', fontSize: 16 },
                },
                maintainAspectRatio: false,
              }}
              className="line-chart"
            />
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Pie Chart</h6>
          </div>
          <div className="card-body">
            <div className='chart' style={{ height: '300px' }}>
              {/* Ajustez la hauteur selon vos besoins */}
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Demande Mensuel', fontSize: 16 },
                  },
                  maintainAspectRatio: false,
                  aspectRatio: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Box;
