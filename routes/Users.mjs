import express from 'express';
import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {expressjwt as JWT} from 'express-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Apply expressJwt middleware with your JWT_SECRET_KEY
const requireAuth = JWT({ secret: JWT_SECRET_KEY , algorithms: ['HS256']});

const router = express.Router();

//Handling Users CRUD Operations...

//POST method - Create a new user
router.post('/users', (req,res) => {
    //creating an instance of the new user using the model "User", and populate it
    const newUser = new User(req.body);
    //saving the new user to the database, and sending the response
    newUser.save()
        .then( (result) => { res.send("user created: \n"+newUser+"\nresult:\n"+result) } )
        .catch( (err) => {res.send("Something Went Wrong!\n"+err)} )
});


//POST method - Login a user
router.post('/users/login', (req, res) => {
    // Check if email and password are present in the request
    if (req.body.email && req.body.password) {
        // Check if user exists in the database
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    // Check if password matches
                    if (user.password === req.body.password) {
                        // Create a token
                        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY);
                        res.json({ token: token });
                    } else {
                        res.status(401).send('Incorrect password');
                    }
                } else {
                    res.status(404).send('User not found');
                }
            })
            .catch((err) => {
                res.status(500).send("Error logging in: " + err);
            });
    } else {
        res.status(400).send('Email and password are required in the request body');
    }
});

// GET method - Retrieve users based on query parameters or specific ID
router.get('/users', requireAuth,  (req, res) => {
    // Check if there is an ID in the query
    if (req.query.id) {
        User.findById(req.query.id)
            .then((user) => {
                if (user) {
                    res.json(user);
                } else {
                    res.status(404).send('User not found');
                }
            })
            .catch((err) => {
                res.status(500).send("Error retrieving user: " + err);
            });
    } else {
        // If no ID, check other query parameters
        let query = req.query;
        User.find(query)
            .then((users) => {
                if (users.length > 0) {
                    res.json(users);
                } else {
                    res.status(404).send('No users found matching query');
                }
            })
            .catch((err) => {
                res.status(500).send("Error retrieving users: " + err);
            });
    }
});

// PUT method - Update a user by ID
router.put('/users/:id', requireAuth,  (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedUser) => {
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch((err) => {
            res.status(500).send("Error updating user: " + err);
        });
});

// DELETE method - Delete a user by ID
router.delete('/users/:id', requireAuth,  (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then((deletedUser) => {
            if (deletedUser) {
                res.send('User deleted successfully');
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch((err) => {
            res.status(500).send("Error deleting user: " + err);
        });
});




export default router;