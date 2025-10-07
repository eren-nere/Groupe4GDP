import { Box, Typography } from '@mui/material';
import Paper from "@components/paper";
import StarIcon from '@mui/icons-material/Star';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import type { FC } from 'react';
import { useNavigate } from 'react-router';

const AnnounceCard: FC<Props> = ({ isFavorite }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ display: 'flex', p: "10px", mb: 2, position: 'relative' }} onClick={() => {
      navigate('/announce-details');
    }}>
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
            marginRight: '10px',
            borderRadius: '8px',
          }}
        />
      </Box>
      <Box>
        <Typography variant="h6">Studio à Confluence</Typography>
        <Typography variant="body2" fontSize="11px">Disponible du 22/09/2025 au 10/10/2025</Typography>
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
