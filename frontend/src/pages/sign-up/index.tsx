import { Button, Container, TextField, Typography } from '@mui/material';
import reactLogo from '@assets/react.svg';
import { Link } from 'react-router';

const SignUpPage = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1>StudySwap</h1>
      <p>Ceci est la page d'inscription de l'application</p>
      {/* <TextField
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
      /> */}
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      />
      {/* <TextField
        label="Mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      />
      <TextField
        label="Confimrmer mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="dense"
        size="small"
      /> */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: '1rem' }}
      >
        S'inscrire
      </Button>
      <Typography
        variant="body2"
        color="textSecondary"
        style={{ marginTop: '1rem' }}
      >
        Vous avez déja un compte ?{" "}
        <Link to="/login">Se connecter</Link>
      </Typography>
    </Container>
  );
};
export default SignUpPage;
