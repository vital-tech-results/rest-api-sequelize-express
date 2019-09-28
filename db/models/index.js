const Sequelize = require('sequelize');
// const models = require('./models');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fsjstd-restapi',
    //logging: false
    // you can define global model options here using the define: {}  object
});

const db = {
    sequelize,
    Sequelize,
    models: {},
};


/**
 * Use the authenticate() method to test the connection to the database.
 * Log a message to the console indicating if the connection was
 * successfully made or failed.
 * use the following or use this:
 * (async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database successful!');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
})();
 */
sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully (as of Sept 28 2019).');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = db;