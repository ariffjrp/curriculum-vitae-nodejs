require('dotenv').config();
const express = require('express');
const dbSync = require("./src/utils/dbsync.js");
const db = require("./src/models");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./src/utils/swagger.js").swaggerSpec
const winston = require("winston");
const { logger, combinedFormat } = require("./src/utils/logger.js");
const passport = require('./src/config/googleOAuth2.config.js');
const session = require('express-session');

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

logger.add(
  new winston.transports.Console({
    format: combinedFormat,
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

require('./src/routes/user.route.js')(app)
require('./src/routes/account.route.js')(app)
require('./src/routes/education.route.js')(app)
require('./src/routes/skill.route.js')(app)
require('./src/routes/certificate.route.js')(app)
require('./src/routes/intership.route.js')(app)
require('./src/routes/auth.route.js')(app)

if (process.env.NODE_ENV == "development") {
  db.sequelize.sync();
}else {
  dbSync()
}

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;