const cron = require('node-cron');
const moment = require('moment');
const { Op } = require('sequelize'); // Tambahkan ini untuk mengimpor operator Sequelize
const db = require('../models');

const { User } = db;
const logger = require('./logger');

cron.schedule('/5 * * * *', async () => {
  try {
    const deletedUsersCount = await User.destroy({
      where: {
        deletedAt: {
          [Op.lt]: moment().subtract(2, 'minutes').toDate(),
        },
      },
    });

    logger.info(`${deletedUsersCount} users permanently deleted.`);
  } catch (err) {
    logger.error('Failed to perform account cleanup:', err);
  }
});
