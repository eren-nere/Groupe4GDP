import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Grid,
  TextareaAutosize,
  Button,
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import Paper from '@components/paper';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ROOMS = [
  'https://plus.unsplash.com/premium_photo-1661962952618-031d218dd040?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cm9vbXxlbnwwfDJ8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfDJ8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1671269942393-ab3372a09ce9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cm9vbXxlbnwwfDJ8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cm9vbXxlbnwwfDJ8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm9vbXxlbnwwfDJ8MHx8fDA%3D',
];

const AnnounceCreation = () => {
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
            Création d'announce
          </Typography>
          <Box width="30px" />
        </Toolbar>
      </AppBar>
      <Paper sx={{ marginTop: '50px' }}>
        <Typography variant="h6" fontWeight="600" marginBottom="10px">
          Photos
        </Typography>
        <Grid container spacing={1}>
          <Grid size={4}>
            <Box
              sx={{
                height: '100px',
                aspectRatio: 1,
                backgroundColor: 'lightgrey',
                borderRadius: '10px',
                border: '3px dashed grey',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Add />
            </Box>
          </Grid>
          {ROOMS.map((room) => (
            <Grid size={4} key={room}>
              <img
                src={room}
                alt="room decor image"
                style={{
                  height: '100px',
                  aspectRatio: 1,
                  borderRadius: '10px',
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Paper>
        <Typography variant="h6" marginBottom="10px" fontWeight={600}>
          Desciption
        </Typography>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={5}
          placeholder="Ecrire la description du logement, les équipements fournis, les détails importants..."
          style={{
            width: '90%',
            borderRadius: '10px',
            backgroundColor: '#f4f4f4ff',
            padding: '10px',
          }}
        />
      </Paper>
      <Paper>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="h6" fontWeight={600} marginBottom="10px">
            Dates
          </Typography>

          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Date d'arrivé" />
          </DemoContainer>

          <DemoContainer components={['DatePicker']}>
            <DatePicker label="Date de départ" />
          </DemoContainer>
        </LocalizationProvider>
      </Paper>
      <Button variant="contained" fullWidth sx={{
        marginBottom: "100px"
      }}>
        Créer l'announce
      </Button>
    </div>
  );
};

export default AnnounceCreation;
