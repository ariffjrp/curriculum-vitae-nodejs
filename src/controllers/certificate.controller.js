const db = require('../models');

const { Certificate } = db;
const { logger } = require('../utils/logger');

class CertificateController {
  static async CreateCertificate(req, res) {
    const {
      companyName, role, startDate, endDate,
    } = req.body;

    const { userId } = req;

    Certificate.create({
      companyName,
      role,
      startDate,
      endDate,
      userId,
    })
      .then((data) => {
        res.status(200).send({
          data,
          Message: 'Certificate was created successfully!',
        });
      }).catch((err) => {
        logger.error(err);
        res.status(500).send({
          Message: 'Failed to create Certificate. Please check application log.',
        });
      });
  }

  static async updateCertificate(req, res) {
    Certificate.update(req.body, { where: { id: req.params.id } })
      .then(() => {
        res.status(200).send({ message: 'Certificate successfully updated.' });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to create certificate. Please check application log.',
        });
      });
  }

  static async deleteCertificate(req, res) {
    try {
      await Certificate.destroy({
        where: {
          id: req.params.id,
        },
      }).then(() => {
        res.status(200).send({ message: 'Certificate successfully deleted.' });
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to create Certificate. Please check application log.',
      });
    }
  }
}

module.exports = CertificateController;
