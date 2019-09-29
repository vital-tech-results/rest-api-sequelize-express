const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { models } = require('../db');
const bcryptjs = require('bcryptjs');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));
//express.json as seen here https://teamtreehouse.com/library/create-a-new-quote
router.use(express.json());


/**adapted from https://teamtreehouse.com/library/refactor-with-express-middleware
 * global try / catch with async/await
 * instead of having try/catch in every route below
 * this wraps the req,res callback in a try/catch block
 * and uses async/await as well
 */
const asyncHandler = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    } catch (err) {
        next(err);
    }
}

/** ADAPTED FROM
 * https://sequelize.readthedocs.io/en/1.7.0/articles/express/ 
 * https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
 * */
// get list of ALL users currently in database
router.get('/', asyncHandler(async (req, res) => {
    await models.User.findAll({})
        .then(user => {
            if (user) {
                res.json({ user: user });
            } else {
                res.status(404).json({
                    message: "The get request is not Not found"
                });
            }
        });
}));

//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', asyncHandler(async (req, res) => {
    if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
        await models.User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailAddress: req.body.emailAddress,
            password: req.body.password
        })
            .then(user => {
                res.status(201).json({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    emailAddress: req.body.emailAddress,
                    password: req.body.password
                });

            });
    } else {
        res.status(400).json({
            message: "First name is required. Last name is required. Email address is required. Password is required"
        });
    }
}));

// get user by primary key (pk) and display edit form
router.get('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    await models.User.findByPk(id)
        .then(user => {
            if (user) {
                res.json({ user: user });
            } else {
                res.status(404).json({
                    message: "The get request is not Not found"
                });
            }
        });
}));

// update user details
router.put('/:id', asyncHandler(async (req, res, next) => {
    const user = await models.User.findByPk(req.params.id);
    if (user) {
        await models.User.update(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                emailAddress: req.body.emailAddress,
                password: req.body.password
            },
            { where: { id: req.params.id } },
            { fields: ['firstName', 'lastName', 'emailAddress', 'password'] }
        )
            .then(user => {
                // res.redirect('/');
                res.status(204).end();
            });
    } else {
        res.status(404).json({
            message: "The PUT request is not Not found"
        });
    }
}));

// delete user from database
router.delete('/:id', asyncHandler(async (req, res, next) => {
    await models.User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(book => {
            // res.redirect('/');
            res.send('deleted user!');
        });
}));

module.exports = router;
