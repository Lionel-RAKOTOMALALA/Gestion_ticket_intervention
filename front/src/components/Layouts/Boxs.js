import React, { useState, useEffect } from 'react';
import { Pie, Line, Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import ChartJS, {
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import {
  Grid,
  Typography,
  Box as MuiBox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function MyBox() {
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [],
  });

  const recentActivities = [
    { id: 1, name: 'Activity 1', date: '2023-01-01' },
    { id: 2, name: 'Activity 2', date: '2023-01-02' },
    { id: 3, name: 'Activity 3', date: '2023-01-03' },
    // Add more sample activities as needed
  ];

  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const [radarChartData, setRadarChartData] = useState({
    labels: ['Thing 1', 'Thing 2', 'Thing 3', 'Thing 4', 'Thing 5', 'Thing 6'],
    datasets: [
      {
        label: '# of Votes',
        data: [2, 9, 3, 5, 2, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/dashboard');

        if (data && data.data) {
          // Organize data by enterprise
          const groupedData = {};
          data.data.forEach((item) => {
            if (!groupedData[item.entreprise]) {
              groupedData[item.entreprise] = [];
            }
            groupedData[item.entreprise].push({
              mois: item.mois,
              nombre_demandes: item.nombre_demandes,
            });
          });

          // Create arrays for charts
          const lineChartDatasets = Object.keys(groupedData).map((entreprise, index) => {
            const maxRequests = Math.max(...groupedData[entreprise].map((item) => item.nombre_demandes));
            return {
              label: `${entreprise} - Demande`,
              data: groupedData[entreprise].map((item) => item.nombre_demandes),
              fill: true,
              borderColor: `rgba(125, 211, 252, 0.3)`,
              yAxisID: 'y-axis-' + index,
              maxRequests,
            };
          });

          const pieChartDatasets = Object.keys(groupedData).map((entreprise, index) => {
            const colorIndex = index % 4;
            return {
              label: `${entreprise} - Demande`,
              data: groupedData[entreprise].map((item) => item.nombre_demandes),
              fill: true,
              backgroundColor: [
                `rgba(125, 211, 252, 0.6)`,
                `rgba(54, 162, 235, 0.6)`,
                `rgba(255, 99, 132, 0.6)`,
                `rgba(255, 205, 86, 0.6)`,
              ][colorIndex],
              borderColor: [
                `rgba(125, 211, 252, 1)`,
                `rgba(54, 162, 235, 1)`,
                `rgba(255, 99, 132, 1)`,
                `rgba(255, 205, 86, 1)`,
              ][colorIndex],
            };
          });

          setLineChartData({
            labels: data.data.map((item) => item.mois),
            datasets: lineChartDatasets,
          });

          setPieChartData({
            labels: Object.keys(groupedData),
            datasets: pieChartDatasets,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Demande Mensuel
          </Typography>
          <div className="line-chart-container" style={{ height: '350px' }}>
            <Line
              data={lineChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Demande Mensuel', fontSize: 16 },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    type: 'category',
                  },
                  y: lineChartData.datasets.map((dataset) => ({
                    type: 'linear',
                    display: true,
                    position: 'left',
                    id: 'y-axis-' + lineChartData.datasets.indexOf(dataset),
                    max: dataset.maxRequests,
                  })),
                },
              }}
              className="line-chart"
            />
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4} mb={4}>
        <MuiBox sx={{ height: '350px', width: '100%' }}>
          <Doughnut
            data={doughnutChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Doughnut Chart', fontSize: 16 },
              },
              maintainAspectRatio: false,
              aspectRatio: 1,
              cutout: '50%', // Adjust the cutout value to make the Doughnut smaller
            }}
          />
        </MuiBox>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Bar Chart
          </Typography>
          <div className="chart" style={{ height: '350px' }}>
            <Bar
              data={{
                labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
                datasets: [
                  {
                    label: 'Bar Chart Example',
                    data: [10, 20, 15, 25, 18], // Replace this array with your actual data
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Bar Chart', fontSize: 16 },
                },
                scales: {
                  x: {
                    type: 'category',
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4} mb={4}>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Activity</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.name}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MyBox;