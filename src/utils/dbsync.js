const db = require('../models');

const init = () => new Promise((resolve, reject) => {
  try {
    db.sequelize.sync({ force: true });
    resolve();
  } catch (err) {
    reject(err);
  }
});

module.exports = init;
