const multer = require('multer');
const sharp = require('sharp');
const mime = require('mime-types');
const { updateAccountSchema } = require('../validations/account.validation');
const db = require('../models');
const { logger } = require('../utils/logger');

const { Account } = db;

class AccountController {
  static async updateAccount(req, res) {
    const {
      name, email, address, phone, birthdate, gender, bio,
    } = req.body;

    const { error } = updateAccountSchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      logger.warn(`Error occurred: ${errorMessage}`);
      return res.status(400).json({ message: errorMessage });
    }

    Account.findOne({
      where: {
        userId: req.userId,
      },
    })
      .then((account) => {
        if (!account) {
          logger.warn('Account not found');
          return res.status(404).send({
            message: 'Account not found.',
          });
        }

        // Memperbarui informasi akun
        account
          .update({
            name: name || account.name,
            email: email || account.email,
            address: address || account.address,
            phone: phone || account.phone,
            birthdate: birthdate || account.birthdate,
            gender: gender || account.gender,
            bio: bio || account.bio,
          })
          .then(() => {
            res.status(200).send({
              message: 'Account updated successfully.',
            });
          })
          .catch((err) => {
            logger.error(err.message);
            res.status(500).send({
              message: 'Failed to update account. Please try again later.',
            });
          });
      })
      .catch((err) => {
        logger.error(err.message);
        res.status(500).send({
          message: 'Failed to retrieve account data. Please check the application log.',
        });
      });
  }

  static async uploadAvatar(req, res) {
    const storage = multer.memoryStorage();
    const upload = multer({
      storage,
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    });

    upload.single('avatar')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Tangani error yang terkait dengan Multer
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).send({ message: 'File size exceeds the allowed limit of 2MB.' });
        }
        console.error(err);
        res.status(400).send({ message: 'Failed to upload avatar. Please try again later.' });
      } else if (err) {
        // Tangani error lainnya
        console.error(err);
        res.status(500).send({ message: 'An unexpected error occurred. Please try again later.' });
      } else {
        if (!req.file) {
          return res.status(400).send({ message: 'File not found.' });
        }

        const allowedFormats = ['jpg', 'jpeg', 'png'];
        const ext = mime.extension(req.file.mimetype);

        if (!ext || !allowedFormats.includes(ext)) {
          return res.status(400).send({
            message: 'Invalid file format. Only JPEG, PNG files are allowed.',
          });
        }

        sharp(req.file.buffer)
          .resize(200, 200)
          .toBuffer()
          .then((buffer) => {
            Account.findOne({
              where: {
                userId: req.userId,
              },
            })
              .then((account) => {
                if (!account) {
                  return res.status(404).send({ message: 'Account not found.' });
                }

                // Mengupdate kolom avatar dengan data gambar baru
                account.avatar = buffer;
                return account.save();
              })
              .then(() => {
                res.status(200).send({ message: 'Avatar uploaded and processed successfully.' });
              })
              .catch((error) => {
                console.error(error);
                res.status(500).send({ message: 'Failed to save avatar. Please try again later.' });
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send({ message: 'Failed to process avatar. Please try again later.' });
          });
      }
    });
  }

  static async getAvatar(req, res) {
    Account.findOne({
      where: {
        userId: req.userId,
      },
    })
      .then((account) => {
        if (!account || !account.avatar) {
          return res.status(404).send({
            message: 'Avatar not found.',
          });
        }

        res.set('Content-Type', 'image/png');
        res.send(account.avatar);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch avatar. Please try again later.' });
      });
  }

  static async getAbout(req, res) {
    Account.findOne({
      where: {
        userId: req.userId,
      },
    })
      .then((account) => {
        res.status(200).send({
          data: {
            id: account.id,
            name: account.name,
            email: account.email,
            address: account.address,
            phone: account.phone,
            birthdate: account.birthdate,
            gender: account.gender,
            bio: account.bio,
          },
        });
      })
      .catch((err) => {
        logger.error(err);
        res.status(500).send({
          message: 'Failed to retrieve account. Please check application log.',
        });
      });
  }
}

module.exports = AccountController;
