module.exports = {
  secret: process.env.SECRET_KEY,
  jwtExpiration: process.env.JWT_EXPIRATION,
  jwtRefreshExpiration: process.env.JWT_REFRESH,
};
