'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Education extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                targetKey: 'id',
                onDelete: 'CASCADE',
            });
        }
    }

    Education.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            schoolName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            degree: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            fieldOfStudy: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Education',
        }
    );

    return Education;
}