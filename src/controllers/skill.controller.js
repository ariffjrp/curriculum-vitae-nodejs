const db = require('../models');

const { Skill } = db;
const { logger } = require('../utils/logger');
const { CreateSkills } = require('../validations/skill.validation');

class SkillController {
  static async CreateSkill(req, res) {
    const { Name } = req.body;

    const { userId } = req;

    const { error } = CreateSkills.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    Skill.create({
      Name,
      userId,
    })
      .then((skill) => {
        res.status(200)
          .send({
            data: skill,
            Message: 'Skill was created successfully!',
          });
      }).catch((err) => {
        logger.error(err);
        res.status(500).send({
          message: 'Failed to create skill. Please check application log.',
        });
      });
  }

  static async UpdateSkill(req, res) {
    Skill.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then(() => {
        res.status(200).send({ message: 'Skill successfully updated.' });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to create skill. Please check application log.',
        });
      });
  }

  static async DeleteSkill(req, res) {
    try {
      await Skill.destroy({
        where: {
          id: req.params.id,
        },
      }).then(() => {
        res.status(200).send({ message: 'Skill successfully deleted.' });
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to create Skill. Please check application log.',
      });
    }
  }
}

module.exports = SkillController;
