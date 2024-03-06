'use strict';
const { Model } = require('sequelize');
const sequelize = require('../config/db.config.js');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      const Account = sequelize.models.Account;
      const RefreshToken = sequelize.models.RefreshToken;
      const Portofolio = sequelize.models.Portofolio;
      const Certificate = sequelize.models.Certificate;
      const Education = sequelize.models.Education;
      const Intership = sequelize.models.Intership;
      const Skill = sequelize.models.Skill;
      const Project = sequelize.models.Project;
      
      this.hasOne(RefreshToken, {
        foreignKey: 'userId',
        targetKey: 'id',
      });
      
      this.hasOne(Account, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      this.hasMany(Portofolio, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      this.hasMany(Certificate, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      this.hasMany(Education, {
        foreignKey: 'userId',
        targetKey: 'id',
      });
      
      this.hasMany(Intership, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      this.hasMany(Skill, {
        foreignKey: 'userId',
        targetKey: 'id',
      });

      this.hasMany(Project, {
        foreignKey: 'userId',
        targetKey: 'id',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      repeatPassword: {
        type: DataTypes.STRING,
      },
      provider: {
        type: DataTypes.STRING,
      },
      // otpCode: {
      //   type: DataTypes.STRING,
      // },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
    }
  );

  return User;
};
