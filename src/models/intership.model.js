'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Intership extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'userId',
                targetKey: 'id',
                onDelete: 'CASCADE',
            });
        }
    }

    Intership.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            companyName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
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
            modelName: 'Intership',
        }
    );

    return Intership;
}