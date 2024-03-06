const { validationResult } = require('express-validator');
const db = require('../models');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { logger } = require('../utils/logger');
const { Account, User, RefreshToken } = db;
const OTPService = require('../services/OTP.service');
const passport = require('../config/googleOAuth2.config');

class UserController {
  static async register(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        logger.warn(`Error occurred: ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }

      const { email, password, repeatPassword, name, address, phone, birthdate, gender } = req.body;

      try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
      } catch (error) {
        logger.error(`Failed to check existing user: ${error.message}`);
        return res.status(500).json({ message: 'Failed to register user.' });
      }

      if (password !== repeatPassword) {
        logger.warn(`Password and confirm password do not match`);
        return res
          .status(400)
          .json({ message: 'Password and confirm password do not match' });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      try {
        const secret = OTPService.generateSecret();

        req.session.registrationData = {
          email,
          password: hashedPassword,
          repeatPassword: hashedPassword,
          name,
          address,
          phone,
          birthdate,
          gender,
          secret, 
        };


        res.status(200).send({
            message: 'Registration data saved successfully!',
        });
      } catch (error) {
        logger.error(`Failed to generate secret: ${error.message}`);
        res.status(500).send({ message: 'Failed to generate secret.' });
      }
  }

  static async sendOTPByEmail(req, res) { 
      const registrationData = req.session.registrationData;
      if (!registrationData) {
          return res.status(400).json({ message: 'Data pendaftaran tidak ditemukan dalam sesi' });
      }

      const { email, secret } = registrationData; 

      try {
          const otp = OTPService.generateOTP(secret);

          await OTPService.sendOTPEmail(email, secret); 

          res.status(200).json({ message: 'OTP berhasil dikirim!', otp });
      } catch (error) {
          console.error("Error 500 terjadi:", error); 
          res.status(500).json({ message: 'Gagal mengirim email OTP.' });
      }
  }

  static async verifyEmail(req, res) {
    const { otp } = req.body;

    if (!otp) {
        return res.status(400).json({ message: 'OTP is required' });
    }

    const registrationData = req.session.registrationData;

    if (!registrationData || !registrationData.secret) {
        return res.status(400).json({ message: 'Registration data or secret not found in session' });
    }

    const secret = registrationData.secret;

    try {
        console.log("Secret retrieved from registration data:", secret);

        const otpVerification = await OTPService.verifyTOTP(otp, secret);

        console.log("OTP verification result:", otpVerification);

        if (!otpVerification) {
            return res.status(400).json({ message: 'OTP verification failed' });
        }

        const user = await User.create({
            email: registrationData.email,
            password: registrationData.password,
            repeatPassword: registrationData.repeatPassword,
        });

        await Account.create({
            name: registrationData.name,
            email: registrationData.email,
            address: registrationData.address,
            phone: registrationData.phone,
            birthdate: registrationData.birthdate,
            gender: registrationData.gender,
            userId: user.id,
        });

        delete req.session.registrationData;

        res.status(201).send({
            message: 'User was created successfully!',
            user: user,
        });
    } catch (err) {
        console.error("Error occurred during email verification:", err);
        res.status(500).send({
            message: 'Failed to create user. Please check application log.',
        });
    }
}


  static async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        logger.warn('Refresh Token is required');
        return res.status(401).send({
            message: 'Refresh Token is required!',
        });
    }

    try {
        const foundRefreshToken = await RefreshToken.findOne({
            where: {
                token: refreshToken,
            },
        });

        if (!foundRefreshToken) {
            logger.warn('Refresh token is not in database!');
            return res.status(400).send({
                message: 'Refresh token is not in database!',
            });
        }

        if (RefreshToken.verifyExpiration(foundRefreshToken)) {
            await RefreshToken.destroy({ where: { id: foundRefreshToken.id } });
            logger.warn('Refresh token has expired, please make a new signin request');
            return res.status(403).send({
                message: 'Refresh token has expired. Please make a new signin request',
            });
        }

        const user = await foundRefreshToken.getUser();
        const newAccessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            config.secret,
            {
                expiresIn: config.jwtExpiration,
            }
        );

        return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: foundRefreshToken.token,
        });
    } catch (err) {
        logger.error(err.message);
        return res.status(500).send({
            message: 'Failed to generate access token. Please check application log.',
        });
    }
}

  static async login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessage = errors.array()[0].msg;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    User.findOne({
      where: {
        username: req.body.username,
      },
    })
      .then(async (user) => {
        if (!user) {
          logger.warn('Username is not registered. Check the username again.');
          return res.status(400).send({
            message: 'Username is not registered. Check the username again.',
          });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
          logger.warn('Invalid password!');
          return res.status(401).send({
            message: 'Invalid Password!',
          });
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: config.jwtExpiration,
        });

        const refreshToken = await RefreshToken.createToken(user);

        res.status(200).send({
          id: user.id,
          username: user.username,
          accessToken: token,
          refreshToken: refreshToken,
        });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to login. Please check application log.',
        });
      });
  }

  static autentikasiOAuth2(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: "select_account consent", })(req, res, next);
  }

  static callbackautentikasiOauth2(req, res) {
    passport.authenticate('google', { failureRedirect: '/api/login' })(req, res, async () => {
    
      logger.info("User data:", req.user);
      if (!req.user) {
        return res.status(401).send('Authentication failed');
      }
      
      try {
        const refreshToken = await RefreshToken.createToken(req.user);
        
        res.status(200).send({
          message: 'Login successful',
          refreshToken: refreshToken,
        });
        res.redirect('/halaman-utama');
      } catch (err) {
        console.error('Error creating refresh token:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  }

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
