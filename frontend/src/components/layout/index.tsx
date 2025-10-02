import { useCallback, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Typography,
} from '@mui/material';

import {
  HomeOutlined,
  PersonOutline,
  FavoriteBorder,
  AddCircleOutline,
  ChatBubbleOutline,
} from '@mui/icons-material';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const appBarElements = useMemo(
    () => [
      {
        label: 'Acceuil',
        icon: <HomeOutlined />,
        to: 'feed',
      },
      {
        label: 'Favorites',
        icon: <FavoriteBorder />,
        to: 'favorites',
      },
      {
        label: 'Ajouter',
        icon: <AddCircleOutline />,
        to: 'add',
      },
      {
        label: 'Messages',
        icon: <ChatBubbleOutline />,
        to: '#',
      },
      {
        label: 'Profile',
        icon: <PersonOutline />,
        to: 'profile',
      },
    ],
    []
  );

  const handleNavigate = useCallback((_: any, to: string) => {
    if( to === 'add') return;
    navigate(to);
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Typography variant="h5" gutterBottom sx={{ float: 'right' }}>
        Bonjour, Amélie
      </Typography>
      <Outlet />
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={location.pathname.replace('/', '')}
          onChange={handleNavigate}
        >
          {appBarElements.map((el) => (
            <BottomNavigationAction
              key={el.label}
              value={el.to}
              label={el.label}
              icon={el.icon}
              color="blue"
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;
