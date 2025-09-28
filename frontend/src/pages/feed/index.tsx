import { Box, TextField, Fab, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AnnounceCard from '@components/announce-card';

const MOCK_ANNOUNCES = 20;

const FeedPage = () => {
  return [
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <TextField
        size="small"
        placeholder="Recherche des announces"
        slotProps={{
          input: {
            startAdornment: <SearchIcon />,
          },
        }}
      />
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
    </Box>,
    <Fab
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

export default FeedPage;
