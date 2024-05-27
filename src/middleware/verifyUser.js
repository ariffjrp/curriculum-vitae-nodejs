const db = require('../models');
const { logger } = require('../utils/logger');

const { User } = db;

const checkDuplicateEmail = (req, res, next) => {
  if (!req.body.email) return next();
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      logger.warn('Failed! Email is already in use!');
      res.status(400).send({
        message: 'Failed! Email is already in use!',
      });
      return;
    }
    next();
  });
};

const verifyUser = {
  checkDuplicateEmail,
};

module.exports = verifyUser;
