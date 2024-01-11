import express from 'express';
import User from './models/user.mjs';
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

// GET method - Retrieve users based on query parameters or specific ID
router.get('/users', (req, res) => {
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
router.put('/users/:id', (req, res) => {
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
router.delete('/users/:id', (req, res) => {
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