const express = require('express');
const router = express.Router();
const { models } = require('../db');
const authenticateUser = require('../auth');
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
router.get('/', asyncHandler(async (req, res) => {
    await models.Course.findAll({})
        .then(course => {
            if (course) {
                res.json({ course: course });
            } else {
                res.status(404).json({
                    message: "The get request is not Not found"
                });
            }
        });
}));

//POST /api/users 201 - Creates a course, sets the Location header to "/", and returns no content
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    if (req.body.title && req.body.description) {
        await models.Course.create({
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime,
            materialsNeeded: req.body.materialsNeeded,
            userId: req.body.userId,
        })
            .then(course => {
                // use setHeader https://stackoverflow.com/questions/14943607/how-to-set-the-location-response-http-header-in-express-framework
                res.setHeader('Location', `/courses/${course.id}`);
                res.status(201).end();
            })
            .catch(err => {
                if (err.name === "SequelizeValidationError") {
                    res.status(400).send(err.message).end();
                }
            });
    } else {
        res.status(400).json({
            message: "Title is required. Description is required."
        });
    }
}));

// get course by primary key (pk) and display edit form
router.get('/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    await models.Course.findByPk(id)
        .then(course => {
            if (course) {
                res.json({ course: course });
            } else {
                res.status(404).json({
                    message: "The get request is not Not found"
                });
            }
        });
}));

// update course details
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await models.Course.findByPk(req.params.id);
    if (course) {
        await models.Course.update(
            {
                title: req.body.title,
                description: req.body.description,
                estimatedTime: req.body.estimatedTime,
                materialsNeeded: req.body.materialsNeeded,
                userId: req.body.userId,
            },
            { where: { id: req.params.id } },
            { fields: ['title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'] }
        )
            .then(course => {
                res.status(204).end();
            })
            .catch(err => {
                if (err.name === "SequelizeValidationError") {
                    res.status(400).send(err.message).end();
                }
            });
    } else {
        res.status(404).json({
            message: "The PUT request is not Not found"
        });
    }
}));

// delete course from database
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await models.Course.findByPk(req.params.id);
    if (course) {
        await models.Course.destroy({
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
