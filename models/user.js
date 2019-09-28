const Sequelize = require('sequelize');

'use strict';

module.exports = (sequelize) => {
    class User extends Sequelize.Model { }
    User.init({
        //(Integer, primary key, auto- generated)
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        //(STRING)
        firstName: {
            type: Sequelize.STRING,
        },
        //(STRING, nullable)
        lastName: {
            type: Sequelize.STRING,
        },
        //(STRING, nullable)
        emailAddress: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },

    }, {
        tableName: 'Users',
        freezeTableName: true,
        sequelize

    });

    User.associate = (models) => {
        User.hasMany(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };
    return User;
};