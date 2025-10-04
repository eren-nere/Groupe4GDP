import { useState } from 'react';
import {
  Box,
  ButtonBase,
  Divider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';

import { Search } from '@mui/icons-material';

const MOCK_MESSAGES = [
  {
    id: 0,
    name: 'Sacha Warren',
    message: "Super merci, j'ai bien reçu les photos",
    time: '2min',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq2q83JcZgPQfNlAnwAJkBJ-eS9OK7UUzJ5Q&s',
  },
  {
    id: 1,
    name: 'Hugo Soulier',
    message: 'Envoyé il a 14h',
    time: '14h',
    avatar: 'https://untitledui.com/images/avatars/phoenix-baker',
  },
  {
    id: 2,
    name: 'Amélie Dubois',
    message: 'Voici mon numéro : 06 12 34 56 78',
    time: '2h',
    avatar: 'https://untitledui.com/images/avatars/candice-wu',
  },
  {
    id: 3,
    name: 'Emma Perrin',
    message: "L'appart est meublé et proche du métro",
    time: '2s',
    avatar: 'https://untitledui.com/images/avatars/eve-leroy',
  },
  {
    id: 4,
    name: 'Aïcha Haddad',
    message: "Désolé le logment viens d'être pris",
    time: '18s',
    avatar: 'https://untitledui.com/images/avatars/rosalee-melvin',
  },
  {
    id: 5,
    name: 'Nelson Gomez',
    message: "Y'a pas de soucis, à bientôt !",
    time: '32s',
    avatar: 'https://untitledui.com/images/avatars/zahir-mays',
  },
];

const MessagesPage = () => {
  const [viewType, setViewType] = useState<'messages' | 'requests'>('messages');

  return (
    <Box display="flex" flexDirection="column" width="100%" gap="20px">
      <ToggleButtonGroup
        value={viewType}
        exclusive
        onChange={(_, value) => {
          if (value) setViewType(value);
        }}
        aria-label="view type"
        sx={{ mt: '20px' }}
      >
        <ToggleButton value="messages" aria-label="left aligned" fullWidth>
          <Typography>Messages</Typography>
        </ToggleButton>
        <ToggleButton value="requests" aria-label="centered" fullWidth>
          <Typography>Requests</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        size="small"
        placeholder="Recherche des personnes"
        sx={{
          backgroundColor: '#FFF',
        }}
        slotProps={{
          input: {
            startAdornment: (
              <Search
                sx={{
                  marginRight: '10px',
                }}
              />
            ),
          },
        }}
      />
      <Box
        bgcolor="#FFF"
        borderRadius="8px"
        display="flex"
        flexDirection="column"
        width="100%"
      >
        {MOCK_MESSAGES.map((msg, index) => (
          <Box key={msg.name}>
            <ButtonBase sx={{ width: '100%', textAlign: 'left' }}>
              <Box display="flex" padding="10px" width="100%">
                <img
                  src={msg.avatar}
                  style={{
                    width: '60px',
                    borderRadius: '50%',
                    backgroundClip: 'content-box',
                  }}
                  alt="profile picture"
                />
                <Box marginLeft="10px" width="100%">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Typography variant="h6" fontWeight="600">
                      {msg.name}
                    </Typography>
                    <Typography variant="body2" color="textDisabled">
                      {msg.time}
                    </Typography>
                  </Box>
                  <Typography color="textDisabled">{msg.message}</Typography>
                </Box>
              </Box>
            </ButtonBase>
            {index < MOCK_MESSAGES.length - 1 && (
              <Box display="flex" justifyContent="center">
                <Divider sx={{ width: '90%' }} />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MessagesPage;
