import { useCallback, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const appBarElements = useMemo(
    () => [
      {
        label: 'Acceuil',
        icon: <HomeIcon />,
        to: 'feed',
      },
      {
        label: 'Carte',
        icon: <MapIcon />,
        to: 'map',
      },
      {
        label: 'Favorites',
        icon: <FavoriteIcon />,
        to: 'favorites',
      },
      {
        label: 'Profile',
        icon: <PersonIcon />,
        to: 'profile',
      },
    ],
    []
  );

  const handleNavigate = useCallback((_: any, to: string) => {
    navigate(to);
  }, []);

  return (
    <>
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
    </>
  );
};

export default Layout;
