const db = require('../models');

const { Portofolio } = db;
const logger = require('../utils/logger');
const { createPortofolio } = require('../validations/portofolio.validation');

class PortofolioController {
  static async createPortofolio(req, res) {
    const { title, description } = req.body;
    const { userId } = req;

    const { error } = createPortofolio.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    try {
      const portofolio = await Portofolio.create({
        title,
        description,
        userId,
      });

      res.status(200).send({
        portofolio,
        Message: 'Portofolio was created successfully',
      });
    } catch (err) {
      logger.error(err);
      res.status(500).send({
        Message: 'Failed to create Portofolio. Please check application log.',
      });
    }
  }

  static async updatePortoffolio(req, res) {
    const { title, description } = req.body;
    const { id } = req.params;

    try {
      const [updatedRowsCount, updatedPortofolio] = await Portofolio.update(
        { title, description },
        { where: { id }, returning: true },
      );

      if (updatedRowsCount === 0) {
        return res.status(404).send({ message: 'Portofolio not found' });
      }

      res.status(200).send({
        portofolio: updatedPortofolio[0],
        message: 'Portofolio updated successfully',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to update Portofolio. Please check application log.',
      });
    }
  }

  static async deletePortofolio(req, res) {
    const { id } = req.params;
    try {
      await Portofolio.destroy({
        where: {
          id,
        },
      }).then(() => {
        res.status(200).send({
          message: 'Portofolio deleted successfully',
        });
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to delete Intership. Please check application log.',
      });
    }
  }
}

module.exports = PortofolioController;
