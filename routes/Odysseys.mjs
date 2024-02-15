import express from 'express';
import Odyssey from '../models/odyssey.mjs';
import 'dotenv/config';
import {expressjwt as JWT} from 'express-jwt';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// Apply expressJwt middleware with your JWT_SECRET_KEY
const requireAuth = JWT({ secret: JWT_SECRET_KEY , algorithms: ['HS256']});


const odysseysRouter = express.Router();





//Handling Odysseys CRUD...

// POST method - Create a new odyssey
odysseysRouter.post('/', requireAuth,  (req, res) => {
    const newOdyssey = new Odyssey(req.body);
    newOdyssey.save()
        .then((result) => res.status(201).send(result))
        .catch((err) => res.status(500).send("Something went wrong!\n" + err));
});

// GET method - Retrieve odysseys
odysseysRouter.get('/', requireAuth,  (req, res) => {
    //scenario 1: Retrieve an odyssey by ID
    if (req.query.id) {
        Odyssey.findById(req.query.id)
            .then((odyssey) => {
                if (odyssey) {res.status(200).json(odyssey)}
                else {res.status(404).send('Odyssey not found')};
            })
            .catch((err) => res.status(500).send("Error retrieving odyssey: " + err));
    } 
    //scenario 2: Retrieve odysseys by query
    else if (req.query) {
        let query = req.query;
        Odyssey.find(query)
            .then((odysseys) => {
                if (odysseys.length > 0) {res.status(200).json(odysseys)}
                else {res.status(404).send('No odysseys found matching query')};
            })
            .catch((err) => res.status(500).send("Error retrieving odysseys: " + err));
    } 
    //scenario 3: Retrieve all odysseys
    else {
        // Retrieve all odysseys
        Odyssey.find()
            .then((odysseys) => res.status(200).json(odysseys))
            .catch((err) => res.status(500).send("Error retrieving odysseys: " + err));
    }
});

// PUT method - Update an odyssey
odysseysRouter.put('/:id', requireAuth, (req, res) => {
    Odyssey.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedOdyssey) => {
            if (updatedOdyssey) res.status(200).json(updatedOdyssey);
            else res.status(404).send('Odyssey not found');
        })
        .catch((err) => res.status(500).send("Error updating odyssey: " + err));
});

// DELETE method - Delete an odyssey
odysseysRouter.delete('/:id', requireAuth, (req, res) => {
    Odyssey.findByIdAndDelete(req.params.id)
        .then((deletedOdyssey) => {
            if (deletedOdyssey) res.status(200).send('Odyssey deleted successfully');
            else res.status(404).send('Odyssey not found');
        })
        .catch((err) => res.status(500).send("Error deleting odyssey: " + err));
});

// POST method - Participate in an Odyssey
odysseysRouter.post('/:id/participate', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Odyssey.findByIdAndUpdate(req.params.id, 
        { $addToSet: { participants: userId } }, // prevents duplicates
        { new: true })
        .then(updatedOdyssey => {
            if (updatedOdyssey) {
                res.status(200).json(updatedOdyssey);
            } else {
                res.status(404).send('Odyssey not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});

// POST method - Un-participate from an Odyssey
odysseysRouter.post('/:id/unparticipate', requireAuth, (req, res) => {
    const userId = req.body.userId;
    Odyssey.findByIdAndUpdate(req.params.id, 
        { $pull: { participants: userId } },
        { new: true })
        .then(updatedOdyssey => {
            if (updatedOdyssey) {
                res.status(200).json(updatedOdyssey);
            } else {
                res.status(404).send('Odyssey not found');
            }
        })
        .catch(err => res.status(500).send("Error: " + err));
});




export default odysseysRouter;