import { Box, Button, IconButton, Typography } from '@mui/material';
import { Create, History, List } from '@mui/icons-material';
import Paper from '@components/paper';

const ProfilePage = () => {
  return (
    <div>
      <Paper sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>
          <img
            src="https://untitledui.com/images/avatars/pippa-wilkinson"
            style={{
              height: '100px',
              borderRadius: '50%',
              backgroundClip: 'content-box',
            }}
            alt="profile picture"
          />
        </Box>
        <Box width="100%">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Nom</Typography>
            <Typography variant="body1">Moreau</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Prénom</Typography>
            <Typography variant="body1">Léon</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Age</Typography>
            <Typography variant="body1">21</Typography>
          </Box>
        </Box>
      </Paper>
      <Paper>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" marginBottom="10px">
            Biographie
          </Typography>
          <IconButton>
            <Create />
          </IconButton>
        </Box>
        <Typography variant="body1" textAlign="justify">
          Passionné par la technologie et le développement web, j'aime créer des
          applications innovantes qui améliorent la vie des utilisateurs. En
          dehors du travail, je suis un amateur de randonnée et de photographie.
        </Typography>
      </Paper>
      <Paper>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" marginBottom="10px">
            A propos de moi
          </Typography>
          <IconButton>
            <Create />
          </IconButton>
        </Box>
        <Typography variant="body1">Age : 24 ans</Typography>
        <Typography variant="body1">
          Préférences : échanges de courte durée (1 semaine)
        </Typography>
        <Typography variant="body1">
          Mon logement : T2 situé à Cordeliers
        </Typography>
        <Typography variant="body1">
          Autre : Il y a un chat chez moi !
        </Typography>
      </Paper>
      <Button variant="outlined" color="primary" fullWidth sx={{
        marginBottom: "10px"
      }}
      startIcon={
        <List />
      }>
        Voir mes announces
      </Button>
      <Button variant="outlined" fullWidth startIcon={
        <History />
      }>
        Historique des voyages
      </Button>
    </div>
  );
};

export default ProfilePage;
