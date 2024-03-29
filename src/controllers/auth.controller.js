require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const config = require('../config/auth.config');
const { registerSchema, loginSchema } = require('../validations/user.validation');
const { logger } = require('../utils/logger');

const { Account, User, RefreshToken } = db;
const OTPService = require('../services/OTP.service');
const passport = require('../config/googleOAuth2.config');
const MailService = require('../services/mail.service');

class AuthController {
  static async register(req, res) {
    const {
      email, password, repeatPassword, name, address, phone, birthdate, gender, bio,
    } = req.body;

    const { error } = registerSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
    } catch (err) {
      logger.error(`Failed to check existing user: ${err.message}`);
      return res.status(500).json({ message: 'Failed to register user.' });
    }

    if (password !== repeatPassword) {
      logger.warn('Password and confirm password do not match');
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
        bio,
        secret,
      };

      res.status(200).send({
        message: 'Registration data saved successfully!',
      });
    } catch (err) {
      logger.error(`Failed to generate secret: ${err.message}`);
      res.status(500).send({ message: 'Failed to generate secret.' });
    }
  }

  static async sendOTPByEmail(req, res) {
    const { registrationData } = req.session;
    if (!registrationData) {
      return res.status(400).json({ message: 'Data pendaftaran tidak ditemukan dalam sesi' });
    }

    const { email, secret } = registrationData;

    try {
      const otp = OTPService.generateOTP(secret);

      await OTPService.sendOTPEmail(email, secret);

      res.status(200).json({ message: 'OTP berhasil dikirim!', otp });
    } catch (error) {
      console.error('Error 500 terjadi:', error);
      res.status(500).json({ message: 'Gagal mengirim email OTP.' });
    }
  }

  static async verifyEmail(req, res) {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' });
    }

    const { registrationData } = req.session;

    if (!registrationData || !registrationData.secret) {
      return res.status(400).json({ message: 'Registration data or secret not found in session' });
    }

    const { secret } = registrationData;

    try {
      console.log('Secret retrieved from registration data:', secret);

      const otpVerification = await OTPService.verifyTOTP(otp, secret);

      console.log('OTP verification result:', otpVerification);

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
        bio: registrationData.bio,
        userId: user.id,
      });

      delete req.session.registrationData;

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      const refreshToken = await RefreshToken.createToken(user);

      res.status(201).send({
        id: user.id,
        message: 'User was created successfully!',
        user,
        username: user.username,
        accessToken: token,
        refreshToken,
      });
    } catch (err) {
      console.error('Error occurred during email verification:', err);
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
          email: user.email,
        },
        config.secret,
        {
          expiresIn: config.jwtExpiration,
        },
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
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        const errorMessage = error.details[0].message;
        logger.warn(`Error occurred: ${errorMessage}`);
        return res.status(400).json({ message: errorMessage });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        logger.warn('Email is not registered. Check the email again.');
        return res.status(400).json({ message: 'Email is not registered. Check the email again.' });
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        logger.warn('Invalid password!');
        return res.status(401).json({ message: 'Invalid Password!' });
      }

      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: config.jwtExpiration });
      const refreshToken = await RefreshToken.createToken(user);

      res.status(200).json({
        id: user.id,
        username: user.username,
        accessToken: token,
        refreshToken,
      });
    } catch (err) {
      logger.error(err.message);
      res.status(500).json({ message: 'Failed to login. Please check application log.' });
    }
  }

  static autentikasiOAuth2(req, res, next) {
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account consent' })(req, res, next);
  }

  static callbackautentikasiOauth2(req, res) {
    passport.authenticate('google', { failureRedirect: '/v1/api/auth/register' })(req, res, async () => {
      logger.info('User data:', req.user);
      if (!req.user) {
        return res.status(401).send('Authentication failed');
      }

      try {
        const refreshToken = await RefreshToken.createToken(req.user);

        res.status(200).send({
          message: 'Login successful',
          refreshToken,
        });
        res.redirect('/halaman-utama');
      } catch (err) {
        console.error('Error creating refresh token:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  }

  static async resetPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).send({
          message: 'Email not found',
        });
      }

      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );

      const subject = 'Your Reset Password';
      const message = `Your link is: http://localhost:8000/v1/api/auth/confirm-reset-password?resetToken=${resetToken}`;

      await MailService.sendEmail(email, subject, message);

      return res.status(200).send({
        message: 'Password reset instructions have been sent to your email',
      });
    } catch (err) {
      console.error('Error resetting password:', err);
      return res.status(500).send({
        message: 'Failed to reset password. Please try again later.',
      });
    }
  }

  static async confirmResetPassword(req, res) {
    const { newPassword, repeatPassword } = req.body;
    const { resetToken } = req.query;

    try {
      const decoded = jwt.verify(resetToken, process.env.SECRET_KEY);

      if (!decoded.userId) {
        return res.status(400).send({
          message: 'Invalid token',
        });
      }

      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(404).send({
          message: 'User not found',
        });
      }

      if (newPassword !== repeatPassword) {
        return res.status(400).send({
          message: 'New password and repeat password do not match',
        });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      user.password = hashedPassword;
      await user.save();

      return res.status(200).send({
        message: 'Password has been reset successfully',
      });
    } catch (err) {
      console.error('Error confirming reset password:', err);
      return res.status(500).send({
        message: 'Failed to confirm reset password. Please try again later.',
      });
    }
  }
}

module.exports = AuthController;
