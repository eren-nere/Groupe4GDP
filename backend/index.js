require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const { utilisateurRouter } = require('./routes/utilisateur');
const { authRouter } = require('./routes/auth');
const { annonceRouter } = require('./routes/annonce');
const { adresseRouter } = require('./routes/adresse');
const { reservationRouter } = require('./routes/reservation');
const { messageRouter } = require('./routes/message');
const { evaluationRouter } = require('./routes/evaluation');

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EtuLoge API',
    version: '1.0.0',
    description: 'API pour EtuLoge',
  },
  servers: [
    {
      url: process.env.API_BASE_URL || 'http://localhost:3001',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/utilisateur', utilisateurRouter);
app.use('/api/auth', authRouter);
app.use('/api/annonce', annonceRouter);
app.use('/api/adresse', adresseRouter);
app.use('/api/reservation', reservationRouter);
app.use('/api/message', messageRouter);
app.use('/api/evaluation', evaluationRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});


