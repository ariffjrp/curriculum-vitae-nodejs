const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate() {
      const { Account } = sequelize.models;
      const { RefreshToken } = sequelize.models;
      const { Portofolio } = sequelize.models;
      const { Certificate } = sequelize.models;
      const { Education } = sequelize.models;
      const { Intership } = sequelize.models;
      const { Skill } = sequelize.models;
      const { Project } = sequelize.models;

      this.hasOne(RefreshToken, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasOne(Account, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasMany(Portofolio, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasMany(Certificate, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasMany(Education, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasMany(Intership, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasMany(Skill, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });

      this.hasMany(Project, {
        foreignKey: 'userId',
        targetKey: 'id',
        onDelete: 'CASCADE',
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
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
      timestamps: true,
      underscored: true,
    },
  );

  return User;
};
