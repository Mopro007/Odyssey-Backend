import express from 'express';
import User from '../models/user.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import AWS from 'aws-sdk';
import {expressjwt as JWT} from 'express-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Configure the AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
// S3 instance
const s3 = new AWS.S3();

// Apply expressJwt middleware with your JWT_SECRET_KEY
const requireAuth = JWT({ secret: JWT_SECRET_KEY , algorithms: ['HS256']});

const usersRouter = express.Router();

//Handling Users CRUD Operations...

//test endpoint
usersRouter.get('/test', (req,res) => {
    console.log("testing rpute recieved a request!");
    res.status(200).send("Hello World!");
    console.log("testing route sent a response!");
});

// Generate pre-signed URL for uploading
usersRouter.post('/generate-presigned-url', requireAuth, (req, res) => {
    const { fileName, fileType, bucketName } = req.body;
  
    // Define the necessary parameters for the pre-signed URL
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60, // URL expiry time in seconds
      ContentType: fileType,
      ACL: 'public-read' // Make file publicly readable
    };
  
    // Generate the pre-signed URL
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error generating pre-signed URL" });
      } else {
        res.json({ url });
      }
    });
});

//POST method - Create a new user
usersRouter.post('/', (req,res) => {
    console.log("Request received, body: " + JSON.stringify(req.body));
    //creating an instance of the new user using the model "User", and populate it
    const newUser = new User(req.body);
    //saving the new user to the database, and sending the response
    newUser.save()
        .then( (result) => { 
            // Create a token
            const token = jwt.sign({ id: result.id }, JWT_SECRET_KEY,  { expiresIn: '1w' });
            res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.status(201).json(result);
        } )
        .catch( (err) => {res.send(err)} )
});

//POST method - Login a user
usersRouter.post('/login', (req, res) => {
    // Check if email and password are present in the request
    if (req.body.email && req.body.password) {
        const  email  = req.body.email;
        const  password  = req.body.password;
        // Check if user exists in the database and populate the odysseys
        User.findOne({ email }).populate('Odyssey')
        .then((user) => {
            if (user) {
            // Check if password matches
                if (user.password === password) {
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
            } else{
                console.log("User not found in the database");
                res.status(404).send('User not found');
            }
        })
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

// GET method - Retrieve users by ID or query
usersRouter.get('/', requireAuth, (req, res) => {
    // Check if the 'id' query parameter is present
    if (req.query.id) {
        // Fetch user by ID
        User.findById(req.query.id).populate('Odyssey')
            .then(user => {
                if (user) {
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
                    res.status(200).json({ userInfo: userInfo });
                } else {
                    res.status(404).send('User not found');
                }
            })
            .catch(err => {
                res.status(500).send("Error retrieving user: " + err);
            });
    } else if (Object.keys(req.query).length > 0) {
        // Query users based on other criteria
        let query = req.query;
        User.find(query)
            .then(users => {
                if (users.length > 0) {
                    res.status(200).json({ users: users });
                } else {
                    res.status(404).send('No users found matching query');
                }
            })
            .catch(err => {
                res.status(500).send("Error retrieving users: " + err);
            });
    } else {
        // If no query parameters are provided
        res.status(400).send('Please provide query parameters or an ID');
    }
});


// PUT method - Update a user by ID
usersRouter.put('/:id', requireAuth,  (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedUser) => {
            if (updatedUser) {
                res.status(200).json({updatedUser: updatedUser});
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
                res.status(200).send('User deleted successfully');
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch((err) => {
            res.status(500).send("Error deleting user: " + err);
        });
});




export default usersRouter;