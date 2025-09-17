require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const { profilesRouter } = require('./routes/profiles');
const { authRouter } = require('./routes/auth');

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

app.use('/api/profiles', profilesRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});


