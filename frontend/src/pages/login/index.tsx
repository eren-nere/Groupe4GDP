import { Button, Container, TextField, Typography } from '@mui/material';
import reactLogo from '@assets/react.svg';
import { Link, useNavigate } from 'react-router';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1>StudySwap</h1>
      <p>Ceci est la page de connexion de l'application.</p>
      <TextField
        label="Nom"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Prénom"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Addresse"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: '1rem' }}
        onClick={() => {
          navigate('/feed');
        }}
      >
        Se connecter
      </Button>
      <Typography
        variant="body2"
        color="textSecondary"
        style={{ marginTop: '1rem' }}
      >
        Vous n'avez pas de compte ? <Link to="/sign-up">S'inscrire</Link>
      </Typography>
    </Container>
  );
};
export default LoginPage;
