import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CartesianGrid,
  Legend as RechartsLegend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis, 
  PieChart,
  BarChart ,
  Pie,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Grid,
  Card,
  CardContent,
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

import moment from 'moment';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const data = [
  {
    date: '2000-01',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  // ... other data entries
];
const monthTickFormatter = (tick) => {
  const date = new Date(tick);
  return date.getMonth() + 1;
};

const renderQuarterTick = (tickProps) => {
  const { x, y, payload } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;
  const isMidMonth = month % 3 === 1;

  if (month % 3 === 1) {
    return <text x={x} y={y - 4} textAnchor="middle">{`Q${quarterNo}`}</text>;
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX = Math.floor(isLast ? x + offset : x - offset) + 0.5;
    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="red" />;
  }

  return null;
};

function MyBox() {
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Demandes par entreprise',
        data: [],
        backgroundColor: COLORS,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('auth_token');
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = response.data;

        setLineChartData({
          labels: data.labels,
          datasets: data.datasets.map((dataset) => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.borderColor,
          })),
        });

        setRecentActivities(data.user_activities);

        setPieChartData({
          labels: data.total_demandes_par_entreprise.map((item) => item.entreprise),
          datasets: [
            {
              label: 'Demandes par entreprise',
              data: data.total_demandes_par_entreprise.map((item) => item.nombre_total_demandes),
              backgroundColor: COLORS,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data from the API:', error);
      }
    };

    fetchData();
  }, []);

  console.log(pieChartData);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            Demande Mensuel
          </Typography>
          <div className="line-chart-container" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineChartData.labels.map((label, index) => {
                  const entry = { name: label };
                  lineChartData.datasets.forEach((dataset) => {
                    const matchingDataPoint = dataset.data.find(
                      (dataPoint) => dataPoint.mois === label
                    );
                    entry[dataset.label] = matchingDataPoint
                      ? matchingDataPoint.nombre_demandes
                      : 0;
                  });
                  return entry;
                })}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <RechartsLegend />
                {lineChartData.datasets.map((dataset) => (
                  <Line
                    type="monotone"
                    dataKey={dataset.label}
                    key={dataset.label}
                    stroke={dataset.borderColor}
                    strokeWidth={2}
                    dot={{ r: 4, fill: dataset.pointBackgroundColor }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4} mb={4}>
  <Card>
    <CardContent>
      <Typography variant="h6" color="textPrimary" gutterBottom>
        Statistique de demande pour chaque entreprise
      </Typography>
      <MuiBox sx={{ height: '360px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData.datasets[0].data.map((value, index) => ({
                value,
                name: `${((value / pieChartData.datasets[0].data.reduce((acc, val) => acc + val, 0)) * 100).toFixed(0)}% ${pieChartData.labels[index]}`,
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ cx, cy, midAngle, percentage, index }) => {
                const radius = 80;
                const angle = midAngle * -1;
                const x = cx + radius * Math.cos(angle);
                const y = cy + radius * Math.sin(angle);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                  </text>
                );
              }}
            >
              {pieChartData.labels.map((label, index) => (
                <Cell key={`cell-${index}`} fill={pieChartData.datasets[0].backgroundColor[index]} />
              ))}
            </Pie>
            <Tooltip />
            <RechartsLegend
              align="center"
              verticalAlign="bottom"
              layout="horizontal"
              iconSize={10}
              wrapperStyle={{
                paddingTop: '10px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </MuiBox>
    </CardContent>
  </Card>
</Grid>



      <Grid item xs={12} md={12}>
        <Paper elevation={3} sx={{ p: 2, height: '89%' }}>
          <TableContainer>
            <Table className="MuiTable">
              <TableHead>
                <TableRow>
                  <TableCell>Activité récente</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id_user_activity}>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{moment(activity.created_at).format('YYYY-MM-DD [à] HH:mm:ss')}</TableCell>
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
