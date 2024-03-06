require('dotenv').config();
const { validationResult } = require('express-validator');
const db = require('../models');
const bcrypt = require('bcryptjs');
const { logger } = require('../utils/logger');
const { Account, User} = db;

class UserController {
  static async updatePassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    const { oldPassword, newPassword, repeatPassword } = req.body;

    if (newPassword !== repeatPassword) {
      logger.warn(`New password and confirm password do not match.`);
      return res.status(400).send({
        message: 'New password and confirm password do not match.',
      });
    }

    User.findOne({
      where: {
        id: req.userId,
      },
    })
      .then((user) => {
        if (!user) {
          logger.warn('User not found.');
          return res.status(404).send({
            message: 'User not found.',
          });
        }

        const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

        if (!passwordIsValid) {
          logger.warn('Invalid old password.');
          return res.status(401).send({
            message: 'Invalid old password.',
          });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        user
          .update({
            password: hashedPassword,
            repeatPassword: hashedPassword,
          })
          .then(() => {
            res.status(200).send({
              message: 'Password updated successfully.',
            });
          })
          .catch((err) => {
            logger.error(err.message);
            res.status(500).send({
              message: 'Failed to update password. Please try again later.',
            });
          });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to fetch user data. Please check application logs.',
        });
      });
  }

  static async updateUsername(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    const { newUsername } = req.body;

    User.findOne({
      where: {
        username: newUsername,
      },
    })
      .then((user) => {
        if (user) {
          logger.warn('Username already exists.');
          return res.status(400).send({
            message: 'Username already exists.',
          });
        }

        db.User.update(
          { username: newUsername },
          {
            where: {
              id: req.userId,
            },
          }
        )
          .then(() => {
            res.status(200).send({
              message: 'Username updated successfully.',
            });
          })
          .catch((err) => {
            logger.error(err.message);
            res.status(500).send({
              message: 'Failed to update username. Please try again later.',
            });
          });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to fetch user data. Please check application logs.',
        });
      });
  }

  static async logOut(req, res) {
    const token = req.headers['x-access-token'];

    if (!token) {
      logger.warn('No token provided!');
      return res.status(401).send({
        message: 'No token provided!',
      });
    }

    res.clearCookie('token'); // Use res.clearCookie() to clear the cookie

    res.status(200).send({
      message: 'Logout successful!',
    });
  }

  static async deleteAccount(req, res) {
    const userId = req.userId; // Get user ID from access token

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    const { username } = req.body; // Get username from request

    User.findOne({
      where: {
        id: userId,
      },
      include: [Account], // Include Account model
    })
      .then((user) => {
        if (!user) {
          logger.warn('User not found.');
          return res.status(404).send({
            message: 'User not found.',
          });
        }

        // Verify the username
        if (user.username !== username) {
          logger.warn('Invalid username. Please enter your username correctly.');
          return res.status(400).send({
            message: 'Invalid username. Please enter your username correctly.',
          });
        }

        // Periksa apakah data sudah melewati batas waktu yang Anda tentukan
        if (user.deletedAt && new Date() - user.deletedAt > (5 * 60 * 1000)) {
          return res.status(400).send({
            message: 'Masa pemulihan data telah berakhir.',
          });
        }

        User.destroy({
          where: {
            id: userId,
          },
        })
          .then(() => {
            res.status(200).send({
              message: 'Account deleted successfully.',
            });
          })
          .catch((err) => {
            logger.error(err.message);
            res.status(500).send({
              message: 'Failed to delete account. Please try again later.',
            });
          });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to find user. Please try again later.',
        });
      });
  }
}

module.exports = UserController;
