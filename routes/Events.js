import express from 'express';
import Event from './models/event.mjs';
const router = express.Router();





//Handling Events CRUD Operations...

// POST method - Create a new event
router.post('/events', (req, res) => {
    const newEvent = new Event(req.body);
    newEvent.save()
        .then((result) => res.send("Event created: \n" + newEvent + "\nResult:\n" + result))
        .catch((err) => res.status(500).send("Something went wrong!\n" + err));
});

// GET method - Retrieve events
router.get('/events', (req, res) => {
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
router.put('/events/:id', (req, res) => {
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedEvent) => {
            if (updatedEvent) res.json(updatedEvent);
            else res.status(404).send('Event not found');
        })
        .catch((err) => res.status(500).send("Error updating event: " + err));
});

// DELETE method - Delete an event
router.delete('/events/:id', (req, res) => {
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
router.post('/events/:id/participate', (req, res) => {
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
router.post('/events/:id/unparticipate', (req, res) => {
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
router.post('/users/:id/saveEvent', (req, res) => {
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
router.post('/users/:id/unsaveEvent', (req, res) => {
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
router.post('/events/:id/addMemory', (req, res) => {
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
router.post('/events/:id/removeMemory', (req, res) => {
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




export default router;