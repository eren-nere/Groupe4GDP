import { Box, Fab, TextField } from '@mui/material';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

const MapPage = () => {
  return [
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      key="map"
    >
      <APIProvider apiKey={API_KEY}>
        <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultCenter={{ lat: 45.721988, lng: 4.915888 }}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
        />
      </APIProvider>
    </Box>,
    <Box
      key="search"
      sx={{
        position: 'absolute',
        top: 25,
        zIndex: 10,
        backgroundColor: 'white',
        width: '80vw',
      }}
    >
      <TextField
        size="small"
        placeholder="Recherche des announces"
        slotProps={{
          input: {
            startAdornment: <SearchIcon />,
          },
        }}
        fullWidth
      />
    </Box>,
    <Fab
      key="fab"
      color="primary"
      aria-label="add"
      variant="extended"
      sx={{ position: 'fixed', bottom: '80px', right: 16, gap: '10px' }}
    >
      <EditIcon />
      Announce
    </Fab>,
  ];
};

export default MapPage;
