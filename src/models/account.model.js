'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });
    }
  }

  Account.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
      },
      gender: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.BLOB,
      },
    },
    {
      sequelize,
      modelName: 'Account',
    }
  );

  return Account;
};
