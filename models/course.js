const Sequelize = require('sequelize');

'use strict';

module.exports = (sequelize) => {
    class Course extends Sequelize.Model { }
    Course.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for First Name',
                },
                notEmpty: {
                    msg: 'Please provide a value for First Name',
                },
            },
        },
        //(Integer, primary key, auto- generated)
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        //(id from the Users table)
        userId: {
            type: Sequelize.INTEGER,
            foreignKey: true,
        },
        //(STRING)
        title: {
            type: Sequelize.STRING,
        },
        //(Text)
        description: {
            type: Sequelize.TEXT,
        },
        //(STRING, nullable)
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        //(STRING, nullable)
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true,
        },

    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };

    return Course;
};
