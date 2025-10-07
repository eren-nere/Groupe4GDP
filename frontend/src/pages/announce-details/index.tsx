import {
  ArrowBack,
  FavoriteBorder,
  Star,
  StarBorder,
  StarHalf,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';

const AnnounceDetails = () => {
  const navigate = useNavigate();

  return (
    <div>
      <AppBar
        position="absolute"
        sx={{ backgroundColor: '#FFF', color: '#000' }}
        elevation={1}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div">
            Détails de l'annonce
          </Typography>
          <IconButton color="inherit" aria-label="more options">
            <FavoriteBorder />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box marginTop="50px">
        <img
          src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/579650108.jpg?k=c84863f9293252729677f8252bfa999d927a0a4779d337b1a5f4bb87ec872050&o=&hp=1"
          alt="Annonce"
          style={{
            width: '90vw',
            aspectRatio: '15/9',
            marginRight: '16px',
            borderRadius: '8px',
          }}
        />
      </Box>

      {/* Title box */}
      <Box
        padding="16px"
        sx={{
          backgroundColor: '#FFF',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          marginTop: '16px',
        }}
      >
        <Typography variant="h5" fontSize="22px" fontWeight="700" gutterBottom>
          Studio à Confluence
        </Typography>
        <Typography variant="body1" gutterBottom color="textSecondary">
          Disponible du 22/09/2025 au 10/10/2025
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Statu d'annonce :{' '}
          <Chip
            label="Toujours disponible"
            sx={{ backgroundColor: '#D5FDE1', color: '#155427' }}
          />
        </Typography>
      </Box>

      {/* Description box */}
      <Box
        padding="16px"
        sx={{
          backgroundColor: '#FFF',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          marginTop: '16px',
        }}
      >
        <Typography variant="h5" fontSize="22px" fontWeight="700" gutterBottom>
          Description du logement
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Appartement lumineux situé à proximité du T2 Hôtel de Région
          Montrochet. Inclus : Wi-Fi, Clim, canapé clic-clac. Me contacter pour
          plus d’informations.
        </Typography>
      </Box>

      {/* Profile box */}
      <Box
        padding="16px"
        sx={{
          backgroundColor: '#FFF',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          marginTop: '16px',
        }}
      >
        <Box display="flex">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq2q83JcZgPQfNlAnwAJkBJ-eS9OK7UUzJ5Q&s"
            style={{
              height: '70px',
              aspectRatio: '1',
              borderRadius: '50%',
              backgroundClip: 'content-box',
            }}
          />
          <Box marginLeft="16px">
            <Typography
              variant="h5"
              fontSize="22px"
              fontWeight="700"
              gutterBottom
            >
              Amélie Dubois, 24 ans
            </Typography>
            <Box>
              <Star sx={{ color: '#ffbf00' }} />
              <Star sx={{ color: '#ffbf00' }} />
              <Star sx={{ color: '#ffbf00' }} />
              <StarHalf sx={{ color: '#ffbf00' }} />
              <StarBorder sx={{ color: '#ffbf00' }} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" gap="8px" marginTop="16px">
          <Button variant="contained" sx={{ flex: 1, fontSize: '12px' }}>
            Contacter
          </Button>
          <Button variant="outlined" sx={{ flex: 1, fontSize: '12px' }}>
            Accéder au profil
          </Button>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginY: '16px', marginBottom: "100px" }}
      >
        Demander réservation
      </Button>
    </div>
  );
};

export default AnnounceDetails;
