//laying the foundations for the server
import express from 'express';
import mongoose from 'mongoose';
import User from './models/user.mjs';
import Event from './models/event.mjs';
import Odyssey from './models/odyssey.mjs';
import 'dotenv/config';
import cors from 'cors';
const server = express();
// Use CORS with default settings (allowing all cross-origin requests)
server.use(cors());
// Or configure CORS with options for more control
// server.use(cors({
//   origin: 'https://example.com', // or use an array of origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   // ...other configurations
// }));
server.use(express.json());

//establishing the connection with the database
const uri = process.env.MONGODB_URI;
const port = process.env.PORT;
mongoose.connect(uri)
    .then((result) => server.listen(port,() => {console.log("listening on localhost: "+port)}))
    .catch((err) => {console.log(err);})




//Handling Users CRUD Operations...

//POST method - Create a new user
server.post('/users', (req,res) => {
    //creating an instance of the new user using the model "User", and populate it
    const newUser = new User(req.body);
    //saving the new user to the database, and sending the response
    newUser.save()
        .then( (result) => { res.send("user created: \n"+newUser+"\nresult:\n"+result) } )
        .catch( (err) => {res.send("Something Went Wrong!\n"+err)} )
});

// GET method - Retrieve users based on query parameters or specific ID
server.get('/users', (req, res) => {
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
server.put('/users/:id', (req, res) => {
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
server.delete('/users/:id', (req, res) => {
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




//Handling Odysseys CRUD...

// POST method - Create a new odyssey
server.post('/odysseys', (req, res) => {
    const newOdyssey = new Odyssey(req.body);
    newOdyssey.save()
        .then((result) => res.send("Odyssey created: \n" + newOdyssey + "\nResult:\n" + result))
        .catch((err) => res.status(500).send("Something went wrong!\n" + err));
});

// GET method - Retrieve odysseys
server.get('/odysseys', (req, res) => {
    if (req.query.id) {
        Odyssey.findById(req.query.id)
            .then((odyssey) => {
                if (odyssey) res.json(odyssey);
                else res.status(404).send('Odyssey not found');
            })
            .catch((err) => res.status(500).send("Error retrieving odyssey: " + err));
    } else {
        let query = req.query;
        Odyssey.find(query)
            .then((odysseys) => {
                if (odysseys.length > 0) res.json(odysseys);
                else res.status(404).send('No odysseys found matching query');
            })
            .catch((err) => res.status(500).send("Error retrieving odysseys: " + err));
    }
});

// PUT method - Update an odyssey
server.put('/odysseys/:id', (req, res) => {
    Odyssey.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedOdyssey) => {
            if (updatedOdyssey) res.json(updatedOdyssey);
            else res.status(404).send('Odyssey not found');
        })
        .catch((err) => res.status(500).send("Error updating odyssey: " + err));
});

// DELETE method - Delete an odyssey
server.delete('/odysseys/:id', (req, res) => {
    Odyssey.findByIdAndDelete(req.params.id)
        .then((deletedOdyssey) => {
            if (deletedOdyssey) res.send('Odyssey deleted successfully');
            else res.status(404).send('Odyssey not found');
        })
        .catch((err) => res.status(500).send("Error deleting odyssey: " + err));
});

// POST method - Participate in an Odyssey
server.post('/odysseys/:id/participate', (req, res) => {
    const userId = req.body.userId;
    Odyssey.findByIdAndUpdate(req.params.id, 
        { $addToSet: { participants: userId } }, // prevents duplicates
        { new: true })
        .then(updatedOdyssey => {
            if (updatedOdyssey) {
                res.json(updatedOdyssey);
            } else {
                res.status(404).send('Odyssey not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Un-participate from an Odyssey
server.post('/odysseys/:id/unparticipate', (req, res) => {
    const userId = req.body.userId;
    Odyssey.findByIdAndUpdate(req.params.id, 
        { $pull: { participants: userId } },
        { new: true })
        .then(updatedOdyssey => {
            if (updatedOdyssey) {
                res.json(updatedOdyssey);
            } else {
                res.status(404).send('Odyssey not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});




//Handling Events CRUD Operations...

// POST method - Create a new event
server.post('/events', (req, res) => {
    const newEvent = new Event(req.body);
    newEvent.save()
        .then((result) => res.send("Event created: \n" + newEvent + "\nResult:\n" + result))
        .catch((err) => res.status(500).send("Something went wrong!\n" + err));
});

// GET method - Retrieve events
server.get('/events', (req, res) => {
    if (req.query.id) {
        Event.findById(req.query.id)
            .then((event) => {
                if (event) res.json(event);
                else res.status(404).send('Event not found');
            })
            .catch((err) => res.status(500).send("Error retrieving event: " + err));
    } else {
        let query = req.query;
        Event.find(query)
            .then((events) => {
                if (events.length > 0) res.json(events);
                else res.status(404).send('No events found matching query');
            })
            .catch((err) => res.status(500).send("Error retrieving events: " + err));
    }
});

// PUT method - Update an event
server.put('/events/:id', (req, res) => {
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedEvent) => {
            if (updatedEvent) res.json(updatedEvent);
            else res.status(404).send('Event not found');
        })
        .catch((err) => res.status(500).send("Error updating event: " + err));
});

// DELETE method - Delete an event
server.delete('/events/:id', (req, res) => {
    Event.findByIdAndDelete(req.params.id)
        .then((deletedEvent) => {
            if (deletedEvent) {
                res.send('Event deleted successfully');
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch((err) => {
            res.status(500).send("Error deleting event: " + err);
        });
});

// POST method - Participate in an Event
server.post('/events/:id/participate', (req, res) => {
    const userId = req.body.userId;
    Event.findByIdAndUpdate(req.params.id, 
        { $addToSet: { participants: userId } }, // prevents duplicates
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Un-participate from an Event
server.post('/events/:id/unparticipate', (req, res) => {
    const userId = req.body.userId;
    Event.findByIdAndUpdate(req.params.id, 
        { $pull: { participants: userId } },
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Save an Event
server.post('/users/:id/saveEvent', (req, res) => {
    const eventId = req.body.eventId;
    User.findByIdAndUpdate(req.params.id, 
        { $addToSet: { savedEvents: eventId } }, // prevents duplicates
        { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Unsave an Event
server.post('/users/:id/unsaveEvent', (req, res) => {
    const eventId = req.body.eventId;
    User.findByIdAndUpdate(req.params.id, 
        { $pull: { savedEvents: eventId } },
        { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Add Memory to an Event
server.post('/events/:id/addMemory', (req, res) => {
    const memoryUrl = req.body.memoryUrl;
    Event.findByIdAndUpdate(req.params.id, 
        { $addToSet: { memories: memoryUrl } }, // prevents duplicates
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error updating event: " + err));
});

// POST method - Remove Memory from an Event
server.post('/events/:id/removeMemory', (req, res) => {
    const memoryUrl = req.body.memoryUrl;
    Event.findByIdAndUpdate(req.params.id, 
        { $pull: { memories: memoryUrl } },
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error updating event: " + err));
});