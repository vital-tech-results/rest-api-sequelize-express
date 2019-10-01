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




const authenticateUser = (req, res, next) => {
    let message = null;

    const credentials = auth(req);

    if (credentials) {
        const user = models.User.findAll({
            limit: 1,
            where: {
                emailAddress: credentials.name,
                password: credentials.pass,
            }
        });
        console.log("this is user.password:", credentials.name);
        if (user) {
            // const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            // if (authenticated) {
            //     console.log(`Authentication successful for username: ${user.emailAddress}`);
            //     req.currentUser = user;
            // } else {
            //     message = `Authentication failure for username: ${credentials.name}`;
            // }
            console.log(user.emailAddress)
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: `Access Denied` });
    } else {
        next();
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

/** Set up permissions to require users to be signed in
 * Add a middleware function that attempts to get the user credentials from the Authorization header set on the request.
 * You can use the basic-auth npm package to parse the Authorization header into the user's credentials.
 * The user's credentials will contain two values: a name value—the user's email address—and a pass value—the user's password (in clear text).
 * Use the user's email address to attempt to retrieve the user from the database.
 * If a user was found for the provided email address, then check that user's stored hashed password against the clear text password given using bcryptjs.
 * If the password comparison succeeds, then set the user on the request so that each following middleware function has access to it.
 * If the password comparison fails, then return a 401 status code to the user.
 * 
 * Use this middleware in the following routes:
GET /api/users
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id
 */
router.get('/', authenticateUser, (req, res) => {
    const user = req.currentUser;
    res.send('ok from line 110').end();
    // res.json({
    //     name: user.name,
    //     username: user.username,
    // });





});


//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', asyncHandler(async (req, res) => {
    //bcrypt hash function adapted from https://medium.com/@mridu.sh92/a-quick-guide-for-authentication-using-bcrypt-on-express-nodejs-1d8791bb418f
    const saltRounds = 10;
    if (req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password) {
        bcrypt.hashSync(req.body.password, saltRounds, async (err, hash) => {
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
