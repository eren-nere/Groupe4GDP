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
const MOCK_ANNOUNCES = 20;

const FeedPage = () => {
  const [viewType, setViewType] = useState<'list' | 'map'>('list');

  return [
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
      key="feed"
    >
      <TextField
        size="small"
        placeholder="Recherche des announces"
        slotProps={{
          input: {
            startAdornment: <SearchIcon />,
          },
        }}
      />

      <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={(_, value) => {
          if (value) setViewType(value);
        }}
        aria-label="view type"
        sx={{ mt: "20px" }}
      >
        <ToggleButton value="list" aria-label="left aligned" fullWidth>
          <Typography>Liste</Typography>
        </ToggleButton>
        <ToggleButton value="map" aria-label="centered" fullWidth>
          <Typography>Map</Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      {viewType === 'list' ? (
        <>
          <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
            Fil d'announces récentes
          </Typography>
          <Box paddingBottom={'80px'}>
            {/* List of announces */}
            {Array(MOCK_ANNOUNCES)
              .fill(0)
              .map((_, index) => (
                <AnnounceCard key={index} />
              ))}
          </Box>
        </>
      ) : (
        <Box display="flex" height="calc(80vh - 120px)" marginTop="20px">
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{ lat: 45.721988, lng: 4.915888 }}
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI
            />
          </APIProvider>
        </Box>
      )}
    </Box>,
  ];
};

export default FeedPage;
