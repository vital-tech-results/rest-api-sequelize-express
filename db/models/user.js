'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        //(Integer, primary key, auto- generated)
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        //(String)
        firstName: {
            type: DataTypes.String,
        },
        //(String, nullable)
        lastName: {
            type: DataTypes.String,
        },
        //(String, nullable)
        emailAddress: {
            type: DataTypes.String,
        },
        password: {
            type: DataTypes.String,
        },

    }, {
        sequelize

    });

    // User.associate = (models) => {
    //     User.hasMany(models.Course, {
    //         as: 'user',
    //         foreignKey: {
    //             fieldName: 'userId',
    //             allowNull: false,
    //         },
    //     });
    // };
    return User;
};