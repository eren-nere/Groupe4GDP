import AnnounceCard from '@components/announce-card';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useState } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MOCK_ANNOUNCES = 2;

const FavoritesPage = () => {
  const [viewType, setViewType] = useState<'list' | 'map'>('list');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '20px' }}>
      <TextField
        size="small"
        placeholder="Recherche des announces favories"
        slotProps={{
          input: {
            startAdornment: <SearchIcon />,
          },
        }}
        sx={{
          backgroundColor: '#FFF',
        }}
      />
      <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={(_, value) => {
          if (value) setViewType(value);
        }}
        aria-label="view type"
      >
        <ToggleButton value="list" aria-label="left aligned" fullWidth>
          <Typography>Liste</Typography>
        </ToggleButton>
        <ToggleButton value="map" aria-label="centered" fullWidth>
          <Typography>Carte</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
      <Typography variant="h5">
        Favoris
      </Typography>
      {viewType === 'map' ? (
        <Box display="flex" height="60vh" marginTop="20px">
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{ lat: 45.721988, lng: 4.915888 }}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI
            />
          </APIProvider>
        </Box>
      ) : (
        <Box>
          {/* List of announces */}
          {Array(MOCK_ANNOUNCES)
            .fill(0)
            .map((_, index) => (
              <AnnounceCard key={index} isFavorite />
            ))}
        </Box>
      )}
    </Box>
  );
};

export default FavoritesPage;
