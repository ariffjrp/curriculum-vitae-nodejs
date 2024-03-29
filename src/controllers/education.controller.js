const db = require('../models');

const { Education } = db;
const { logger } = require('../utils/logger');
const { createEducation } = require('../validations/education.validation');

class EducationController {
  static async createEducation(req, res) {
    const {
      schoolName, degree, fieldOfStudy, startDate, endDate,
    } = req.body;

    const { userId } = req;

    const { error } = createEducation.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    Education.create({
      schoolName,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      userId,
    })
      .then((education) => {
        res.status(201).send({
          data: education,
          message: 'Education was created successfully!',
        });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to create education. Please check application log.',
        });
      });
  }

  static async updateEducation(req, res) {
    await Education.update(req.body, {
      where: {
        id: req.params.id,
      },
    }).then(() => {
      res.status(200).send({ message: 'education successfully updated.' });
    }).catch((err) => {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to create education. Please check application log.',
      });
    });
  }

  static async deleteEducation(req, res) {
    try {
      await Education.destroy({
        where: {
          id: req.params.id,
        },
      }).then(() => {
        res.status(200).send({ message: 'education successfully deleted.' });
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to create education. Please check application log.',
      });
    }
  }
}

module.exports = EducationController;
