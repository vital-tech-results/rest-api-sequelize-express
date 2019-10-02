const bcrypt = require('bcryptjs');
const auth = require('basic-auth');
const { models } = require('./db');


const authenticateUser = (req, res, next) => {
    let message = null;
    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);
    const users = models.User.findOne({
        where: {
            emailAddress: credentials.name,
        }
    })
        .then(users => {
            if (credentials) {
                if (users) {
                    const authenticated = bcrypt.compareSync(credentials.pass, users.password);
                    if (authenticated) {
                        console.log(`Authentication successful for emailAddress: ${users.emailAddress}`);
                        req.currentUser = users;
                    } else {
                        message = `Authentication failure for emailAddress: ${users.emailAddress}`;
                    }
                } else {
                    message = `User not found for emailAddress: ${credentials.name}`;
                }
            } else {
                message = 'Auth header not found';
            }

            if (message) {
                console.warn(message);
                res.status(401).json({ message: 'Access Denied' });
            } else {
                next();
            }
        })
        .catch(err => {
            next(err);
        });
};

module.exports = authenticateUser;