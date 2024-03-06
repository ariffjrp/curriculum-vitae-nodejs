const MaxRetry = require('express-rate-limit');

const Jail = MaxRetry({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan login, coba lagi nanti.',
});

module.exports = Jail;
