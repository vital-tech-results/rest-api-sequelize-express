const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

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
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "first name"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "first name"',
                },
                is: {
                    args: ["^[a-z]+$", 'i'],
                    msg: 'first name must be only letters',
                },
            },
        },
        //(STRING, nullable)
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "last name"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "last name"',
                },
                is: {
                    args: ["^[a-z]+$", 'i'],
                    msg: 'first name must be only letters',
                },
            },
        },
        //(STRING, nullable)
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "email"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "email"',
                },
                isEmail: {
                    args: true,
                    msg: 'Please provide a valid email address',
                },
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            required: true,
            len: [2, 20],
            validate: {
                notNull: {
                    msg: 'Please provide a value for "password"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "password"',
                },
            },
        },

    }, {

        sequelize

    });
    
    //generate hash
    User.generateHash = password => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    };
    //check if password is valid
    User.prototype.validPassword = password => {
        return bcrypt.compareSync(password, this.localPassword);
    };

    //associate with Course model
    User.associate = (models) => {
        User.hasMany(models.Course, {
            // as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };
    return User;
};