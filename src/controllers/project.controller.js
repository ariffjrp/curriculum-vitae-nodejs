const db = require('../models');

const { Project } = db;
const logger = require('../utils/logger');
const { createProject } = require('../validations/project.validation');

class ProjectController {
  static async createProject(req, res) {
    const {
      title, description, startDate, endDate,
    } = req.body;
    const { userId } = req;

    const { error } = createProject.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    try {
      const project = await Project.create({
        title,
        description,
        startDate,
        endDate,
        userId,
      });

      res.status(200).send({
        project,
        message: 'Project created successfully',
      });
    } catch (err) {
      logger.error(err);
      res.status(500).send({
        Message: 'Failed to create Portofolio. Please check application log.',
      });
    }
  }

  static async updateProject(req, res) {
    const {
      title, description, startDate, endDate,
    } = req.body;
    const { id } = req.params;

    try {
      const [updatedRowsCount, updatedProject] = await Project.update(
        {
          title, description, startDate, endDate,
        },
        {
          where: {
            id,
          },
        },
      );

      if (updatedRowsCount === 0) {
        return res.status(404).send({ message: 'Project not found' });
      }

      res.status(200).send({
        project: updatedProject[0],
        message: 'Project updated successfully',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to update Portofolio. Please check application log.',
      });
    }
  }

  static async deleteProject(req, res) {
    try {
      const { id } = req.params;
      await Project.destroy({
        where: {
          id,
        },
      });

      res.status(200).send({
        message: 'Project deleted successfully',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to delete Project. Please check application log.',
      });
    }
  }
}

module.exports = ProjectController;
