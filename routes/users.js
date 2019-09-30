const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { models } = require('../db');
const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const compare = require('tsscmp');
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
        if (err.name === "SequelizeValidationError") {
            res.status(400);
            next(err);
        } else {
            next(err);
        }

    }
};

/** ADAPTED FROM
 * https://sequelize.readthedocs.io/en/1.7.0/articles/express/ 
 * https://gist.github.com/vapurrmaid/a111bf3fc0224751cb2f76532aac2465
 * */
// get list of ALL users currently in database
router.get('/all', asyncHandler(async (req, res) => {
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

router.get('/', asyncHandler(async (req, res) => {
    // Basic function to validate credentials for example
    const check = (name, pass) => {
        var valid = true;
        // Simple method to prevent short-circut and use timing-safe compare
        valid = compare(name, user.name) && valid;
        valid = compare(pass, user.pass) && valid;
        return valid;
    };

    const user = auth(req);
    // Check credentials
    if (!user || !check(user.name, user.pass)) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied. Your credentials are not valid.');
    } else {
        await models.User.findAll({
            where: {
                emailAddress: user.name,
                password: user.pass,
            }
        })
            .then(user => {
                if (user) {
                    res.json({ user: user });
                }
            });
        res.end('Access granted');
    }


}));


//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', asyncHandler(async (req, res) => {
    //bcrypt hash function adapted from https://medium.com/@mridu.sh92/a-quick-guide-for-authentication-using-bcrypt-on-express-nodejs-1d8791bb418f
    const saltRounds = 10;
    if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            // Store hash in your password DB.
            await models.User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                emailAddress: req.body.emailAddress,
                password: hash,
            })
                .then(user => {
                    res.status(201).end();
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
router.put('/:id', asyncHandler(async (req, res) => {
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
                res.status(204).end();
            });
    } else {
        res.status(404).json({
            message: "The PUT request is not Not found"
        });
    }
}));

// delete user from database
router.delete('/:id', asyncHandler(async (req, res) => {
    const user = await models.User.findByPk(req.params.id);
    if (user) {


        await models.User.destroy({
            where: {
                id: req.params.id
            }
        })
            .then(book => {
                res.status(204).end();
            });
    } else {
        res.status(404).json({
            message: "The DELETE request is not Not found"
        });
    }
}));

module.exports = router;

/*
                json({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    emailAddress: req.body.emailAddress,
                    password: req.body.password
                });

                */