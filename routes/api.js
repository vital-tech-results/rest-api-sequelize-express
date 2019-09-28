const express = require('express');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const { models } = require('../models');
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

/** ADAPTED FROM
 * https://sequelize.readthedocs.io/en/1.7.0/articles/express/ 
 * https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
 * */
// get list of ALL users currently in database
app.get('/users', (req, res) => {
    models.User.findAll({}
    )
        .then(user => {
            res.send("all users");
        });
    // res.send("all users");
});


module.exports = app;
