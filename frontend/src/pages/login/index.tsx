import { Button, Container, TextField, Typography } from '@mui/material';
import reactLogo from '@assets/react.svg';
import { Link } from 'react-router';

const LoginPage = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1>StudySwap</h1>
      <p>Ceci est la page de connexion de l'application.</p>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Mot de passe"
        type="password"
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
      >
        Se connecter
      </Button>
      <Typography
        variant="body2"
        color="textSecondary"
        style={{ marginTop: '1rem' }}
      >
        Vous n'avez pas de compte ?{" "}
        <Link to="/sign-up">S'inscrire</Link>
      </Typography>
    </Container>
  );
};
export default LoginPage;
