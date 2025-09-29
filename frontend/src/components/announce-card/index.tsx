import { Box, Paper, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import type { FC } from 'react';

const AnnounceCard: FC<Props> = ({ isFavorite }) => {
  return (
    <Paper sx={{ display: 'flex', p: 2, mb: 2, position: 'relative' }}>
      {isFavorite ? (
        <Favorite
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            color: 'red',
          }}
        />
      ) : (
        <FavoriteBorder
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            color: 'grey',
          }}
        />
      )}
      <Box>
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/579650108.jpg?k=c84863f9293252729677f8252bfa999d927a0a4779d337b1a5f4bb87ec872050&o=&hp=1"
          alt="Annonce"
          style={{
            width: '100px',
            height: '100px',
            marginRight: '16px',
            borderRadius: '8px',
          }}
        />
      </Box>
      <Box>
        <Typography variant="h6">T2 à Lyon centre</Typography>
        <Typography variant="body2">Disponibilité : 22/09 à 10/10</Typography>
        <Typography variant="caption">Posté il y a 2 heures</Typography>
        <Typography
          variant="body1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 1,
            gap: '4px',
          }}
        >
          <StarIcon sx={{ color: '#bf9b30', width: '20px' }} />
          4,5/5{' '}
          <Typography component="span" fontSize="8px" sx={{ alignSelf: 'end' }}>
            (20 avis)
          </Typography>
        </Typography>
      </Box>
    </Paper>
  );
};

type Props = {
  isFavorite?: boolean;
};

export default AnnounceCard;
