require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { logger } = require('../utils/logger');

const { Account, User } = db;

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
      logger.warn('New password and confirm password do not match.');
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

    const { email } = req.body;

    User.findOne({
      where: {
        email,
      },
    })
      .then(() => {
        if (email) {
          logger.warn('Email already exists.');
          return res.status(400).send({
            message: 'Email already exists.',
          });
        }

        db.User.update(
          { email },
          {
            where: {
              id: req.userId,
            },
          },
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
    const { userId } = req;

    try {
      const [rowsAffected, [user]] = await User.update(
        { deletedAt: new Date() },
        { where: { id: userId }, returning: true },
      );

      if (rowsAffected === 0 || !user) {
        logger.warn('User not found.');
        return res.status(404).send({
          message: 'User not found.',
        });
      }

      res.status(200).send({
        message: 'Account marked for deletion. It will be permanently deleted after the recovery period.',
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send({
        message: 'Failed to mark account for deletion. Please try again later.',
      });
    }
  }
}

module.exports = UserController;
