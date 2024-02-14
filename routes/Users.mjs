import express from 'express';
import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {expressjwt as JWT} from 'express-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Apply expressJwt middleware with your JWT_SECRET_KEY
const requireAuth = JWT({ secret: JWT_SECRET_KEY , algorithms: ['HS256']});

const usersRouter = express.Router();

//Handling Users CRUD Operations...

//test endpoint
usersRouter.get('/test', (req,res) => {
    res.send("Hello World!");
});

//POST method - Create a new user
usersRouter.post('/', (req,res) => {
    //creating an instance of the new user using the model "User", and populate it
    const newUser = new User(req.body);
    //saving the new user to the database, and sending the response
    newUser.save()
        .then( (result) => { 
            // Create a token
            const token = jwt.sign({ id: result.id }, JWT_SECRET_KEY,  { expiresIn: '1w' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.send(result) 
        } )
        .catch( (err) => {res.send(err)} )
});

//POST method - Login a user
usersRouter.post('/login', (req, res) => {
    // Check if email and password are present in the request
    if (req.body.email && req.body.password) {
        // Check if user exists in the database and populate the odysseys
        User.findOne({ email: req.body.email }).populate('odysseys')
            .then((user) => {
                if (user) {
                    // Check if password matches
                    if (user.password === req.body.password) {
                        // Create a token
                        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY,  { expiresIn: '1w' });
                        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
                        const userInfo = {
                            _id: user._id,
                            email: user.email,
                            username: user.username,
                            fullname: user.fullname,
                            jobtitle: user.jobtitle,
                            brief: user.brief,
                            desiredplaces: user.desiredplaces,
                            visitedplaces: user.visitedplaces,
                            profilepic: user.profilepic,
                            Odyssey: user.Odyssey,
                            savedEvents: user.savedEvents,
                            joinedEvents: user.joinedEvents,
                            memories: user.memories,
                        };
                        res.status(200).json({ token, user: userInfo });
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

// GET method - authenticate a user
usersRouter.get('/auth', (req, res) => {
    const token = req.cookies['token'];
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      // fetch the user info from the database, store it in the userInfo object, and send it in the response
      User.findById(decoded.id)
        .then((user) => {
          if (user) {
            res.json({ authenticated: true, userInfo: user });
          } else {
            res.status(404).json({ authenticated: false });
          }
        })
        .catch((err) => {
          res.status(500).json({ authenticated: false, error: err });
        });
    } catch (err) {
      res.status(401).json({ authenticated: false });
    }
  });

// POST method - Logout a user
usersRouter.post('/logout', (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      expires: new Date(0) // Set the cookie to expire immediately
    });
    res.status(200).json({ message: 'Logged out successfully' });
  });

// GET method - Retrieve users based on query parameters or specific ID
usersRouter.get('/', requireAuth,  (req, res) => {
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
usersRouter.put('/:id', requireAuth,  (req, res) => {
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
usersRouter.delete('/:id', requireAuth,  (req, res) => {
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




export default usersRouter;