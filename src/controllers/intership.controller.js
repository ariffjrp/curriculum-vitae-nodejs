const db = require('../models');

const { Intership } = db;
const { logger } = require('../utils/logger');
const { createIntership } = require('../validations/intership.validation');

class IntershipController {
  static async createIntership(req, res) {
    const {
      companyName, role, startDate, endDate,
    } = req.body;

    const { userId } = req;

    const { error } = createIntership.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    Intership.create({
      companyName,
      role,
      startDate,
      endDate,
      userId,
    })
      .then((data) => {
        res.status(200).send({
          data,
          Message: 'Intership was created successfully!',
        });
      }).catch((err) => {
        logger.error(err);
        res.status(500).send({
          Message: 'Failed to create Intership. Please check application log.',
        });
      });
  }

  static async updateIntership(req, res) {
    Intership.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        res.status(200).send({ message: 'Intership successfully updated.' });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to update Intership. Please check application log.',
        });
      });
  }

  static async deleteIntership(req, res) {
    try {
      await Intership.destroy({
        where: {
          id: req.params.id,
        },
      }).then(() => {
        res.status(200).send({ message: 'Intership successfully deleted.' });
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to delete Intership. Please check application log.',
      });
    }
  }
}

module.exports = IntershipController;
