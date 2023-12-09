import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';

const DashboardCard = ({
  title,
  value,
  icon,
  progressValue,
  progressLabel,
  onClick,
}) => {
  let selectedIcon;

  switch (icon) {
    case 'calendar':
      selectedIcon = <EventIcon />;
      break;
    case 'dollar':
      selectedIcon = <MonetizationOnIcon />;
      break;
    case 'trending':
      selectedIcon = <TrendingUpIcon />;
      break;
    case 'description':
      selectedIcon = <DescriptionIcon />;
      break;
    default:
      selectedIcon = null;
  }

  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <Card className="border-left-primary shadow h-100">
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Typography variant="subtitle1" color="primary" fontWeight="bold" mb={1}>
                {title}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="textPrimary">
                {value}
              </Typography>
            </div>
            <div>
              {selectedIcon && (
                <IconButton onClick={onClick}>
                  {selectedIcon}
                </IconButton>
              )}
            </div>
          </div>
          {progressValue !== undefined && (
            <div className="row no-gutters align-items-center mt-2">
              <div className="col-auto text-center">
                <Typography variant="h5" fontWeight="bold" color="textPrimary">
                  {progressValue}%
                </Typography>
              </div>
              <div className="col">
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </div>
              <div className="col-auto">
                <Typography variant="body2" color="textSecondary">
                  {progressLabel}
                </Typography>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCard;
