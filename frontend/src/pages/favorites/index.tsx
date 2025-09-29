import { Box, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AnnounceCard from '@components/announce-card';

const MOCK_ANNOUNCES = 2;

const FavoritesPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <TextField
        size="small"
        placeholder="Recherche des announces favories"
        slotProps={{
          input: {
            startAdornment: <SearchIcon />,
          },
        }}
      />
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Favoris
      </Typography>
      <Box paddingBottom={'80px'}>
        {/* List of announces */}
        {Array(MOCK_ANNOUNCES)
          .fill(0)
          .map((_, index) => (
            <AnnounceCard key={index} isFavorite />
          ))}
      </Box>
    </Box>
  );
};

export default FavoritesPage;
