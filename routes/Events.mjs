import express from 'express';
import Event from '../models/event.mjs';
import User from '../models/user.mjs';
import 'dotenv/config';
import {expressjwt as JWT} from 'express-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Apply expressJwt middleware with your JWT_SECRET_KEY
const requireAuth = JWT({ secret: JWT_SECRET_KEY , algorithms: ['HS256']});

const eventsRouter = express.Router();





//Handling Events CRUD Operations...

// POST method - Create a new event
eventsRouter.post('/', requireAuth, (req, res) => {
    const newEvent = new Event(req.body);
    newEvent.save()
        .then((result) => res.status(201).send("Event created : "+result._id))
        .catch((err) => res.status(500).send("Something went wrong!\n" + err));
});

// GET method - Retrieve events
eventsRouter.get('/', requireAuth, (req, res) => {
    if (req.query.id) {
        Event.findById(req.query.id)
            .then((event) => {
                if (event) res.status(200).json(event);
                else res.status(404).send('Event not found');
            })
            .catch((err) => res.status(500).send("Error retrieving event: " + err));
    } else if (req.query) {
        let query = req.query;
        Event.find(query)
            .then((events) => {
                if (events.length > 0) res.status(200).json(events);
                else res.status(404).send('No events found matching query');
            })
            .catch((err) => res.status(500).send("Error retrieving events: " + err));
    } else {
        Event.find()
            .then((events) => {
                if (events.length > 0) res.status(200).json(events);
                else res.status(404).send('No events found');
            })
            .catch((err) => res.status(500).send("Error retrieving events: " + err));
    }
});

// PUT method - Update an event
eventsRouter.put('/:id', requireAuth, (req, res) => {
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedEvent) => {
            if (updatedEvent) res.status(200).json(updatedEvent);
            else res.status(404).send('Event not found');
        })
        .catch((err) => res.status(500).send("Error updating event: " + err));
});

// DELETE method - Delete an event
eventsRouter.delete('/:id', (req, res) => {
    Event.findByIdAndDelete(req.params.id)
        .then((deletedEvent) => {
            if (deletedEvent) {
                res.status(200).send('Event deleted successfully');
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch((err) => {
            res.status(500).send("Error deleting event: " + err);
        });
});

// POST method - Participate in an Event
eventsRouter.post('/:id/participate', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Event.findByIdAndUpdate(req.params.id, 
        { $addToSet: { participants: userId } }, // prevents duplicates
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Un-participate from an Event
eventsRouter.post('/:id/unparticipate', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Event.findByIdAndUpdate(req.params.id, 
        { $pull: { participants: userId } },
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Save an Event
eventsRouter.post('/users/:id/saveEvent', requireAuth, (req, res) => {
    const eventId = req.body.eventId;
    User.findByIdAndUpdate(req.params.id, 
        { $addToSet: { savedEvents: eventId } }, // prevents duplicates
        { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Unsave an Event
eventsRouter.post('/users/:id/unsaveEvent', requireAuth, (req, res) => {
    const eventId = req.body.eventId;
    User.findByIdAndUpdate(req.params.id, 
        { $pull: { savedEvents: eventId } },
        { new: true })
        .then(updatedUser => {
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - join an Event
eventsRouter.post('/:id/join', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Event.findByIdAndUpdate(req.params.id, 
        { $addToSet: { participants: userId } }, // prevents duplicates
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Unjoin an Event
eventsRouter.post('/:id/unjoin', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Event.findByIdAndUpdate(req.params.id, 
        { $pull: { participants: userId } },
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Add Memory to an Event
eventsRouter.post('/:id/addMemory', requireAuth, (req, res) => {
    const memoryUrl = req.body.memoryUrl;
    Event.findByIdAndUpdate(req.params.id, 
        { $addToSet: { memories: memoryUrl } }, // prevents duplicates
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error updating event: " + err));
});

// POST method - Remove Memory from an Event
eventsRouter.post('/:id/removeMemory', requireAuth, (req, res) => {
    const memoryUrl = req.body.memoryUrl;
    Event.findByIdAndUpdate(req.params.id, 
        { $pull: { memories: memoryUrl } },
        { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            } else {
                res.status(404).send('Event not found');
            }
        })
        .catch(err => res.status(500).send("Error updating event: " + err));
});




export default eventsRouter;