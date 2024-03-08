require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const winston = require('winston');
const session = require('express-session');
const dbSync = require('./src/utils/dbsync');
const db = require('./src/models');
const { swaggerSpec } = require('./src/utils/swagger');
const { logger, combinedFormat } = require('./src/utils/logger');
const passport = require('./src/config/googleOAuth2.config');

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

logger.add(
  new winston.transports.Console({
    format: combinedFormat,
  }),
);

app.use('/api', (req, res, next) => {
  req.contexPath = '/api';
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/docs', cors(corsOptions), swaggerUI.serve, swaggerUI.setup(swaggerSpec));

require('./src/routes/user.route')(app);
require('./src/routes/account.route')(app);
require('./src/routes/education.route')(app);
require('./src/routes/skill.route')(app);
require('./src/routes/certificate.route')(app);
require('./src/routes/intership.route')(app);
require('./src/routes/auth.route')(app);
require('./src/routes/portofolio.route')(app);
require('./src/routes/project.route')(app);

if (process.env.NODE_ENV === 'development') {
  db.sequelize.sync();
} else {
  dbSync();
}

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;
