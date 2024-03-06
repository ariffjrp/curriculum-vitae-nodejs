'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/auth.config.js');
const sequelize = require('../config/db.config.js');
const User = require('./user.model.js');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });
    }

    static async createToken(user) {
      let expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

      let token = uuidv4();

      let refreshToken = await RefreshToken.create({
        token: token,
        userId: user.id,
        expiryDate: expiredAt,
      });

      return refreshToken.token;
    }

    static verifyExpiration(token) {
      return token.expiryDate < new Date();
    }
  }

  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
    }
  );

  return RefreshToken;
};
