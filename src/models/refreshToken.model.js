const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/auth.config');

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
      const expiredAt = new Date();
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

      const token = uuidv4();

      const refreshToken = await RefreshToken.create({
        token,
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
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
    },
  );

  return RefreshToken;
};
