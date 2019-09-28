const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { models } = require('../db');
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

/** ADAPTED FROM
 * https://sequelize.readthedocs.io/en/1.7.0/articles/express/ 
 * https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
 * */
// get list of ALL users currently in database
router.get('/', (req, res) => {
    models.Course.findAll({}
    )
        .then(course => {
            res.json({ course: course });
        });

});


module.exports = router;