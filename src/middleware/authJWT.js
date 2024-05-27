const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { logger } = require('../utils/logger');

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    logger.warn('Unauthorized! Access Token was expired!');
    res.status(401).send({
      message: 'Unauthorized! Access Token was expired!',
    });
  } else {
    logger.warn('Unauthorized! Access Token');
    res.status(401).send({ message: 'Unauthorized! Access Token' });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    logger.warn('No token provided!');
    return res.status(403).send({
      message: 'No token provided!',
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      logger.error('Token verification error:', err);
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
